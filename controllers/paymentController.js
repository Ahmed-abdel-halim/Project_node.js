const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db     = require('../db/db');
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:4200";

// 1. إنشاء جلسة الدفع (Stripe Checkout)
exports.createCheckoutSession = async (req, res) => {
  try {
    // جوهر الطلب الوارد من الواجهة
    const { items, shipping_cost, order_id } = req.body;
    const userId = req.user?.id; // مفترض أن الـ Middleware وضع req.user

    if (!order_id) {
      return res.status(400).json({ error: 'يجب إرسال order_id.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'يجب إرسال مصفوفة items.' });
    }

    // 1.1. استعلام لإحضار بيانات المنتجات من الجدول
    const productIds = items.map(item => item.id);
    const [products] = await db.query(
      `SELECT id, name, description, price, image_url
       FROM products
       WHERE id IN (?)`,
      [productIds]
    );

    if (products.length !== productIds.length) {
      return res.status(400).json({ error: "لم يتم العثور على بعض المنتجات في قاعدة البيانات." });
    }

    // 1.2. بناء line_items التي يطلبها Stripe
    const line_items = items.map(item => {
      const product = products.find(p => p.id === item.id);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description || '',
            images: product.image_url ? [product.image_url] : [],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    // 1.3. إضافة Shipping Cost كعنصر منفصل إذا كان موجودًا
    if (shipping_cost && shipping_cost > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping Cost',
          },
          unit_amount: Math.round(shipping_cost * 100),
        },
        quantity: 1,
      });
    }

    // 1.4. إنشاء جلسة الدفع في Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,  
      cancel_url: `${CLIENT_URL}/cancel`,  
      metadata: {
        userId: userId.toString(),
        orderId: order_id.toString()
      }
    });

    // 1.5. إرجاع رابط الجلسة ليتم تحويل العميل إليه
    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Webhook لـ Stripe: يتلقّى Stripe إشعارًا عند إتمام الدفع
exports.handleWebhook = (req, res) => {
// تجاهل التحقق من التوقيع مؤقتًا عند الاختبار عبر Postman:
const event = req.body;

if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const { orderId, userId } = session.metadata;
  const amount = session.amount_total / 100;
  const paymentIntentId = session.payment_intent;

  // حدّث الطلب في جدول orders
  const updateOrderSql = `
    UPDATE orders
    SET status = ?, payment_method = ?
    WHERE id = ?
  `;
  db.query(updateOrderSql, ['paid', 'stripe', parseInt(orderId, 10)])
    .then(() => {
      // أدخل سجل في جدول payments
      const insertPaymentSql = `
        INSERT INTO payments (order_id, payment_method, status, transaction_id, amount, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      return db.query(insertPaymentSql, [
        parseInt(orderId, 10),
        'stripe',
        'succeeded',
        paymentIntentId,
        amount
      ]);
    })
    .then(() => console.log(`✅ Order #${orderId} marked as paid.`))
    .catch(err => console.error('DB Error on Webhook:', err));
}

res.json({ received: true });

};

// 3. استرجاع معلومات الجلسة من Stripe (اختياري)
exports.getCheckoutSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 4. استرجاع كل الطلبات (يمكن استخدامه في لوحة المستخدم لعرض التاريخ أيضاً)
exports.getOrders = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ?', [req.user.id]);
    res.json(orders);
  } catch (err) {
    console.error('DB Error fetching orders:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

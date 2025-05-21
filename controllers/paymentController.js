const db = require('../db/dbpayment');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  try {
    const { items, shipping_cost } = req.body;
    const userId = req.user ? req.user.id : 1;

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        userId: userId.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.handleWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId || 1;
    const amount = session.amount_total / 100;
    const paymentIntentId = session.payment_intent;

    const sql = 'INSERT INTO orders (user_id, total_amount, status, payment_intent_id) VALUES (?, ?, ?, ?)';
    db.query(sql, [userId, amount, 'paid', paymentIntentId], (err) => {
      if (err) {
        console.error('DB Error:', err);
      } else {
        console.log('✅ Order saved in DB');
      }
    });
  }

  res.json({ received: true });
};

exports.getCheckoutSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json(session);
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

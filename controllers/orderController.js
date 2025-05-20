const db = require("../db/db");

exports.placeOrder = async (req, res) => {
  const { user_id, address_id, items, payment_method } = req.body;

  if (!user_id || !address_id || !items || items.length === 0) {
    return res.status(400).json({ message: "جميع الحقول مطلوبة." });
  }

  try {
    let totalPrice = 0;

    for (let item of items) {
      const [productRows] = await db.query(
        "SELECT price FROM products WHERE id = ?",
        [item.product_id]
      );
      if (productRows.length === 0) {
        return res
          .status(404)
          .json({ message: `المنتج ${item.product_id} غير موجود.` });
      }
      const productPrice = productRows[0].price;
      totalPrice += productPrice * item.quantity;
      item.price = productPrice;
    }

    const [orderResult] = await db.query(
      "INSERT INTO orders (user_id, address_id, total_price, payment_method) VALUES (?, ?, ?, ?)",
      [user_id, address_id, totalPrice, payment_method || "cash"]
    );

    const orderId = orderResult.insertId;

    for (let item of items) {
      await db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    res.status(201).json({
      message: "تم إنشاء الطلب بنجاح.",
      order_id: orderId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الطلب." });
  }
};

exports.getOrderHistory = async (req, res) => {
  const userId = req.user?.id || req.params.user_id;

  try {
    const [orders] = await db.query(
      `
      SELECT o.id, o.status, o.total_price, o.payment_method, o.created_at,
             oi.product_id, oi.quantity, oi.price_at_purchase,
             p.name AS product_name, p.image_url
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `,
      [userId]
    );

    const orderMap = new Map();

    for (const row of orders) {
      if (!orderMap.has(row.id)) {
        orderMap.set(row.id, {
          id: row.id,
          status: row.status,
          total_price: row.total_price,
          payment_method: row.payment_method,
          created_at: row.created_at,
          items: [],
        });
      }

      if (row.product_id) {
        orderMap.get(row.id).items.push({
          product_id: row.product_id,
          product_name: row.product_name,
          image_url: row.image_url,
          quantity: row.quantity,
          price_at_purchase: row.price_at_purchase,
        });
      }
    }

    res.json(Array.from(orderMap.values()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب سجل الطلبات." });
  }
};

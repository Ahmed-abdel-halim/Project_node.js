const db = require('../db/db');

async function getOrderHistory(req, res) {
  const userId = req.user.id; 

  try {
    const [orders] = await db.query(`
      SELECT o.id, o.status, o.total_amount, o.payment_method, o.created_at,
             oi.product_id, oi.quantity, oi.price_at_purchase,
             p.name as product_name, p.image_url
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

    const orderMap = new Map();

    for (const row of orders) {
      if (!orderMap.has(row.id)) {
        orderMap.set(row.id, {
          id: row.id,
          status: row.status,
          total_amount: row.total_amount,
          payment_method: row.payment_method,
          created_at: row.created_at,
          items: [],
        });
      }
      orderMap.get(row.id).items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        image_url: row.image_url,
        quantity: row.quantity,
        price_at_purchase: row.price_at_purchase,
      });
    }

    res.json(Array.from(orderMap.values()));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { getOrderHistory };

const db = require('../db/connection');

// عرض كل الطلبات مع تفاصيل المستخدم والمنتجات
exports.getAllOrders = async (req, res) => {
  const [orders] = await db.query(`
    SELECT o.id AS order_id, o.status, o.total_amount, o.created_at,
           u.name AS customer_name, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `);

  for (let order of orders) {
    const [items] = await db.query(`
      SELECT p.name, oi.quantity, oi.price_at_purchase
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [order.order_id]);
    order.items = items;
  }

  res.json(orders);
};


exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ message: 'Order status updated' });
};


exports.getOrdersReport = async (req, res) => {
  const [[{ total_orders }]] = await db.query('SELECT COUNT(*) AS total_orders FROM orders');
  const [[{ total_revenue }]] = await db.query('SELECT SUM(total_amount) AS total_revenue FROM orders');

  res.json({ total_orders, total_revenue });
};
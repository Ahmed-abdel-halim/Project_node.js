const db = require("../db/dbpayment");

// Add item to cart
exports.addToCart = (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  const sql =
    "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)";
  db.query(sql, [user_id, product_id, quantity], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Item added to cart" });
  });
};

// Get cart by user
exports.getCart = (req, res) => {
  const userId = req.params.userId;
  const sql = `SELECT c.*, p.name, p.price FROM cart_items c 
               JOIN products p ON c.product_id = p.id 
               WHERE c.user_id = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Update cart item quantity
exports.updateCartItem = (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const sql = "UPDATE cart_items SET quantity = ? WHERE id = ?";
  db.query(sql, [quantity, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cart item updated" });
  });
};

// Delete item from cart
exports.deleteCartItem = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM cart_items WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cart item deleted" });
  });
};

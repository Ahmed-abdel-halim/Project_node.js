const db = require("../db/dbpayment");

//  Add item to cart
exports.addToCart = (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  const checkSql = "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?";
  db.query(checkSql, [userId, product_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      const updateSql = "UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?";
      db.query(updateSql, [quantity, userId, product_id], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: '✅ Product quantity updated in cart.' });
      });
    } else {
      const insertSql = "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)";
      db.query(insertSql, [userId, product_id, quantity], (err3) => {
        if (err3) return res.status(500).json({ error: err3.message });
        res.json({ message: '✅ Product added to cart.' });
      });
    }
  });
};

exports.getCart = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT c.id AS cart_item_id, c.quantity, 
           p.id AS product_id, p.name, p.price,p.rating, p.image_url 
    FROM cart_items c 
    JOIN products p ON c.product_id = p.id 
    WHERE c.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

exports.updateCartItem = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params; 
  const { quantity } = req.body;

  const sql = "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?";
  db.query(sql, [quantity, id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Cart item not found or unauthorized" });
    }
    res.json({ message: "Cart item updated" });
  });
};

exports.deleteCartItem = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params; 

  const sql = "DELETE FROM cart_items WHERE id = ? AND user_id = ?";
  db.query(sql, [id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Cart item not found or unauthorized" });
    }
    res.json({ message: "Cart item deleted" });
  });
};

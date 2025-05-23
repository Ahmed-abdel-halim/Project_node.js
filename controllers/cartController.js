const db = require("../db/dbpayment");

//  Add item to cart
exports.addToCart = (req, res) => {
  const user_id = req.user.id; // أخذ user من التوكن
  const { product_id, quantity } = req.body;

  const sql = "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)";
  db.query(sql, [user_id, product_id, quantity], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Item added to cart" });
  });
};

// Get cart for authenticated user
exports.getCart = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT c.id AS cart_item_id, c.quantity, 
           p.id AS product_id, p.name, p.price, p.image_url 
    FROM cart_items c 
    JOIN products p ON c.product_id = p.id 
    WHERE c.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

//  Update quantity of a specific cart item (owned by the logged-in user)
exports.updateCartItem = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params; // cart_item id
  const { quantity } = req.body;

  const sql = "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?";
  db.query(sql, [quantity, id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found or unauthorized" });
    }
    res.json({ message: "Cart item updated" });
  });
};

//  Delete cart item (only if owned by the logged-in user)
exports.deleteCartItem = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params; // cart_item id

  const sql = "DELETE FROM cart_items WHERE id = ? AND user_id = ?";
  db.query(sql, [id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found or unauthorized" });
    }
    res.json({ message: "Cart item deleted" });
  });
};

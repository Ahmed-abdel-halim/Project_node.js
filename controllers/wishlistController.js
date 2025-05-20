const db = require("../db/db");

// Add to wishlist
exports.addToWishlist = (req, res) => {
  const { user_id, product_id } = req.body;
  const sql = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";
  db.query(sql, [user_id, product_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Added to wishlist" });
  });
};

// Get wishlist for user
exports.getWishlist = (req, res) => {
  const userId = req.params.userId;
  const sql = `SELECT w.*, p.name, p.price, p.image_url FROM wishlist w 
               JOIN products p ON w.product_id = p.id 
               WHERE w.user_id = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Delete from wishlist
exports.deleteWishlistItem = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM wishlist WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Removed from wishlist" });
  });
};

// Search wishlist items by keyword or filters
exports.searchWishlist = (req, res) => {
  const userId = req.params.userId;
  const { keyword, minPrice, maxPrice } = req.query;

  const sql = `
  SELECT w.*, p.name, p.price, p.image_url 
  FROM wishlist w 
  JOIN products p ON w.product_id = p.id 
  WHERE w.user_id = ?
`;

  const params = [userId];

  if (keyword) {
    sql += " AND p.name LIKE ?";
    params.push(`%${keyword}%`);
  }

  if (minPrice) {
    sql += " AND p.price >= ?";
    params.push(minPrice);
  }

  if (maxPrice) {
    sql += " AND p.price <= ?";
    params.push(maxPrice);
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

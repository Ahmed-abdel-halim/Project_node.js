const db = require("../db/dbpayment");

//  Add to wishlist (مع التحقق من وجود المنتج)
exports.addToWishlist = (req, res) => {
  const user_id = req.user.id; //  من التوكن
  const { product_id } = req.body;

  const checkProductSql = "SELECT id FROM products WHERE id = ?";
  db.query(checkProductSql, [product_id], (err, result) => {
    if (err) return res.status(500).json({ error: "DB Error: " + err.message });

    if (result.length === 0) {
      return res.status(400).json({ error: "المنتج غير موجود في قاعدة البيانات." });
    }

    const sql = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";
    db.query(sql, [user_id, product_id], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: "هذا المنتج موجود بالفعل في المفضلة." });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "تمت الإضافة إلى المفضلة بنجاح." });
    });
  });
};

//  Get wishlist for current user
exports.getWishlist = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT w.id AS wishlist_id, p.id AS product_id, p.name, p.price, p.image_url
    FROM wishlist w 
    JOIN products p ON w.product_id = p.id 
    WHERE w.user_id = ?
  `;
  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

//  Delete item from wishlist
exports.deleteWishlistItem = (req, res) => {
  const user_id = req.user.id;
  const { product_id } = req.params;

  const sql = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?";
  db.query(sql, [user_id, product_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "العنصر غير موجود في المفضلة." });
    }

    res.json({ message: "تم الحذف من المفضلة." });
  });
};

// Search wishlist (by keyword and price range)
exports.searchWishlist = (req, res) => {
  const user_id = req.user.id;
  const { keyword, minPrice, maxPrice } = req.query;

  let sql = `
    SELECT w.id AS wishlist_id, p.id AS product_id, p.name, p.price, p.image_url
    FROM wishlist w 
    JOIN products p ON w.product_id = p.id 
    WHERE w.user_id = ?
  `;
  const params = [user_id];

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

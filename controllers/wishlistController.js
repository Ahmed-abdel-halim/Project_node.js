const connectDB = require("../db/wishlist");

//  Add to wishlist (مع التحقق من وجود المنتج)
exports.addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  let connection;

  try {
    connection = await connectDB();

    // تحقق هل المنتج موجود بالفعل
    const [existing] = await connection.query(
      "SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?",
      [userId, product_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Product already in wishlist" });
    }

    await connection.query(
      "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)",
      [userId, product_id]
    );

    res.status(201).json({ message: "Product added to wishlist" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (connection) await connection.end();
  }
};

//  Get wishlist for current user
exports.getWishlist = async (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT w.id AS wishlist_id, p.id AS product_id, p.name, p.price, p.rating, p.image_url
    FROM wishlist w 
    JOIN products p ON w.product_id = p.id 
    WHERE w.user_id = ?
  `;

  try {
    const connection = await connectDB();

    const [result] = await connection.query(sql, [user_id]);

    res.json(result);

    await connection.end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Delete item from wishlist
exports.deleteWishlistItem = async (req, res) => {
  const user_id = req.user.id;
  const { product_id } = req.params;

  const sql = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?";

  try {
    const connection = await connectDB();

    const [result] = await connection.query(sql, [user_id, product_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "العنصر غير موجود في المفضلة." });
    }

    res.json({ message: "تم الحذف من المفضلة." });

    await connection.end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search wishlist (by keyword and price range)
exports.searchWishlist = async (req, res) => {
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

  try {
    const connection = await connectDB();

    const [result] = await connection.query(sql, params);

    res.json(result);

    await connection.end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

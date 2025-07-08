const db = require('../db/db'); // أو مسار الاتصال بقاعدة البيانات

exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name FROM categories ORDER BY name");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error loading categories:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
const db = require("../db/connection");

exports.getAllProducts = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products");
  res.json(rows);
};

exports.addProducts = async (req, res) => {
  const products = req.body; // Expect array of products

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Expected an array of products." });
  }

  const values = products.map((p) => [
    p.name,
    p.description,
    p.price,
    p.stock_quantity,
    p.brand,
    p.category_id,
    p.rating,
    p.image_url,
  ]);

  try {
    await db.query(
      `INSERT INTO products (name, description, price, stock_quantity, brand, category_id, rating, image_url)
       VALUES ?`,
      [values]
    );
    res.json({ message: "Products added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add products." });
  }
};

exports.updateProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    stock_quantity,
    brand,
    category_id,
    rating,
    image_url,
  } = req.body;

  try {
    await db.query(
      "UPDATE products SET name=?, description=?, price=?, stock_quantity=?, brand=?, category_id=?, rating=?, image_url=? WHERE id=?",
      [
        name,
        description,
        price,
        stock_quantity,
        brand,
        category_id,
        rating,
        image_url,
        req.params.id,
      ]
    );
    res.json({ message: "Product updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product." });
  }
};


exports.deleteProduct = async (req, res) => {
  await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
  res.json({ message: "Product deleted" });
};

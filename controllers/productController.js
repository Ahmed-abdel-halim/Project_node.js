const db = require("../db/db");
const { validationResult } = require("express-validator");

exports.getAllProducts = async (req, res) => {
  try {
    
    const { category_id, price_min, price_max, brand } = req.query;
    
    console.log("Request filters:", { category_id, price_min, price_max, brand });

    let query = "SELECT * FROM products";
    const params = [];
    const conditions = [];

    if (brand && brand.trim() !== '') {
      conditions.push("LOWER(brand) = LOWER(?)");
      params.push(brand.trim());
      console.log(`Brand filter applied: '${brand.trim()}'`);
    }

    if (category_id && !isNaN(parseInt(category_id))) {
      conditions.push("category_id = ?");
      params.push(parseInt(category_id));
      console.log(`Category filter applied: ${category_id}`);
    }

    if (price_min && !isNaN(parseFloat(price_min))) {
      conditions.push("price >= ?");
      params.push(parseFloat(price_min));
      console.log(`Min price filter applied: ${price_min}`);
    }

    if (price_max && !isNaN(parseFloat(price_max))) {
      conditions.push("price <= ?");
      params.push(parseFloat(price_max));
      console.log(`Max price filter applied: ${price_max}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    console.log("Final Query:", query);
    console.log("Parameters:", params);

    const [rows] = await db.query(query, params);
    
    console.log(`Query returned ${rows.length} products`);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error in getAllProducts:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [product] = await db.query("SELECT p.id,p.name,p.description,p.price,p.brand,p.stock_quantity,p.image_url,p.rating,c.name as category_name FROM products as p JOIN categories as c ON p.category_id = c.id WHERE p.id = ?", [
      id,
    ]);

    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const [reviews] = await db.query(
      "SELECT * FROM reviews WHERE product_id = ?",
      [id]
    );

    res.json({ product: product[0], reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addProductReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { rating, comment } = req.body;
  const { id } = req.params;

  try {
    await db.query(
      "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)",
      [req.user.id, id, rating, comment]
    );

    res.json({ message: "Review added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

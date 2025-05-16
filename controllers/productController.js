const db = require('../db/db');
const { validationResult } = require('express-validator');

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [product] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const [reviews] = await db.query('SELECT * FROM reviews WHERE product_id = ?', [id]);

    res.json({ product: product[0], reviews });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductsByFilter = async (req, res) => {
  try {
    const { category_id, price_min, price_max, brand } = req.body;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category_id) {
      query += ' AND category_id = ?';
      params.push(category_id);
    }
    if (price_min) {
      query += ' AND price >= ?';
      params.push(price_min);
    }
    if (price_max) {
      query += ' AND price <= ?';
      params.push(price_max);
    }
    if (brand) {
      query += ' AND brand = ?';
      params.push(brand);
    }

    const [products] = await db.query(query, params);
    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addProductReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { rating, comment } = req.body;
  const { id } = req.params;

  try {
    await db.query(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
      [req.user.id, id, rating, comment]
    );

    res.json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


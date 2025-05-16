const db = require('../db/connection');

exports.getAllProducts = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM products');
  res.json(rows);
};

exports.addProduct = async (req, res) => {
  const { name, description, price, stock_quantity, brand, category_id, image_url } = req.body;
  await db.query(
    'INSERT INTO products (name, description, price, stock_quantity, brand, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, stock_quantity, brand, category_id, image_url]
  );
  res.json({ message: 'Product added' });
};

exports.updateProduct = async (req, res) => {
  const { name, description, price, stock_quantity, brand, category_id, image_url } = req.body;
  await db.query(
    'UPDATE products SET name=?, description=?, price=?, stock_quantity=?, brand=?, category_id=?, image_url=? WHERE id=?',
    [name, description, price, stock_quantity, brand, category_id, image_url, req.params.id]
  );
  res.json({ message: 'Product updated' });
};

exports.deleteProduct = async (req, res) => {
  await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ message: 'Product deleted' });
};

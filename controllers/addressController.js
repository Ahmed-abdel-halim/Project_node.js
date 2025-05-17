const db = require('../db/db');


exports.createAddress = (req, res) => {
  const { user_id, type, address_line_1, address_line_2, city, state, country, zip_code } = req.body;
  const sql = `INSERT INTO addresses (user_id, type, address_line_1, address_line_2, city, state, country, zip_code)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [user_id, type, address_line_1, address_line_2, city, state, country, zip_code], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Address added successfully', id: result.insertId });
  });
};

exports.getAddressesByUser = (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM addresses WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.updateAddress = (req, res) => {
  const { id } = req.params;
  const { type, address_line_1, address_line_2, city, state, country, zip_code } = req.body;
  const sql = `UPDATE addresses SET type = ?, address_line_1 = ?, address_line_2 = ?, city = ?, state = ?, country = ?, zip_code = ? WHERE id = ?`;
  db.query(sql, [type, address_line_1, address_line_2, city, state, country, zip_code, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Address updated successfully' });
  });
};

exports.deleteAddress = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM addresses WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Address not found' });
    res.json({ message: 'Address deleted successfully' });
  });
};

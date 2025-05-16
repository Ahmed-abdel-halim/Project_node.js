const db = require('../db/connection');

exports.getAllUsers = async (req, res) => {
  const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users');
  res.json(rows);
};

exports.updateUser = async (req, res) => {
  const { name, role } = req.body;
  await db.query('UPDATE users SET name = ?, role = ? WHERE id = ?', [name, role, req.params.id]);
  res.json({ message: 'User updated' });
};

exports.deleteUser = async (req, res) => {
  await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ message: 'User deleted' });
};

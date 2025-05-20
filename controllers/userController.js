// controllers/userController.js
const db = require('../db/db');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    if (email) {
      const [existing] = await db.execute(
        'SELECT * FROM users WHERE email = ? AND id != ?',
        [email, req.user.id]
      );
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    let password_hash;
    if (password) {
      password_hash = await bcrypt.hash(password, saltRounds);
    }

    const query = [];
    const params = [];

    if (name) {
      query.push('name = ?');
      params.push(name);
    }
    if (email) {
      query.push('email = ?');
      params.push(email);
    }
    if (password_hash) {
      query.push('password_hash = ?');
      params.push(password_hash);
    }

    if (query.length === 0) {
      return res.status(400).json({ message: 'No data to update' });
    }

    params.push(req.user.id);

    await db.execute(`UPDATE users SET ${query.join(', ')} WHERE id = ?`, params);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getUserDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    const [orders] = await db.execute(
      `SELECT o.id, o.status, o.total_amount, o.created_at 
       FROM orders o 
       WHERE o.user_id = ? 
       ORDER BY o.created_at DESC`,
      [userId]
    );

    const [wishlist] = await db.execute(
      `SELECT p.id, p.name, p.price, p.image_url 
       FROM wishlist w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      message: "Dashboard fetched successfully",
      data: {
        orders,
        wishlist
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

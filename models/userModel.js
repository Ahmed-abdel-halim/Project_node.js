const { pool } = require('../config/dbConnection');
const bcrypt = require('bcryptjs');

class User {
  // Helper method for executing queries
  static async query(sql, params) {
    const [rows] = await pool.query(sql, params);
    return rows;
  }
  // Create a new user
  static async create({ name, email, password, role = 'customer' }) {
    // Validate input
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required');
    }

    // Check if email exists
    const existing = await this.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      throw new Error('Email already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, role) 
        VALUES (?, ?, ?, ?)`,
      [name, email, password_hash, role]
    );
    // Return user 
    return this.findById(result.insertId);
  }
  //  by id
  static async findById(id) {
    const users = await this.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?', 
      [id]
    );
    return users[0] || null;
  }
//   by email
static async findByEmail(email) {
  const [users] = await pool.query(
    'SELECT * FROM users WHERE email = ?', 
    [email]
  );
  return users[0] || null; 
}
// verfiy 
static async verifyPassword(email, password) {
  const user = await this.findByEmail(email);
  if (!user) return false;
  
  const isMatch = await bcrypt.compare(password, user.password_hash);
  return isMatch ? user : false;
}
}

module.exports = User;
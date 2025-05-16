const db = require("../db/db");

const User = {
  createUser: (userData, callback) => {
    const query =
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)";
    db.query(
      query,
      [userData.name, userData.email, userData.password_hash, userData.role],
      callback
    );
  },
  findUserByEmail: (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], callback);
  },
};

module.exports = User;

const mysql = require("mysql2/promise"); // استخدم mysql2/promise بدل mysql2 العادي
require("dotenv").config();

async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: 'sql12.freesqldatabase.com',
      user: 'sql12780777',
      password: 'gei2ZYAbBJ',
      database: 'sql12780777',
    });
    console.log("MySQL connected");
    return connection;
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
    throw err;
  }
}

module.exports = connectDB;
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // حط الباسورد حسب إعداداتك
  database: 'project',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;

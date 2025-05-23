const mysql = require('mysql2/promise');

const pool = mysql.createPool({
	host: 'sql12.freesqldatabase.com',
	user: 'sql12780777',
	password: 'gei2ZYAbBJ',
	database: 'sql12780777',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;

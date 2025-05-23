const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
	host: 'sql12.freesqldatabase.com',
	user: 'sql12780777',
	password: 'gei2ZYAbBJ',
	database: 'sql12780777',
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
  } else {
    console.log("MySQL connected");
  }
});
module.exports = db;

const mysql = require('mysql2/promise');

const db = mysql.createPool({
	host: 'sql12.freesqldatabase.com',
	user: 'sql12780777',
	password: 'gei2ZYAbBJ',
	database: 'sql12780777',
  waitForConnections: true,
  connectionLimit: 10,    
  queueLimit: 0 ,
    typeCast: function (field, next) {
    // Force convert DECIMAL and NEWDECIMAL to float
    if (field.type === 'NEWDECIMAL' || field.type === 'DECIMAL') {
      const val = field.string();
      return val === null ? null : parseFloat(val);
    }
    return next();
  }    
});

module.exports = db;

	const mysql = require('mysql2/promise');

	const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'project',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
	});

	// Test the connection
	async function testConnection() {
	try {
		const connection = await pool.getConnection();
		console.log('Successfully connected to MySQL database');
		connection.release();
	} catch (err) {
		console.error('MySQL connection error:', err);
		process.exit(1);
	}
	}

	testConnection();

	module.exports = {
	pool,
	jwt: {
		secret: 'your-strong-secret-key',
		expiresIn: '1h'
	},
	roles: {
		admin: 'admin',
		manager: 'manager',
		customer: 'customer'
	}
	};
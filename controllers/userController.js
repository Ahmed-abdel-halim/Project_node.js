const User = require('../models/userModel');

exports.handleUserRegistration = (req, res) => {
    const { name, email, password, role } = req.body;

    User.createUser({ name, email, password_hash: password, role: role || 'customer' }, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Email already exists.' });
            }
            return res.status(500).json({ message: 'Database error.', error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully.' });
    });
};

exports.handleUserLogin = (req, res) => {
    const { email, password } = req.body;

    User.findUserByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = results[0];

        if (password !== user.password_hash) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        res.json({ message: 'Login successful.' });
    });
};
//  User Profile
exports.getUserProfile = (req, res) => {
    const { email } = req.query; 
    User.findUserByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = results[0];
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at
        });
    });
};

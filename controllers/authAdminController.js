const bcrypt = require('bcryptjs');  
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const connection = require("../config/dbConnection");
const {pool} = require("../config/dbConnection");
const {jwt: jwtConfig} =require("../config/dbConnection");

// register
const register = async (req, res) => {
  try {
    const { name = "", email="", password: plainPassword="", role } = req.body || {};

    if (!name || !email || !plainPassword ||!role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
        missing_fields: {
          name: !name ? 'Missing' : 'Provided',
          email: !email ? 'Missing' : 'Provided',
          role: ! role ? 'Missing': "provided",
          password: !plainPassword ? 'Missing' : 'Provided'
        }
      });
    }

    //  validate
    if (plainPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // registe constraints
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(plainPassword, salt);
    const newUser = await User.create({ name, email, password: password_hash, role });

    res.status(201).json({
      success: true,
      message: `User registered with username ${name}`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.plainPassword,
        role: newUser.role || 'customer'
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Registration failed. Please try again.'
    });
  }
};

// Login
const login = async (req, res) => {
  const { email = '', password = '' } = req.body || {};

    try { 
    //  check request
    // console.log('Login attempt for:', email);
    // console.log('Request body:', req.body);

    // validate for users
    if (!email.trim() || !password.trim()) {
        // console.log('Missing credentials:', { email: !!email, password: !!password });
        
        return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        received: {
            email: email.trim() ? 'provided' : 'missing',
            password: password.trim() ? 'provided' : 'missing'
        }
        });
    }

    // find user by email
    const userRole = await User.findByEmail(email.trim());
    // console.log('User found:', userRole ? userRole.email : 'none');

    if (!userRole) {
    console.log('No user found with email:', email);
    return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        debug: 'No user found with this email'
        });
    }

    //  Check password hash
    // console.log('Stored password hash:', userRole.password_hash ? 'exists' : 'missing');
    if (!userRole.password_hash) {
    console.error('User has no password hash!');
    return res.status(500).json({
        success: false,
        message: 'Account configuration error'
        });
    }



    // Verify password
    const isMatch = await bcrypt.compare(
      password.toString(), 
      userRole.password_hash.toString()
    );
    console.log('Password match result:', isMatch);



    // JWT token generation
    const tokenPayload = {
      id: userRole.id,
      email: userRole.email,
      role: userRole.role || 'customer'
    };

    const token = jwt.sign(tokenPayload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });

    // Successful response
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: tokenPayload
    });

  } catch (error) {
    console.error('Login process error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logout successful' });
};

module.exports = { register, login, logout };

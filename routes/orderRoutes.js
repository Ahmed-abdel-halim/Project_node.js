const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth'); 
const { getOrderHistory } = require('../controllers/orderController');

router.get('/history', authenticateToken, getOrderHistory);

module.exports = router;

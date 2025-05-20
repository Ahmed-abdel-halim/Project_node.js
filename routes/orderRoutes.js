const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const orderController = require('../controllers/orderController');




const { getOrderHistory } = require('../controllers/orderController');

router.get('/history', authenticateToken, getOrderHistory);


router.post('/place-order', orderController.placeOrder);


router.get('/history', authenticateToken, orderController.getOrderHistory);


module.exports = router;

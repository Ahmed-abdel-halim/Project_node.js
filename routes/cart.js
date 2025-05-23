const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth'); // لو الملف اسمه auth.js

router.post('/add', authenticateToken, cartController.addToCart);
router.get('/', authenticateToken, cartController.getCart);
router.put('/:id', authenticateToken, cartController.updateCartItem);
router.delete('/:id', authenticateToken, cartController.deleteCartItem);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getProductsByFilter,
  addProductReview
} = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');


router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products/:id/review', authenticateToken, addProductReview);

module.exports = router;
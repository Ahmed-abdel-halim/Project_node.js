const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { submitReview, getProductReviews } = require('../controllers/reviewController');

router.post('/products/:productId/review', authenticateToken, submitReview);

router.get('/products/:productId/reviews', getProductReviews);

module.exports = router;

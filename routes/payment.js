const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

router.post('/create-checkout-session', authenticateToken, paymentController.createCheckoutSession);
router.post('/create-checkout-session', paymentController.createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);
router.get('/session/:sessionId', paymentController.getCheckoutSession);
router.get('/orders', paymentController.getOrders);

module.exports = router;

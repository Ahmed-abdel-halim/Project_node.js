const express = require('express');
const router  = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// 1. إنشاء جلسة الدفع (Stripe Checkout) – يتطلب JWT
router.post(
  '/create-checkout-session',
  authenticateToken,
  paymentController.createCheckoutSession
);

// 2. Webhook لاستلام إشعارات Stripe (لا يتطلب JWT)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

// 3. استرجاع معلومات الجلسة (Stripe) – اختياري
router.get('/session/:sessionId', authenticateToken, paymentController.getCheckoutSession);

// 4. استرجاع الطلبات الخاصة بالمستخدم
router.get('/orders', authenticateToken, paymentController.getOrders);

module.exports = router;

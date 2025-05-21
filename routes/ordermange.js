const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersmange');

router.get('/', orderController.getAllOrders);
router.put('/:id/status', orderController.updateOrderStatus);
router.get('/report', orderController.getOrdersReport);

module.exports = router;

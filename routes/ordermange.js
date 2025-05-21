const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersmangeController');

//  كل الطلبات
router.get('/', orderController.getAllOrders);

// تحديث  الطلب
router.put('/:id/status', orderController.updateOrderStatus);

// تقرير الطلبات
router.get('/report', orderController.getOrdersReport);

module.exports = router;

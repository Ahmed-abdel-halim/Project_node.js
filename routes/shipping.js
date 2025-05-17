const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

router.post('/', shippingController.createShippingOption);
router.get('/', shippingController.getAllShippingOptions);
router.put('/:id', shippingController.updateShippingOption);
router.delete('/:id', shippingController.deleteShippingOption);

module.exports = router;

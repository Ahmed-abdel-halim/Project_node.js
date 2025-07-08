const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminProduct.controller');
const { isAdmin } = require('../middleware/auth.middleware');

// /admin/products
router.get('/', isAdmin, controller.getAllProducts);
router.post('/', isAdmin, controller.addProducts);
router.put('/:id', isAdmin, controller.updateProduct);
router.delete('/:id', isAdmin, controller.deleteProduct);

module.exports = router;

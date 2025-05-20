const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminUser.controller');
const { isAdmin } = require('../middleware/auth.middleware');

// /admin/users
router.get('/', isAdmin, controller.getAllUsers);
router.put('/:id', isAdmin, controller.updateUser);
router.delete('/:id', isAdmin, controller.deleteUser);

module.exports = router;

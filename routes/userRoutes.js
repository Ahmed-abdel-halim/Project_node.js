const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.handleUserRegistration);
router.post('/login', userController.handleUserLogin);
router.get('/profile', userController.getUserProfile);

module.exports = router;
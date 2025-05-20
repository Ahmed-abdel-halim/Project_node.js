const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { getUserDashboard } = require('../controllers/authController'); 


router.get('/profile', authenticateToken, userController.getProfile);

router.put('/profile', authenticateToken, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Email must be valid'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')

], userController.updateProfile);
router.get('/dashboard', authenticateToken, getUserDashboard);


module.exports = router;

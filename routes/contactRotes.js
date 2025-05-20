const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contactController');
const authorizeRoles = require('../middleware/roleMiddleware');
const verfiyToken = require("../middleware/authMiddleware");

router.post('/', contactController.feedback);

router.use(verfiyToken);
router.use(authorizeRoles);



router.get('/sendfeedback', contactController.feedback);
router.post('/adminRespond', contactController.adminResponse);


module.exports = router
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');


router.get('/', (req, res) => {
  res.json({ message: 'Addresses root route is working!' });
});
router.post('/', addressController.createAddress);
router.get('/:userId', addressController.getAddressesByUser);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;

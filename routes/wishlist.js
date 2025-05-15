const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.post('/', wishlistController.addToWishlist);
router.get('/:userId', wishlistController.getWishlist);
router.delete('/:id', wishlistController.deleteWishlistItem);

module.exports = router;

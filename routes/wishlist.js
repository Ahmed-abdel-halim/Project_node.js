const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.post('/', wishlistController.addToWishlist);
router.get('/:userId', wishlistController.getWishlist);
router.delete('/:id', wishlistController.deleteWishlistItem);
router.get('/:userId/search', wishlistController.searchWishlist);

module.exports = router;

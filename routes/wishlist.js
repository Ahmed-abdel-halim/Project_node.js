const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const { authenticateToken } = require("../middleware/auth");

router.post("/add", authenticateToken, wishlistController.addToWishlist);
router.get("/", authenticateToken, wishlistController.getWishlist);
router.delete("/:product_id", authenticateToken, wishlistController.deleteWishlistItem);
router.get("/search", authenticateToken, wishlistController.searchWishlist);

module.exports = router; 
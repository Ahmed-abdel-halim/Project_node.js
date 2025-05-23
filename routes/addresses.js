const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const { authenticateToken } = require("../middleware/auth");

router.get("/", (req, res) => {
  res.json({ message: "Addresses root route is working!" });
});
router.post("/", authenticateToken, addressController.createAddress);
router.get("/", authenticateToken, addressController.getAddressesByUser);
router.put("/:id", authenticateToken, addressController.updateAddress);
router.delete("/:id", authenticateToken, addressController.deleteAddress);
module.exports = router;

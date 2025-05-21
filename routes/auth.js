const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post(
  "/register",
  authController.registerValidator,
  authController.register
);
router.post("/login", authController.loginValidator, authController.login);
router.get("/dashboard", authController.getUserDashboard);

module.exports = router;

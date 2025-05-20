const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware")
const authorizeRoles = require('../middleware/roleMiddleware');
const adminController =require("../controllers/adminController");

//  admin 
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res)=>{
    res.send({message: `welcome admin`});
});
router.get("/admin/dashboard", verifyToken, authorizeRoles("admin"),(req, res)=>{
    res.send({message: `welcome to dashboard`});
});

router.get("/admin/categories", verifyToken, authorizeRoles("admin"), adminController.categories,(req, res)=>{
    res.send({message: `manages sales`});
});
router.get("/admin/orders", verifyToken, authorizeRoles("admin"), adminController.orders,(req, res)=>{
    res.send({message: ` manage users`});
});
router.get("/admin/carts", verifyToken, authorizeRoles("admin"), adminController.carts,(req, res)=>{
    res.send({message: `manage orders`});
});
router.get("/admin/payments", verifyToken, authorizeRoles("admin"), adminController.payments,(req, res)=>{
    res.send({message: `manage products`});
});
// users
router.get("/admin/get_users", verifyToken, authorizeRoles("admin"), adminController.allUser,(req, res)=>{
    res.send({message: ` all users`});
});
router.get("/admin/user/:id", verifyToken, authorizeRoles("admin"), adminController.user,(req, res)=>{
    res.send({message: `single user`});
});

// reviews
router.get("/admin/get_Reviews", verifyToken, authorizeRoles("admin"), adminController.getReviews,(req, res)=>{
    res.send({message: ` all reviews`});
});
router.get("/admin/get_Reviews/:id", verifyToken, authorizeRoles("admin"), adminController.review,(req, res)=>{
    res.send({message: `product_review`});
});



module.exports = router;

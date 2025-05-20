const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware")
const authorizeRoles = require('../middleware/roleMiddleware');
const mangerController =require("../controllers/mangerController");


router.get("/manager/sales", verifyToken, authorizeRoles("manger"), mangerController.salesStatus,(req, res)=>{
    res.send({message: `manages sales`});
});
router.get("/manager/user_status", verifyToken, authorizeRoles("manger"), mangerController.userStatus,(req, res)=>{
    res.send({message: ` manage users`});
});
router.get("/manager/Total_orders", verifyToken, authorizeRoles("manger"), mangerController.orderStatus,(req, res)=>{
    res.send({message: `manage orders`});
});
router.get("/manager/total_products", verifyToken, authorizeRoles("manger"), mangerController.productStatus,(req, res)=>{
    res.send({message: `manage products`});
});



// abmin and manger 
router.get("/manager",verifyToken, authorizeRoles("admin", "manager"), (req, res)=>{
    res.send({message: `welcome manager`});
});

// all roles
router.get("/user", verifyToken ,authorizeRoles("admin", "manager", "user") ,(req, res)=>{
    res.send({message: `welcome user`});
});

module.exports = router;

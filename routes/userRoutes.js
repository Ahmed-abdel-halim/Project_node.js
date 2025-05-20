const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware")
const authorizeRoles = require('../middleware/roleMiddleware');

// // abmin and manger 
// router.get("/manager",verifyToken, authorizeRoles("admin", "manager"), (req, res)=>{
//     res.send({message: `welcome manager`});
// });

// // all roles
router.get("/user", verifyToken ,authorizeRoles( "customer") ,(req, res)=>{
    res.json({message: `welcome user`});
});

module.exports = router;

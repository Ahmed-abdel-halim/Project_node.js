const authorizeRoles = (...allowedRoles)=>{
    return (req, res, next) =>{
        if (!allowedRoles.includes(req.user.role)){
            return res.status(403).send({message: "access denied"});
        }
        next();
    }   
};


module.exports= authorizeRoles;
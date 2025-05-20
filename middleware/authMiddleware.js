const jwt = require('jsonwebtoken');
const {jwt: jwtConfig} = require('../config/dbConnection');

const verifyToken = (req, res, next) =>{
    let token;
    const authHeader = req.headers.authorization  || req.headers.Authorization ;
    
    if (authHeader && authHeader.startsWith("Bearer ")){
        token = authHeader.split(" ")[1];

        if(!token){
            return res.
            status(401)
            .json({message: `no token, autherization denied`});
        }


    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) {
        console.error('verification error:', err.message);
      
      let errorMessage = 'Token is not valid';
      if (err.name === 'TokenExpiredError') {
        errorMessage = 'Token has expired';
      } else if (err.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token format';
      }

      return res.status(401).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    // 4. Attach decoded user to request
    req.user = decoded;
    console.log('Authenticated user:', decoded);
    next();
  });
};
    
};



module.exports = verifyToken;
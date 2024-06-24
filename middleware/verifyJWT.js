const jwt=  require('jsonwebtoken');

const verfiyJWT = (req , res , next) => {
   const authHeader = req.headers.Authorization || req.headers.authorization;
 
   if(!authHeader?.startsWith('Bearer '))
   return res.status(401).json({message : 'unauthorized'});


   const token = authHeader.split(' ')[1];

   jwt.verify(token , process.env.ACCESS_TOKEN_SECRET  , (err , decoded) => {
    if(err)
        return res.status(403).json({message : "forbidden"});
    req.user = decoded.userInfo.id
    next()
   })
}
 
module.exports =  verfiyJWT;
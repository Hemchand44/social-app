const jwt=require('jsonwebtoken');

const authUser=(req,res,next)=>{

     try{
          
          const authHeader=req.headers.authorization;
           
          if(!authHeader){
               return res.status(401).json({
                    message: "Authorization header is missing"
               })
          }
     
          const token=authHeader.split(" ")[1];

     
          if(!token){
               return res.status(401).json({
                    message: "token is missing"
               })
          }
     
          const decode=jwt.verify(token,process.env.JWT_SECRET);
          req.user=decode;
          
          next();

     }catch(err){
            
          return res.status(401).json({
               message: "Invalid token or expired token"
          })

     }
}


module.exports=authUser;
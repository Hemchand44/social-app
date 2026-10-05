const userModal=require('../models/user.model');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');


async function registerUser(req,res){
     const {name,email,password}=req.body;
     const hashedPassword=await bcrypt.hash(password,10);
     

     const user=await userModal.create({
          name,
          email,
          password: hashedPassword
     })

     
     const token= jwt.sign(
          {userId:user._id},
          process.env.JWT_SECRET,
          {expiresIn: "24h"}
     );

     res.status(201).json({
          message: "User Registered Succesfully",
          user,
          token
     })
}

async function login(req,res){
     const {email,password}=req.body;
     const user=await userModal.findOne({email});
     if(!user){
          res.status(404).json({
               message: "User not found"
          })
     }

     const isPasswordValid=await bcrypt.compare(password,user.password);
     if(!isPasswordValid){
          res.status(401).json({
               message: "Invalid password"
          })
     }

     const token=jwt.sign(
          {userId:user._id},
          process.env.JWT_SECRET,
          {expiresIn:"24h"}
     )

     res.status(200).json({
          message: "User logged in successfully",
          user,
          token          
     })
}
module.exports={registerUser,login};
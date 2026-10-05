const userModel=require('../models/user.model.js')


const getUsers =async(req,res)=>{
     try{
          const users=await userModel.find().select('-password');

          res.status(200).json({
               message: "users fetch succesfully",
               users
          })
     }catch(err){
          console.log(err);
          res.status(500).json({
               message: "Failed to fetch users"
          })
     }
}

const getProfile= async(req,res)=>{
     try{
          const userId=req.user.userId;

          const user= await userModel.findById(userId).select('-password');
          if(!user){
               return res.status(404).json({
                    message: "User not found"
               })
          }    
          
          res.status(200).json({
               message: "User profile fetched successfully",
               user
          })

     }catch(err){
          res.status(500).json({
               message: "Internal server error",
               error: err.message
          })
     }
}

const updateProfile= async(req,res)=>{
     try{
          const userId=req.user.userId;
          const {name,email}=req.body;

          const user= await userModel.findByIdAndUpdate(userId, {name,email}, {returnDocument: "after"}).select('-password');
          if(!user){
               return res.status(404).json({
                    message: "User not found"
               })
          }

          res.status(200).json({
               message: "User profile updated successfully",
               user
          })
     }catch(err){
          res.status(500).json({
               message: "Internal server error",
               error: err.message
          })
     }
}

const deleteProfile= async(req,res)=>{


}    



module.exports={getUsers,getProfile,updateProfile,deleteProfile};
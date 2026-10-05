const postModal = require('../models/post.model');
const UploadFile = require('../services/storage.services');



const createPost=async(req,res)=>{
     try{
          
          const {caption}=req.body;
          const result= await UploadFile(req.file.buffer)
          
          
          const post=await postModal.create({
               image:result.url,
               caption,  
               author: req.user.userId
          })
          
          res.status(201).json({
               message:"post creates successfully",
               post
          })
     }catch(err){
          console.log(err);
          
          res.status(500).json({
               message:"internal server error"
          })
     }
     
}

const deletePost=async(req,res)=>{
     try{
          const id=req.params.id;
          console.log("ID",id)
          const post= await postModal.findByIdAndDelete(id);
          if(!post){
               return res.status(404).json({
                    message: "post not found"
               })
          }
          res.status(200).json({
               message:"post deleted succesfully"
          })
          
          
     }catch(err){
          console.log(err)
          res.status(500).json({
               message:"internal server error"
          })
     }
}    

const updatePost=async(req,res)=>{
     
}




const getPosts=async(req,res)=>{
     try{
          const posts=await postModal.find().populate("author");
          // console.log("pura post",posts)

          res.status(200).json({
               message: "post fetch succesfully",
               posts
          })
     }catch(err){
          console.log(err)
     }

}
const getUserPosts=async(req,res)=>{
     try{
          const id=req.params.id;
          const post=await postModal.find({author:id}).populate("author");
          // console.log("post by id",post)
          if(post.length===0){
               return res.status(200).json({
                    message:"post not found",
                    "post":[]
               })
          }
          res.status(200).json({
               message: 'post fetch successfully',
               post
          })
     }catch(err){
          console.log(err)
          res.status(500).json({
               message:"internal server error"
          })
     }

}    






module.exports={getPosts,createPost,deletePost,updatePost,getUserPosts};

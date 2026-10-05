const express =require('express');
const router=express.Router();
const authUser=require('../middleware/authUser.js')
const multer  = require('multer')
const {getPosts,createPost,deletePost,updatePost,getUserPosts} = require('../controller/post.controller.js');



const upload= multer({storage: multer.memoryStorage()})

router.post('/create',authUser, upload.single("image"), createPost);
router.get('/posts',authUser,getPosts);
router.delete('/:id',authUser,deletePost);
router.get('/:id',authUser,getUserPosts);


module.exports=router    
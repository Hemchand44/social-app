const experss =require('express');
const router=experss.Router();
const authUser=require('../middleware/authUser.js')
const {getUsers,getProfile,updateProfile,deleteProfile}=require('../controller/user.controller.js') 

router.get('/users',authUser,getUsers);
router.get('/profile', authUser, getProfile);
router.patch('/profile', authUser, updateProfile);
router.delete('/profile', authUser, deleteProfile);

module.exports=router;   
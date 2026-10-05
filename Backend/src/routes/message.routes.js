const express=require("express");
const router=express.Router();
const authUser=require("../middleware/authUser.js");
const {sendMessage,getMessages}=require("../controller/Message.controller.js");

router.post("/send",authUser,sendMessage);
router.get("/get/:userId",authUser,getMessages);
// console.log(typeof authUser);
// console.log(typeof sendMessage);
// console.log(typeof getMessage);

module.exports=router;   
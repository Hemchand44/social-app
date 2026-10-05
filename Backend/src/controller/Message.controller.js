          const messageModel = require("../models/message.model");

          const sendMessage = async(req,res)=>{
               try{
                    const {receiverId, message}=req.body;
                    const senderId=req.user.userId;

                    const newMessage=await messageModel.create({
                         sender:senderId,
                         receiver:receiverId,
                         message
                    })

                    res.status(201).json({
                         message:"message sent successfully",
                         newMessage
                    })
               }catch(err){
                    console.log(err);
                    res.status(500).json({
                         message:"internal server error"
                    })

               }

          }



          const getMessages = async(req,res)=>{
               try{
                    const myId=req.user.userId;
                    const receiverId=req.params.userId;

                    const messages=await messageModel.find({
                         $or:[
                              {sender:myId,receiver:receiverId},
                              {sender:receiverId,receiver:myId}
                         ]
                    }).sort({createdAt:1});
                    
                    res.status(200).json({
                         message:"messages fetched successfully",
                         messages
                    })

               }catch(err){
                    console.log(err);
                    res.status(500).json({"message":"internal server error"});
               }
          }     

          module.exports={sendMessage,getMessages};   
const mongoose=require("mongoose");;

const messageSchema=mongoose.Schema({
     sender:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"user",
          required:true
     },
     receiver:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"user",    
          required:true
     },
     message:{
          type:String,
          required:true
     },
     createdAt:{
          type:Date,
          default:Date.now
     }     
})

const messageModal=mongoose.model("message",messageSchema);

module.exports=messageModal;
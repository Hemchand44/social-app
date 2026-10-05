const mongoose=require('mongoose');

const postSchema=mongoose.Schema({
     image:{
          type:String,
          required:true
     },
     caption:{
          type:String,
          required:true
     },

     author:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true
     },
     likes:{



          
     }
     
},{ timestamps: true })

const postModal= mongoose.model("post",postSchema); 

module.exports=postModal
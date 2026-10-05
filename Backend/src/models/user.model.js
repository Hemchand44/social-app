const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
     name:String,
     email:String,
     password:String,

     followers:[{
           type:mongoose.Schema.Types.ObjectId,
           ref:"user"
     }],
     following:[{
           type:mongoose.Schema.Types.ObjectId,
           ref:"user"
     }]
})

const userModal=mongoose.model("user",userSchema);

module.exports=userModal;
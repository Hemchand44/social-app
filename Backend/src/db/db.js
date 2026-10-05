const mongoose =require('mongoose');

const URL=process.env.MONGO_URI;
async function connectDB(){
     try{
               await mongoose.connect(URL)
               console.log("server is connected to database");

     }catch(err){
          console.error("Error connecting to database:", err);   

     }
}


module.exports=connectDB;
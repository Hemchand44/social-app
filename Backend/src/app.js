const express= require('express');
const cors=require('cors');
const multer = require('multer'); // file/PDF/Image frontend se read krne ke liye use hota h
const UploadFile=require('./services/storage.services');

 
const authRouter=require('./routes/auth.routes.js')
const userRouter=require('./routes/user.routes.js')
const postRouter=require('./routes/post.routes.js')
const messageRouter=require('./routes/message.routes.js')


const app=express();
app.use(cors());
app.use(express.json());


const upload= multer({storage: multer.memoryStorage()})

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/post',postRouter);
app.use('/api/message',messageRouter);








module.exports=app
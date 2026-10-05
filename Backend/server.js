
require('dotenv').config();
const app=require('./src/app.js');
const connectDB=require('./src/db/db.js')

port=5000;

app.listen(port,()=>{
     console.log(`server is running on ${port}`)
})

connectDB();
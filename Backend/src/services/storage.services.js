const imagekit =require('@imagekit/nodejs');

const Imagekit=new imagekit({
     privateKey: process.env.IMAGEKI_PRIVATE_KEY
})


async function UploadFile(buffer) {
     
     const result = await Imagekit.files.upload({
          file: buffer.toString("base64"),
          fileName: "image.png",
     })
     return result;
}

module.exports=UploadFile
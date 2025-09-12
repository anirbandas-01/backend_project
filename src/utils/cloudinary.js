import dotenv  from "dotenv";

dotenv.config({
    path: "./.env"
});

import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs' 

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});



const uploadOnCloudinary = async (localFilePath) => {
  
       if(!localFilePath) return null
       //upload file on cloudinary
       
        const fixedPath = localFilePath.replace(/\\/g, "/");

    try{
       const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"})

       //file has been uploaded successful
       //console.log("file is uploaded on cloudinary ", response.url);
       fs.unlinkSync(localFilePath);
       return response.url
       
      }catch(error){
        fs.unlinkSync(localFilePath)
        return null 
      }
}


export { uploadOnCloudinary }
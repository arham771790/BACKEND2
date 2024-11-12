import {v2 as cloudinary} from "cloudinary";
import fs from "fs"; // fs stands for file system for more check documentation of file system in node.js website

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_KEY_SECRET // Click 'View API Keys' above to copy your API secret
});
    

const uploadonCloudinary=async (localFilePath)=>
    {
        try {
            if(!localFilePath)
                return `Could not find the path`;
            const response=await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            //file has been successfully uploaded
            console.log("File successfully uploaded on cloudinary",response.url);
            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath) //remove temporary file from local filesystem as upload fails
            return null;
        }
    }

export {uploadonCloudinary}



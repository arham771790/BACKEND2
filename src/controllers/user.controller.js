import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js"
import {uploadonCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


//Just registering a user

const registerUser=(async (req,res)=>{
    //get user details from frontend
    //validation - check if input fields are empty or not
    //check if user already exists - via unique emailaddress  or username
    //check for images, check for avatar
    //upload them to cloudinary , again recheck if cloudinary has uploaded the files correctly or not
    //Create user object - create entry in db
    //remove password and refresh Token field from response 
    //Check for user creation 
    //return responses

    const {fullName,email,username,password} =req.body;
    console.log("Email:",email)
     if(fullName==="")
     {
        throw new ApiError(400,"Full Name is required")
     }
     if([fullName,email,password].some((field)=>field?.trim()===""))
     {
        throw new ApiError(400,"All field required")
     }
     const existedUser= await User.findOne({
        $or:[{username},{fullName}]
     })
     if(existedUser)
     {
        throw new ApiError(409,"Username or Email Address already exists");
     }
     const avatarLocalPath=req.files?.avatar[0]?.path;
     const coverImageLocalPath=req.files?.coverImage[0]?.path;

     if(!avatarLocalPath)
        throw new ApiError(400,"Avatar file is required")
    const avatar= await uploadonCloudinary(avatarLocalPath);
    const coverImage=await uploadonCloudinary(coverImageLocalPath);
    if(!avatar)
    {
        throw new ApiError(400,"Avatar file is required");
    }
    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser=await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser)
        throw new ApiError(500,"Something went wrong while registering the user");
        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registered succesfully    ")
        )
})

export  {registerUser}
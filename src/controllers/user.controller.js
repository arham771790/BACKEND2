import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js"
import {uploadonCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        // Find user by ID
        const user = await User.findById(userId);

        // If user is not found, throw an error
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate access and refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Assign tokens to the user
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;

        // Save the user without password validation
        await user.save({ validateBeforeSave: false });

        // Return generated tokens
        return { accessToken, refreshToken };
    } catch (error) {
        // Handle errors
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }
};


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
  
     if(fullName==="")
     {
        throw new ApiError(400,"Full Name is required")
     }
     if([fullName,email,password].some((field)=>field?.trim()===""))
     {
        throw new ApiError(400,"All field required")
     }
     console.log(req.body);
     console.log(req.files);
     const existedUser= await User.findOne({
        $or:[{username},{fullName}]
     })
     if(existedUser)
     {
        throw new ApiError(409,"Username or Email Address already exists");
     }
     const avatarLocalPath=req.files?.avatar[0]?.path || null;

    //  const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;
     let coverImageLocalPath;
     if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0)
     {
        coverImageLocalPath=req.files.coverImage[0].path
     }

if (!coverImageLocalPath) {
    console.error("Cover image file not provided or invalid.");
    // Add appropriate error handling here, e.g., returning an error response.
}

     if(!avatarLocalPath)
        {throw new ApiError(400,"Avatar file is required")}
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
            new ApiResponse(200,createdUser,"User registered succesfully")
        )
})
const loginUser=asyncHandler(async (req,res)=>{
    //req.body se data le aao
    //Valid Username ,password, email
    //find the user
    //Password check
    //Generate access and refresh token
    //Send cookie
    //Then send a response for successful login
    const {email,username,password}=req.body;
    if(!username || !email)
        {
            throw new ApiError(400,"Username or email is required")
        } 
    // Finds any of the two parameters ie username or email using $or which works to find one or more parameters 
    const user =await User.findOne({
        $or:[{username},{email}]
    })
    if(!user)
    {
        throw new ApiError(400,"User does not exists");
    }
    const isPasswordValid= await user.isPasswordCorrect(password);
    if(!isPasswordValid)
    {
        throw new ApiError(401,"Incorrect Password");
    }
    const{accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id); 
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken") //Excluding password and refresh token 
    const options=
    {
        httpOnly:true,
        secure:true, //Allows cookies to be modified by server side only and restricts frontend ie client side to modify the cookies
    }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user:loggedInUser,accessToken,refreshToken
        },"User logged in Successfully!!" )
    )


})
const logoutUser=asyncHandler(async (req,res)=>{
    //Remove the cookies
    //Reset access and refresh Token
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out successfully"))

})
export  {registerUser,loginUser,logoutUser}

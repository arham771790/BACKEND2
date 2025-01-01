import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        console.log("Cookies:", req.cookies);
        console.log("Authorization Header:", req.header("Authorization"));

        // Extract token
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("Extracted Token:", token);

        if (!token || typeof token !== "string") {
            throw new ApiError(401, "Invalid or missing token");
        }

        // Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Fetch user
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
  export  {verifyJWT};
//  = await asyncHandler(async (req,_, next) => {
//     try {
//         console.log("Cookies:", req.cookies);
//         console.log("Authorization Header:", req.header("Authorization"));

//         // Extract token
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
//         console.log("Extracted Token:", token);

//         if (!token || typeof token !== "string") {
//             throw new ApiError(401, "Invalid or missing token");
//         }

//         // Verify token
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         // Fetch user
//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
//         if (!user) {
//             throw new ApiError(401, "Invalid access token");
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.error("JWT Verification Error:", error);
//         throw new ApiError(401, error?.message || "Invalid access token");
//     }
// });
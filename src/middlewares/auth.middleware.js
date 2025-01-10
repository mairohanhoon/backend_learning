import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';

export const verifyJWT = asyncHandler(async(req, _, next) => { // we can also write _ in place of res if it is not used int the function body
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("Token : ", token);
        if(!token){
            throw new ApiError(403, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("Decoded Token : ", decodedToken);
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        // console.log("Error here : ", error);
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists : username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token from response 
    // check for user creation 
    // return response 

    const {fullName, email, username, password} = req.body
    
    //console.log(fullName, email, username, password);    
    if(
        [fullName, email, username, password].some((field) => 
            field?.trim() === "")
    ){
        throw new ApiError(400, "Please fill all the fields")
    }
    // checking if email is valid
    if(email.includes("@") === false){
        throw new ApiError(400, "Please enter a valid email")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if(existedUser){
        throw new ApiError(409, "User already exists with this email or username")
    }

    // console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Please upload an avatar")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, "Error in uploading avatar")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500, "Error while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export {
    registerUser,
}
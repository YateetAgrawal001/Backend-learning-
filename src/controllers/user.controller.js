import {asynchandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/users.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asynchandler(async(req,res) => {
   // get user data from frontend
   // validation - not empty
   // check if user already exist: username and email
   // check for images
   // check for avatar
   //upload them to cloudinary, avatar(check)
   //create user object - create entry in db
   //remove password and refresh token fields from response
   // check for user creation (null or usercreated --> return res)

   const {fullname, email, username, password} = req.body;
   console.log("email:", email);

//    if(fullname === ""){
//     throw new ApiError(400,"full name is required")  --> you can design this for every field 
//    }


// or simply do this use some()
    if(
        [fullname, email, username, password].some((field) => 
            field?.trim() === "")
        ){
            throw new ApiError(400,"full name is required")
        }

       const existedUser =  User.findOne({
            $or: [{username},{email}]
        })
        if(existedUser) {
             throw new ApiError((409),"User already exists")
        }
        const avatarPath = req.field?.avatar[0]?.path;
        const coverImagePath = req.field?.cover_image[0]?.path;

        if(!avatarPath) throw new ApiError((409),"avatar already set")

        const avatar = await uploadOnCloudinary(avatarPath)  // isi ki vajah se async lagaya upar video upload hone m time legi
        const cover_image = await uploadOnCloudinary(coverImagePath)

        if(!avatar) throw new ApiError((400),"avatar file is required")

        const user = User.create({
            fullname,
            email,
            avatar: avatar.url,
            cover_image: cover_image?.url || "",
            password,
            username: username.toLowerCase()
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
    
        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user")
        }
    
        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        )
    
    })

    
    

export {
    registerUser,
}
import {asynchandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/users.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const GenerateAccessTokenandGenerateRefreshToken = async (userid) => {
    try{
        const user = await User.findById(userid);
        const accessToken =   user.GenerateAccessToken()
        const refreshToken =  user.GenerateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave : false})

        return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500, " Something went wrong while generating access and refresh token")
    }

}
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

       const existedUser = await User.findOne({
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

    const loginUser = asynchandler(async(req,res) => {
        // fetch the data 
        // username/email
        //find user ? check password : usernot exist
        // password is right --> generate refresh token and refresh token 
        // send cookie

        const {email,username,password} = req.body
        if(!email || !username){
            throw new ApiError(400,"wrong username or email")
        }

        const user = await User.findOne({
            $or: [{username},{email}]
        })
        if(!user){
            throw new ApiError(400,"User does not exist")
        }

       const isPasswordValid =  await user.isPasswordcorrect(password)

       
       if(!isPasswordValid){
        throw new ApiError(400,"Wrong Password, Enter the right password")
    }

    const {accessToken,refreshToken} = await GenerateAccessTokenandGenerateRefreshToken(user._id)

    const userloggedIn = await User.findById(user._id).
        select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(202)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    user: userloggedIn,accessToken,refreshToken
                },
                "User loggenIn successfully"
                
            )
        )
    
    })
    
    const logoutUser = asynchandler(async(req,res) => {

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                new: true
            }
        )
    

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(202)
        .cookie("accessToken",options)
        .cookie("refreshToken",options)
        .json(
            new ApiResponse(200, {},"User logged Out" )
        )

    })

export {
    registerUser,
    loginUser,
    logoutUser
}
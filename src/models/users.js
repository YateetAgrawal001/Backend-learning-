import mongoose, {Schema} from 'mongoose';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        trim: true,
        index: true
    },
    avatar: {
        type: String,  // cloudinary URL
        required: true, 
    },
    cover_image: {
        type: String, // Cloudinary URL
    },
    watch_history: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true,"Password is required"], 
    },
    refresh_tokem: {
        type: String
    }
    
},{timestamps: true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.idPasswordcorrect = async function(password) {
    return await bcrypt.compare(password, this.password); // compares the password and return it
}
userSchema.methods.GenerateAccessToken = async function() {
     jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIN: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.GenerateRefreshToken = async function() {
    jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIN: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const user = mongoose.model("Users",userSchema)
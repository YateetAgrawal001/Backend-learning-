

/*
//approach 1
import mongoose from "mongoose"
import { DB_NAME } from "./constant.js";
import express from "express"
const app = express();
;( async () => {
    try{
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

    }
    catch(error){
        console.log("error",error)
        throw err
    }
})() 
*/



//approach 2

//require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import connectDB from "./db/indexes.js";
//import {app} from './app.js'

dotenv.config({
    path: './env'
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("mongo db connection fail",err)
})
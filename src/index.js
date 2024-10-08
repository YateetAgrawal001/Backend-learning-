

/*
//approach 1
import mongoose from "mongoose"
import { DB_NAME } from "./constants";
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
dotenv.config({
    path: './env'
})

import connectDB from "./db/index.js";

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log("server is running at ",{PORT});
    })
})
.catch((err) => {
    console.log('mongo db connection fail',err)
})
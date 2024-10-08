import mongoose, { connection } from "mongoose"
import { DB_NAME } from "./constants.js";

const connectDB = async () => {
    try{
        const conectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n Mongoosedb connected !! DB Host ${
            conectionInstance.connection.host
        }`)
    }
    catch(error){
        console.log("error",error)
        process.exit(1); //help in throw the error
    }
}

export default connectDB
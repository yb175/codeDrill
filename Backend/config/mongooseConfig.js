/**
 * @fileoverview Contains the function responsible for connecting the application to the MongoDB database using Mongoose.
 * * @function main
 * @description Establishes a connection to the MongoDB server using the connection string defined in the environment variables.
 * * **Input Format:**
 * This function takes **no direct arguments (input)**. It relies on the global environment variable `mongoose_connection_string` 
 * which must be loaded via `dotenv.config()` prior to execution.
 * * **Output Format:**
 * @returns {Promise<void | {err: string}>} A Promise that resolves:
 * - **`void`**: On a successful connection. A success message is logged to the console.
 * - **`{err: string}`**: On failure. An object containing the connection error message is returned. The error is also logged to the console.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function main(){
    try{
        await mongoose.connect(process.env.mongoose_connection_string) ; 
        console.log("Connected to db") ; 
    }catch(err){
        return {"err" : err.message} 
    }
}

export default main ; 
/**
 * @fileoverview Defines the Mongoose schema and model for user data in the coding platform application.
 * 
 * * @module models/user
 * @description
 * This module defines the `User` schema and model used to store user-related information such as
 * personal details, role, and problems solved. Each user document tracks a list of problems the user has solved,
 * including metadata like language used, submission status, and timestamp.
 * 
 * * **Schema Fields:**
 * - **`name`**: User's name. (String, required, min 3, max 20)
 * - **`email`**: User's unique email address. (String, required, max 30, unique, indexed)
 * - **`role`**: User's access level. (Enum: `"admin"`, `"user"`, `"guest"`, default: `"guest"`)
 * - **`problemSolved`**: Array of subdocuments defined in `problemSolvedSchema`, storing details of solved problems.
 * - **`timestamps`**: Automatically adds `createdAt` and `updatedAt` fields to each document.
 * 
 * * **Dependencies:**
 * - `mongoose`: For schema and model creation.
 * - `problemSolvedSchema`: Imported sub-schema defining structure for solved problems.
 * 
 * * **Output Format:**
 * @returns {mongoose.Model} A compiled Mongoose model named `'user'`, representing the `User` collection in MongoDB.
 * 
 * * **Usage Example:**
 * ```js
 * import userModel from './models/user.js';
 * const newUser = new userModel({ name: "Yug", email: "yug@example.com" });
 * await newUser.save();
 * ```
 */
import mongoose from "mongoose";
const {Schema} = mongoose ; 
import problemSolvedSchema from "./problem.js";
const UserSchema = new Schema({
    name: {
        type : String ,
        required : true, 
        minLength : 3, 
        maxLength : 20,
        trim: true,
    }, 
    email: {
        type : String,
        required : true , 
        maxLength : 30 , 
        trim : true, 
        index : true , 
        unique : true 
    }, 
    password : {
        type : String , 
        trim : true
    },
    role : {
        type : String , 
        enum : ["admin","user","guest"], 
        default : "guest"
    },
    isVerified : {
        type : Boolean , 
        default : false
    },
    problemSolved : [problemSolvedSchema]
},{timestamps : true}) 
const userModel = mongoose.model('user',UserSchema) ; 
export default userModel ; 
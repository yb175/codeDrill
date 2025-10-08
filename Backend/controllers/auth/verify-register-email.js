/**
 * @fileoverview Controller for verifying a user's email via a JWT and creating their account.
 * @module controllers/auth/verifyEmail
 * @requires jsonwebtoken
 * @requires ../../models/auth/User
 */
import jwt from "jsonwebtoken"
import userModel from "../../models/auth/User.js"
/**
 * Verifies the token received from the verification email link,
 * checks if the user already exists, and if not, creates the new user account.
 *
 * The JWT token is expected to contain the necessary user registration details
 * (e.g., name, email, hashedPassword).
 *
 * @async
 * @param {import('express').Request} req - The Express request object. Expects a 'token' URL parameter.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response to the client.
 *
 * @example
 * // Success Response
 * // HTTP/1.1 200 OK
 * // Content-Type: application/json
 * // { "res": "user created successfully" }
 *
 * @example
 * // Error Response (User Already Exists)
 * // HTTP/1.1 400 Bad Request
 * // Content-Type: application/json
 * // { "res": "User already exists/verified" }
 *
 * @example
 * // Error Response (Invalid or Expired Token)
 * // HTTP/1.1 400 Bad Request
 * // Content-Type: application/json
 * // { "err": "jwt expired" } or { "err": "invalid signature" }
 */
async function verifyEmail(req,res){ 
    const {token} = req.params ;
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY) ;
        const {email} = decoded ; 
        const user = await userModel.findOne({email})
        if(user){
            return res.status(400).send({res : "User already exists/verified"}) ; 
        }
        await userModel.create(decoded) ; 
        const userInfo = await userModel.findOne({email}) ;
        const payload = {id : userInfo._id , email : userInfo.email,role : userInfo.role} ;
        const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn : "4h"}) ;
        res.cookie("token" , token , {httpOnly : true , maxAge : 4*24*60*60*1000,sameSite : "lax"}) ;
        res.status(200).send({res : "user created succesfully"}) ;
    }catch(err){
        return res.status(400).send({err : err.message}) ;
    }
}   

export default verifyEmail ; 
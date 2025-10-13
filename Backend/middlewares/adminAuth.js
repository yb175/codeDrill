import userModel from "../models/auth/User.js";
import redisClient from "../models/redis/client.js";
import jwt from "jsonwebtoken"
/**
 * Checks if the user is an admin and if their token is blacklisted.
 * If the user is not an admin or the token is blacklisted, returns a 401 Unauthorized response.
 * If the token is not blacklisted, continues to the next middleware.
 * @param {Object} req - Express request object containing the user's token in `req.cookies`.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function to be called if the token is not blacklisted.
 */
async function adminAuth(req,res,next) {
    try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ success: false, message: "User not logged in" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const {_id} = payload; 
    const user = await userModel.findById(_id);
    if(!user){
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if(user.role !== 'admin'){
      return res.status(401).json({ success: false, message: "User is not an admin" });
    }   
    const blacklisted = await redisClient.exists(`token:${token}`);
    if (blacklisted) {
      return res.status(401).send({ success: false, message: "Token blacklisted" });
    }
    req.result = user;
    // Token valid, continue to next middleware
    next();

  } catch (err) {
    console.error("Check blacklist error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export default adminAuth ; 
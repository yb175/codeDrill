import userModel from "../../models/auth/User.js";
import bcrypt from "bcrypt" ;
import jwt from "jsonwebtoken"
/**
 * Handles a login request with an email and password.
 * @param {Object} req.body - Object containing the email and password of the user.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response to the client.
 * 
 * @example
 * // Success Response
 * // HTTP/1.1 200 OK
 * // Content-Type: application/json
 * // { "res": "login successful" }
 * 
 * @example
 * // Error Response (User Not Found)
 * // HTTP/1.1 404 Not Found
 * // Content-Type: application/json
 * // { "err": "user not found" }
 * 
 * @example
 * // Error Response (Invalid Credentials)
 * // HTTP/1.1 400 Bad Request
 * // Content-Type: application/json
 * // { "err": "Invalid credentials" }
 */
async function loginWithPassword(req, res) {
  try {
    const { email, password } = req.body;
    const userInfo = await userModel.findOne({email}) 
    if(!userInfo) return res.status(404).send({err : "user not found"}); 
    const ogPassword = userInfo.password ; 
    const isValid = await bcrypt.compare(password,ogPassword) ; 
    if(!isValid) {
        return res.status(400).send({err : "Invalid credentials"}) ; 
    }
    const payload = {_id : userInfo._id , email : email,role : userInfo.role} ; 
    const accessToken = jwt.sign(payload,process.env.JWT_SECRET_KEY) ; 
    res.cookie("token",accessToken,{ httpOnly: true, maxAge: 4*24*60*60*1000}) ;  
    res.send({res : `login successful`}) ; 
  } catch (err) {
    res.send({err : err.message}) ; 
  }
}

export default loginWithPassword 
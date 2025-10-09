import userModel from "../../models/auth/User.js";
import bcrypt from "bcrypt" ;
import jwt from "jsonwebtoken"

/**
 * Handles user login with email and password.
 * 
 * @param {Object} req - Express request object containing user email and password in `req.body`.
 * @param {Object} res - Express response object.
 * 
 * @returns {Promise<void>} Sends a JSON response to the client.
 * 
 * @example
 * // Success Response
 * // HTTP/1.1 200 OK
 * // Content-Type: application/json
 * // { "success": true, "message": "Login successful", "data": { "email": "user@example.com", "role": "user" } }
 *
 * @example
 * // Error Response (User Not Found)
 * // HTTP/1.1 404 Not Found
 * // Content-Type: application/json
 * // { "success": false, "message": "User not found" }
 *
 * @example
 * // Error Response (Invalid Credentials)
 * // HTTP/1.1 400 Bad Request
 * // Content-Type: application/json
 * // { "success": false, "message": "Invalid credentials" }
 *
 * @example
 * // Error Response (Server Error)
 * // HTTP/1.1 500 Internal Server Error
 * // Content-Type: application/json
 * // { "success": false, "message": "Internal Server Error" }
 */
async function loginWithPassword(req, res) {
  try {
    const { email, password } = req.body;

    const userInfo = await userModel.findOne({ email });
    if (!userInfo) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, userInfo.password);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const payload = { _id: userInfo._id, email: userInfo.email, role: userInfo.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    res.cookie("token", accessToken, { httpOnly: true, maxAge: 4 * 24 * 60 * 60 * 1000 });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { email: userInfo.email, role: userInfo.role }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export default loginWithPassword;
/**
 * @fileoverview Controller for verifying a user's email via a JWT and creating their account.
 * @module controllers/auth/verifyEmail
 * @requires jsonwebtoken
 * @requires ../../models/auth/User
 */
import jwt from "jsonwebtoken";
import userModel from "../../models/auth/User.js";

/**
 * Verifies a user's email address and creates their account.
 * 
 * @param {Object} req - Express request object containing the JWT token in `req.params`.
 * @param {Object} res - Express response object.
 * 
 * @returns {Promise<void>} Sends a JSON response to the client.
 * 
 * @example
 * // Success Response
 * // HTTP/1.1 200 OK
 * // Content-Type: application/json
 * // { "success": true, "message": "User created successfully", "data": { "email": "user@example.com", "role": "user" } }
 * 
 * @example
 * // Error Response (User Already Exists)
 * // HTTP/1.1 400 Bad Request
 * // Content-Type: application/json
 * // { "success": false, "message": "User already exists/verified" }
 * 
 * @example
 * // Error Response (Server Error)
 * // HTTP/1.1 500 Internal Server Error
 * // Content-Type: application/json
 * // { "success": false, "message": "Internal Server Error" }
*/

async function verifyEmail(req, res) {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { email } = decoded;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists/verified" });
    }
    await userModel.create(decoded);
    const userInfo = await userModel.findOne({ email });
    const payload = {
      id: userInfo._id,
      email: userInfo.email,
      role: userInfo.role,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "4d",
    });
    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 4 * 24 * 60 * 60 * 1000, 
    });
    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: { email: userInfo.email, role: userInfo.role },
    });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export default verifyEmail;

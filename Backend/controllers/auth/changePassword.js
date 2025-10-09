import bcrypt from "bcrypt";
import userModel from "../../models/auth/User.js";
import redisClient from "../../models/redis/client.js";
import jwt from "jsonwebtoken";
/**
 * Changes a user's password
 *
 * @param {Object} req - Express request object containing the user's email, old password, and new password in `req.body`.
 * @param {Object} res - Express response object.
 *
 * @returns {Promise<void>} Sends a JSON response to the client.
 *
 * @example
 * // Success Response
 * // HTTP/1.1 200 OK
 * // Content-Type: application/json
 * // { "success": true, "message": "Password changed successfully" }
 *
 * @example
 * // Error Response (Invalid Credentials)
 * // HTTP/1.1 401 Unauthorized
 * // Content-Type: application/json
 * // { "success": false, "message": "Invalid credentials" }
 *
 * @example
 * // Error Response (Internal Server Error)
 * // HTTP/1.1 500 Internal Server Error
 * // Content-Type: application/json
 * // { "success": false, "message": "Internal Server Error" }
 */

async function changePassword(req, res) {
  try {
    const { email, password, newPassword } = req.body;
    const { token } = req.cookies;
    if (!email || !password || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide email, current password, and new password",
      });
    }
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
    const ogPass = existingUser.password;
    const isOldPassValid = await bcrypt.compare(password, ogPass);
    if (!isOldPassValid) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid credentials" });
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await userModel.findOneAndUpdate({ email }, { password: newPasswordHash });
    const payload = jwt.decode(token);
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    });

    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await redisClient.set(`token:${token}`, token, "EX", ttl);
    }
    return res
      .status(200)
      .send({ success: true, message: "Password changed succesfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
}

export default changePassword;

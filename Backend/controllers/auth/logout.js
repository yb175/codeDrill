import redisClient from "../../models/redis/client.js";
import jwt from "jsonwebtoken" 


/**
 * Logs out a user by clearing their token cookie and adding it to Redis
 * with a TTL equal to the remaining lifetime of the token.
 *
 * @param {Object} req - Express request object containing the user's token cookie.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response to the client.
 *
 * @example
 * // Success Response
 * // HTTP/1.1 200 OK
 * // Content-Type: application/json
 * // { "success": true, "message": "Logout successful" }
 *
 * @example
 * // Error Response (No Token Found)
 * // HTTP/1.1 400 Bad Request
 * // Content-Type: application/json
 * // { "success": false, "message": "No token found" }
 *
 * @example
 * // Error Response (Internal Server Error)
 * // HTTP/1.1 500 Internal Server Error
 * // Content-Type: application/json
 * // { "success": false, "message": "Internal Server Error" }
 */
export default async function logout(req, res) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ success: false, message: "No token found" });
    }

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

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

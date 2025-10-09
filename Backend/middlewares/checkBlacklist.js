import redisClient from "../models/redis/client.js";

/**
 * Checks if the user's token is blacklisted in Redis.
 * If the token is blacklisted, returns a 401 Unauthorized response.
 * If the token is not blacklisted, continues to the next middleware.
 * @param {Object} req - Express request object containing the user's token in `req.cookies`.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function to be called if the token is not blacklisted.
 */
async function checkBlackList(req, res, next) {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ success: false, message: "User not logged in" });
    }

    const blacklisted = await redisClient.get(`token:${token}`);
    if (blacklisted) {
      return res.status(401).json({ success: false, message: "User not logged in" });
    }

    // Token valid, continue to next middleware
    next();

  } catch (err) {
    console.error("Check blacklist error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export default checkBlackList; 
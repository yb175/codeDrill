import redisClient from "../models/redis/client.js";
/**
 * Checks if the user's token is blacklisted in Redis.
 * If the token is found, a 401 Unauthorized response is sent.
 * If the token is not found, the next middleware in the stack is called.
 * If an error occurs, a 500 Internal Server Error response is sent.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware in the stack.
 */
async function checkBlackList(req, res,next) {
  try {
    const { token } = req.cookies;
    if(!token) return res.status(401).send({ err: "user not login" });
    const blacklisted = await redisClient.get(`token:${token}`);
    if (blacklisted) {
      return res.status(401).send({ err: "user not login" });
    }
    next() ; 
  } catch (err) {
    res.status(500).send;
  }
}

export default checkBlackList ; 
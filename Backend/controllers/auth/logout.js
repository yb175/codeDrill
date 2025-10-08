import redisClient from "../../models/redis/client.js";
import jwt from "jsonwebtoken" 

/**
 * Logs a user out by clearing the 'token' cookie and storing the
 * token in Redis with a TTL equal to the remaining lifetime of the
 * token. If the token has already expired, it is not stored in Redis.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response to the client.
 * 
 * @example
 * // Success Response
 * // HTTP/1.1 200 OK
 * // Content-Type: application/json
 * // { "res": "logout successfully" }
 * 
 * @example
 * // Error Response
 * // HTTP/1.1 500 Internal Server Error
 * // Content-Type: application/json
 * // { "err": "Error message" }
 */
export default async function logout(req, res) {
  try {
    const token = req.cookies.token;
    const payload = jwt.decode(token) ; 
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    });
    const ttl = payload.exp-Math.floor(Date.now()/1000) ;
    if(ttl>0) await redisClient.set(`token:${token}`,token,"EX",ttl) ; 
    res.status(200).send({res : "logout successfully"}) ;
  } catch (err) {
    return res.send({ err: err.message });
  }
}

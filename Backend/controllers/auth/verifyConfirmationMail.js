import jwt from "jsonwebtoken"
/**
 * Verifies a user's email address and logs them in.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response to the client.
 * 
 * @example
 * // Success Response
 * // HTTP/1.1 200 OK
 * // Content-Type: application/json
 * // { "res": "login successful" }
 *
 * @example
 * // Error Response (Invalid or Expired Token)
 * // HTTP/1.1 400 Bad Request
 * // Content-Type: application/json
 * // { "err": "jwt expired" } or { "err": "invalid signature" }
 */
async function verificationConfirmationMail(req,res) {
    try{
        const {token} = req.params ;  
        const payload = jwt.verify(token,process.env.JWT_SECRET_KEY) ; 
        res.cookie("token" , token , { httpOnly: true, maxAge: 4*24*60*60*1000} )
        res.status(200).send({res : "login successfull"}) ; 
    }catch(err){
        res.send({err : err.message}) ; 
    }
}

export default verificationConfirmationMail ; 
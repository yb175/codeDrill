import jwt from "jsonwebtoken";

/**
 * Handles login verification with email confirmation token.
 * 
 * @param {Object} req - Express request object containing the confirmation token in `req.params`.
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
 * // Error Response (Internal Server Error)
 * // HTTP/1.1 500 Internal Server Error
 * // Content-Type: application/json
 * // { "success": false, "message": "Internal Server Error" }
 */
async function verificationConfirmationMail(req, res) {
  try {
    const { token } = req.params;
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const newToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "4d",
    })
    res.cookie("token", newToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 4 * 24 * 60 * 60 * 1000, // 4 days
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { email: payload.email, role: payload.role },
    });
  } catch (err) {
    console.error("Verification confirmation error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export default verificationConfirmationMail;

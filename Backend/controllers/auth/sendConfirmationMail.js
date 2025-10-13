import transporter from "../../utils/user/transporter.js";
import userModel from "../../models/auth/User.js";
import jwt from "jsonwebtoken";

/**
 * Sends a verification email to the user.
 * 
 * @param {Object} req - Express request object containing the user's email in `req.body`.
 * @param {Object} res - Express response object.
 * 
 * @returns {Promise<void>} Sends a JSON response to the client.
 * 
 * @example
 * // Success Response
 * // HTTP/1.1 200 OK
 * // Content-Type: application/json
 * // { "success": true, "message": "Verification mail sent successfully", "data": { "email": "user@example.com" } }
 * 
 * @example
 * // Error Response (User Not Found)
 * // HTTP/1.1 404 Not Found
 * // Content-Type: application/json
 * // { "success": false, "message": "User not found" }
 * 
 * @example
 * // Error Response (Internal Server Error)
 * // HTTP/1.1 500 Internal Server Error
 * // Content-Type: application/json
 * // { "success": false, "message": "Internal Server Error" }
 */
export default async function sendConfirmationMail(req, res) {
  try {
    const { email } = req.body;

    // Check if user exists
    const userInfo = await userModel.findOne({ email });
    if (!userInfo) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Create JWT token
    const payload = { _id: userInfo._id, email: userInfo.email, role: userInfo.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "3m" });
    const verificationLink = `${process.env.VERIFICATION_LINK_LOGIN}/${token}`;

    // Send verification email
    await transporter.sendMail({
      from: '"Team Code Drills" <maddison53@ethereal.email>',
      to: email,
      subject: "Verify your account - Code Drills",
      text: `From Team Code Drills — Here is your verification link. Click the link below to verify your account: ${verificationLink}`,
      html: `
        <p>Hi ${userInfo.name || "User"},</p>
        <p>From <b>Team Code Drills</b> — Here is your verification link:</p>
        <p><a href="${verificationLink}" target="_blank">Click here to verify your account</a></p>
        <p>If you didn’t request this, please ignore this email.</p>
        <br/>
        <p>– Team Code Drills</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Verification mail sent successfully",
      data: { email: userInfo.email },
    });

  } catch (err) {
    console.error("Send confirmation mail error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
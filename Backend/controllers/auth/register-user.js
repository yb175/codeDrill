/**
 * @fileoverview Controller for handling new user registration.
 * @module controllers/auth/register
 * @requires ../../utils/userValidation
 * @requires ../../models/auth/User
 * @requires ../../utils/transporter
 * @requires bcrypt
 * @requires jsonwebtoken
 */
import checkValidation from "../../utils/userValidation.js";
import userModel from "../../models/auth/User.js";
import transporter from "../../utils/transporter.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Handles new user registration.
 * 
 * @param {Object} req - Express request object containing user registration details in `req.body`.
 * @param {Object} res - Express response object.
 * 
 * @returns {Promise<void>} Sends a JSON response to the client.
 * 
 * @example
 * // Success Response
 * // HTTP/1.1 200 OK
 * // Content-Type: application/json
 * // { "success": true, "message": "Verification email sent", "data": { "email": "user@example.com" } }
 * 
 * @example
 * // Error Response (User Already Exists)
 * // HTTP/1.1 400 Bad Request
 * // Content-Type: application/json
 * // { "success": false, "message": "A user with this email already exists." }
 * 
 * @example
 * // Error Response (Server Error)
 * // HTTP/1.1 500 Internal Server Error
 * // Content-Type: application/json
 * // { "success": false, "message": "Internal Server Error" }
 */
export default async function register(req, res) {
  try {
    // Validation check
    const validationResult = checkValidation(req.body, res);
    if (validationResult.err) {
      return res.status(400).json({ success: false, message: validationResult.err });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "A user with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    // Generate verification token
    const verifiedUserToken = jwt.sign(req.body, process.env.JWT_SECRET_KEY, { expiresIn: "3m" });
    const verificationLink = `${process.env.VERIFICATION_LINK_REGISTER}/${verifiedUserToken}`;

    // Send verification email
    await transporter.sendMail({
      from: '"Team Code Drills" <maddison53@ethereal.email>',
      to: email,
      subject: "Verify your account - Code Drills",
      text: `From Team Code Drills — Here is your verification link. Click the link below to verify your account: ${verificationLink}`,
      html: `
        <p>Hi ${name},</p>
        <p>From <b>Team Code Drills</b> — Here is your verification link:</p>
        <p><a href="${verificationLink}" target="_blank">Click here to verify your account</a></p>
        <p>If you didn’t request this, please ignore this email.</p>
        <br/>
        <p>– Team Code Drills</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Verification email sent",
      data: { email },
    });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

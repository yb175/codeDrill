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
 * Handles the registration of a new user.
 *
 * It first validates the request body, checks if the user already exists,
 * hashes the password, and sends a verification email with a JWT-based link.
 *
 * @async
 * @param {import('express').Request} req - The Express request object. Expects 'name', 'email', and 'password' in `req.body`.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a response to the client.
 *
 * @example
 * // Success Response (Verification Email Sent)
 * // HTTP/1.1 200 OK
 * // Content-Type: application/json
 * // { "res": "verification email sent" }
 *
 * @example
 * // Error Response (Validation Failure)
 * // HTTP/1.1 400 Bad Request
 * // Content-Type: application/json
 * // { "err": "Validation failed message" }
 *
 * @example
 * // Error Response (User Already Exists)
 * // HTTP/1.1 400 Bad Request
 * // Content-Type: application/json
 * // { "res": "user Already exists in db" }
 *
 * @example
 * // Error Response (Server Error)
 * // HTTP/1.1 500 Internal Server Error
 * // Content-Type: application/json
 * // { "err": "Error message" }
 */
export default async function register(req, res) {
  try {
    const isValid = checkValidation(req.body, res);
    if (isValid.err) {
      return res.status(400).send(isValid.err);
    }
    const { name, email, password } = req.body;
    const checkExistence = await userModel.findOne({ email: req.body.email });
    if (!checkExistence) {
      const hashedPassword = await bcrypt.hash(password, 10);
      req.body.password = hashedPassword;
      const verifiedUserToken = jwt.sign(req.body, process.env.JWT_SECRET_KEY, {
        expiresIn: "3m",
      });
      const verificationLink = `${process.env.VERIFICATION_LINK_REGISTER}/${verifiedUserToken}`;
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
      return res.status(200).send({
        res: "verification email sent",
      });
    }
    return res.status(400).send({
      res: "A user with this email already exists.",
    });
  } catch (err) {
    res.status(500).send({
      err: err.message,
    });
  }
}

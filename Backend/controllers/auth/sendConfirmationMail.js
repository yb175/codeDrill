import transporter from "../../utils/transporter.js";
import userModel from "../../models/auth/User.js";
import jwt from "jsonwebtoken";
/**
 * Sends a verification email to the user with a JWT-based link.
 *
 * @param {import('express').Request} req - The Express request object. Expects 'email' in `req.body`.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response to the client.
 *
 * @example
 * // Success Response
 * // HTTP/1.1 200 OK
 * // Content-Type: application/json
 * // { "res": "Verification mail sent successfully" }
 *
 * @example
 * // Error Response (User Not Found)
 * // HTTP/1.1 404 Not Found
 * // Content-Type: application/json
 * // { "err": "user not found" }
 *
 * @example
 * // Error Response (Server Error)
 * // HTTP/1.1 500 Internal Server Error
 * // Content-Type: application/json
 * // { "err": "Error message" }
 */
async function sendConfirmationMail(req, res) {
  try {
    const { email } = req.body;
    const userInfo = await userModel.findOne({ email });
    if (!userInfo) return res.status(404).send({ err: "user not found" });
    const payload = { _id: userInfo._id, email: email, role: userInfo.role };
    const token = jwt.sign(payload,process.env.JWT_SECRET_KEY, { expiresIn: "3m" });
    const verificationLink = `${process.env.VERIFICATION_LINK_LOGIN}/${token}`;
    // send mail
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
    res.status(200).send({ res: "Verification mail sent successfully" });
  } catch (err) {
    res.send({ err: err.message });
  }
}

export default sendConfirmationMail ;
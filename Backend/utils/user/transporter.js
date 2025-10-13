import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
/**
 * @file mailer.js
 * @description Creates and exports a nodemailer transporter configured for Gmail using env variables.
 *              Use an App Password (recommended) or an appropriately secured credential in production.
 */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASS,
  },
});

export default transporter; 
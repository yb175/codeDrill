import express from "express" 
import verifyEmail from "../controllers/auth/verify-register-email.js";
import register from "../controllers/auth/register-user.js";
import loginWithPassword from "../controllers/auth/loginWithPassword.js";
import sendConfirmationMail from "../controllers/auth/sendConfirmationMail.js";
import verificationConfirmationMail from "../controllers/auth/verifyConfirmationMail.js"; 
import logout from "../controllers/auth/logout.js";
import checkBlackList from "../middlewares/checkBlacklist.js";

const userRouter = express.Router() ; 

// Register 
userRouter.post('/register',register) ; 

// verification while registering 
userRouter.get('/verify/:token',verifyEmail) ; 

// login with password 
userRouter.post('/login-with-password',loginWithPassword) ; 

// login with email verification
userRouter.post('/send-email-verification', sendConfirmationMail) ;
userRouter.get('/login-verify/:token',verificationConfirmationMail) ; 

// login with google 

// login with github

// forgot password

// reset password 

// logout 
userRouter.get('/logout',checkBlackList,logout) ; 

export default userRouter ; 
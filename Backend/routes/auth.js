import express from "express" 
import verifyEmail from "../controllers/auth/verify-register-email.js";
import register from "../controllers/auth/register-user.js";
import loginWithPassword from "../controllers/auth/loginWithPassword.js";
import sendConfirmationMail from "../controllers/auth/sendConfirmationMail.js";
import verificationConfirmationMail from "../controllers/auth/verifyConfirmationMail.js"; 
import logout from "../controllers/auth/logout.js";
import checkBlackList from "../middlewares/userAuth.js";
import changePassword from "../controllers/auth/changePassword.js";
import getProblemSolved from "../controllers/auth/getinfo.js";
import ratelimiter from "../middlewares/ratelimiter.js";
import checkUser from "../controllers/auth/checkUser.js";

const userRouter = express.Router() ; 

// Register 
userRouter.post('/register',ratelimiter,register) ; 

// verification while registering 
userRouter.get('/verify/:token',ratelimiter,verifyEmail) ; 

// login with password 
userRouter.post('/login-with-password',ratelimiter,loginWithPassword) ; 

// login with email verification
userRouter.post('/send-email-verification', ratelimiter,sendConfirmationMail) ;
userRouter.get('/login-verify/:token',ratelimiter,verificationConfirmationMail) ; 

// login with google 

// login with github

// forgot password

// reset password 
userRouter.patch('/reset-password',checkBlackList,ratelimiter,changePassword) ; 
// logout 
userRouter.get('/logout',checkBlackList,ratelimiter,logout) ; 

userRouter.get('/problem-solved',checkBlackList,ratelimiter,getProblemSolved) ; 
userRouter.get('/check', checkBlackList, checkUser) ;
export default userRouter ; 
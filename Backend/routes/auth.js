import express from "express" 
import verifyEmail from "../controllers/auth/verify-register-email.js";
import register from "../controllers/auth/register-user.js";
const userRouter = express.Router() ; 

userRouter.post('/register',register) ; 
userRouter.get('/verify/:token',verifyEmail) ; 

export default userRouter ; 
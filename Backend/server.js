import main from "./config/mongooseConfig.js";
import express from "express" ; 
import dotenv from "dotenv" ;
import userRouter from "./routes/auth.js";
import problemRouter from "./routes/problem.js";
import redisConnect from "./config/redisConfig.js";
import submissionRouter from "./routes/submission.js";
import cookieParser from "cookie-parser";
dotenv.config() ;
const app = express() ; 
app.use(express.json()) ; 
app.use(cookieParser()) ; 
app.use('/user',userRouter) ; 
app.use('/problems',problemRouter) ; 
app.use('/submissions',submissionRouter) ;
const promises = [main(),redisConnect()] ; 
async function start() {
    try{
        await Promise.all(promises) ; 
        const PORT = process.env.PORT || 3000 ;
        app.listen(PORT,()=>console.log("Server started at port 3000")) ; 
    }catch(err){
        console.log(err) ; 
    }
}

await start() ;
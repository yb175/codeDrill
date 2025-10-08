import main from "./config/mongooseConfig.js";
import express from "express" ; 
import dotenv from "dotenv" ;
import userRouter from "./routes/auth.js";

dotenv.config() ;
const app = express() ; 
app.use(express.json()) ; 

app.use('/user',userRouter) ; 

main().
then(()=>{
    const PORT = process.env.PORT || 3000 ;
    app.listen(PORT,()=>console.log("listning to port " + PORT)) ; 
})
.catch(()=>{
    console.log("An error occured") ; 
})
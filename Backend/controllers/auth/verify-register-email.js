import jwt from "jsonwebtoken"
import userModel from "../../models/auth/User.js"
async function verifyEmail(req,res){ 
    const {token} = req.params ;
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY) ;
        const {email} = decoded ; 
        const user = await userModel.findOne({email})
        if(user){
            return res.status(402).send("bad request") ; 
        }
        await userModel.create(decoded) ; 
        res.status(200).send("user created succesfully") ;
    }catch(err){
        return res.status(400).send(err.message) ;
    }
}   

export default verifyEmail ; 
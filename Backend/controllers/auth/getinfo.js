import userModel from "../../models/auth/User.js";

async function getProblemSolved(req,res){
    try{
        const {_id} = req.result ; 
        const userdata = await userModel.findOne({_id}).populate({
            path : 'problemSolved',
            select : `title difficulty problemNumber -_id`
        }).exec() ;
        if(!userdata){
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        return res.status(200).json({
            success : true , 
            data : userdata.problemSolved
        })
    }
    catch(err){
        return res.status(500).json({
            success : false , 
            message : err.message
        })
    }
}

export default getProblemSolved ; 
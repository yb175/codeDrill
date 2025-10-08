import mongoose from "mongoose";
const {Schema} = mongoose ; 
const problemSolvedSchema = new Schema({
    problemId : {
        type: Number
    },
    solvedAt : {
        type : Date , 
        default : Date.now
    },
    languageUsed : {
        type : String 
    },
    status: {
    type: String,
    enum: ["accepted", "wrong answer", "tle","mle"],
    default: "accepted"
  }
})

export default problemSolvedSchema ; 
import mongoose from "mongoose";
import crypto from "crypto"
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  problemNumber: {
    type: Number,
    required : true 
  },
  status: {
    type: String,
    enum: ["solved", "attempted", "not attempted","pending"],       
    default: "not attempted",
  },
  languageUsed: {
    type: String,
    enum: ["c++", "java", "python"],
    required : true 
  },
  runtime: {
    type: Number,
  },
  memory: {
    type: Number,
  },
  testcasesPassed: {
    type: Number,
  },
  totalTestcases: {
    type: Number,
  },
  code: {
    type: String,
  },
  aiAnalysis: {
    timeComplexity: String,
    spaceComplexity: String,
    optimizationSuggestions: String,
  },
  failedTest : {
    testCase : String , 
    expected_output : String ,
    output : String , 
    err : String,
    status_id : Number,
    compilation_output: {
    type: String,
    },
  },
  timeTaken: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{methods : {
    generateCacheKey : function(){
        return crypto.createHash("sha256").update(`${this.code}--${this.problemNumber}--${this.languageUsed}`).digest("hex")
    }
},timestamps : true});

 
const submissionModel = mongoose.model("Submission", submissionSchema);

export default submissionModel ; 

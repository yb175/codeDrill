import validateProblem from "../../utils/problem/problemValidation.js";
import problemModel from "../../models/problem/problemSchema.js";
import storeProblemSemantic from "../../utils/problem/storeProblemSementicly.js";
/**
 * =========================================================
 * 🧠 FUNCTION DOCUMENTATION: createProblem
 * =========================================================
 * @description
 * This controller handles the **creation of a new coding problem** in the database.
 * It performs three main operations:
 * 
 * 1️⃣ **Validation** – Uses `validateProblem()` to check whether the problem is valid and not semantically duplicated.  
 * 2️⃣ **Semantic Storage** – Uses `storeProblemSemantic()` to embed the problem title and description into a Pinecone vector database for similarity detection.  
 * 3️⃣ **Database Creation** – Saves the validated problem into MongoDB using `problemModel`.
 * 
 * ---------------------------------------------------------
 * 📥 Input JSON Format (req.body):
 * {
 *   "title": "Product of Two Numbers",
 *   "description": {
 *     "text": "Given two integers, find their product and print the result.",
 *     "imgUrl": "https://example.com/problem.png"
 *   },
 *   "problemTags": ["math", "easy"],
 *   "companyTags": ["Google", "Amazon"],
 *   "hints": ["Use * operator", "Handle negative numbers"],
 *   "acceptanceRate": 85,
 *   "visibleTestCases": [
 *     { "testCase": "2 3", "output": "6", "description": "Basic case" },
 *     { "testCase": "4 5", "output": "20", "description": "Another case" }
 *   ],
 *   "hiddentestCases": [
 *     { "testCase": "10 0", "output": "0" },
 *     { "testCase": "-2 6", "output": "-12" }
 *   ],
 *   "boilerplate": [
 *     {
 *       "language": "cpp",
 *       "snippet": "#include <iostream>\nusing namespace std;\nint multiply(int a, int b){return a*b;}"
 *     }
 *   ],
 *   "difficulty": "easy",
 *   "refrenceSol": [
 *     {
 *       "language": "cpp",
 *       "snippet": "#include <iostream>\nusing namespace std;\nint main(){int a,b;cin>>a>>b;cout<<a*b;}"
 *     }
 *   ]
 * }
 * 
 * ---------------------------------------------------------
 * 📤 Output JSON Format (API Response):
 * ✅ **Success Response:**
 * {
 *   "success": true,
 *   "message": "problem created successfully"
 * }
 * 
 * ❌ **Failure Responses:**
 * - Invalid input or failed testcases:
 * {
 *   "success": false,
 *   "message": "problem with same semantic meaning existing in db"
 * }
 * 
 * - Internal server or validation error:
 * {
 *   "success": false,
 *   "message": "Internal Server Error"
 * }
 * 
 * ---------------------------------------------------------
 * 🧩 Key Operations Flow:
 * 1. Extracts all problem fields from `req.body`.
 * 2. Merges visible and hidden test cases for validation.
 * 3. Calls `validateProblem()` → validates reference solution correctness and duplicate existence.
 * 4. Retrieves total number of problems to assign new `problemNumber`.
 * 5. Calls `storeProblemSemantic()` → embeds and stores semantic vector in Pinecone.
 * 6. Creates a new entry in MongoDB via `problemModel.create()`.
 * 7. Returns success message if all steps complete without error.
 * 
 * ---------------------------------------------------------
 * ⚙️ Dependencies Used:
 * - **validateProblem.js** → Validates problem correctness and duplication.
 * - **storeProblemSementicly.js** → Embeds and stores semantic vectors in Pinecone.
 * - **problemSchema.js** → MongoDB schema for problem storage.
 * =========================================================
 */
async function createProblem(req,res){
     try{
     const {title,description, problemTags, companyTags, hints, acceptanceRate, visibleTestCases, hiddentestCases, boilerplate, difficulty,refrenceSol} = req.body;
     const testCases = visibleTestCases.concat(hiddentestCases);
     const result = await validateProblem({refrenceSol, testCases,title,description}); 
     if(!result.success) return res.status(400).json({success:false, message: result.message});
     const count = await problemModel.countDocuments() ; 
     const problemCreater = req.result._id ;
     const problemNumber = count+1 ; 
     await storeProblemSemantic({title,description,problemNumber}) 
     await problemModel.create({title,problemNumber,description,problemTags,companyTags,hints,acceptanceRate,visibleTestCases,hiddentestCases,boilerplate,problemCreater,difficulty,refrenceSol}) ; 
     return res.status(200).json({success : true , message : 'problem created successfully'}) ;
     }catch(err){
          return res.status(500).json({success : false ,message : err.message}) ; 
     } 
}

export default createProblem ; 
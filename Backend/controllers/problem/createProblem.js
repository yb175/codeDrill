import validateProblem from "../../utils/problemValidation.js";
import problemModel from "../../models/problem/problemSchema.js";
/**
 * Creates a new problem in the database.
 * @param {Object} req.body - JSON object containing the problem details.
 * @param {Object} res - response object.
 * @returns {Promise<Object>} - a promise that resolves to a JSON object containing the API response.
 * @throws {Error} - if there is an error in the validation or creation process.
 */
async function createProblem(req,res){
     try{
     const {title,description, problemTags, companyTags, hints, acceptanceRate, visibleTestCases, hiddentestCases, boilerplate, problemCreater, difficulty,refrenceSol} = req.body;
     const result = await validateProblem({refrenceSol, visibleTestCases}); 
     if(!result.success) return res.status(400).json({success:false, message: result.message});
     const count = await problemModel.countDocuments() ; 
     await problemModel.create({title,problemNumber : count+1,description,problemTags,companyTags,hints,acceptanceRate,visibleTestCases,hiddentestCases,boilerplate,problemCreater,difficulty}) ; 
     return res.status(200).json({success : true , message : 'problem created successfully'}) ;
     }catch(err){
          return res.status(500).json({success : false ,message : err.message}) ; 
     } 
}

export default createProblem ; 
import problemModel from "../../models/problem/problemSchema.js";
/**
 * @fileoverview
 * Problem Controller
 * 
 * Contains functions to handle API requests related to problems.
 * 
 * Functions:
 *   - getAllProblem: Fetch paginated list of problems
 *   - getProblembyId: Fetch a single problem by its problemNumber
 * 
 * @module controllers/problemController
 */

/**
 * @function getAllProblem
 * @description Fetch all problems with pagination support.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.query.page - Page number for pagination (integer, optional, default: 1)
 * @param {Object} req.query.limit - Number of items per page (integer, optional, default: 10)
 * 
 * @param {Object} res - Express response object
 * @returns {JSON} Returns JSON response with the following structure:
 * {
 *   success: boolean,
 *   pageNumber: number,
 *   totalPages: number,
 *   data: Array<Object> // Array of problem objects
 * }
 * 
 * @throws Returns 500 status if server or DB error occurs.
 */
export async function getAllProblem(req, res) {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const problems = await problemModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select('title problemNumber  problemTags companyTags difficulty') ;  
    const total = await problemModel.countDocuments() ; 
    res.status(200).json({
        success : true , 
        pageNumber : page ,
        totalPages : Math.ceil(total/limit) ,
        data : problems 
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getProblembyId(req,res){
  try{
    const id = req.params.id ; 
    const problem = await problemModel.findOne({problemNumber : id}).select('title problemNumber description problemTags companyTags hints acceptanceRate visibleTestCases boilerplate difficulty') ;  
    if(!problem){
      res.status(404).json({
        success : false , 
        message: `problem not found` 
      })
    }
    res.status(200).json({
      success : true , 
      data : problem
    })
  }catch(err){
    res.status(500).json({
      success : false , 
      message : err.message
    })
  }
}

import problemModel from "../../models/problem/problemSchema.js";
import validateProblem from "../../utils/problem/problemValidation.js";

/**
 * @function editProblem
 * @description
 * Updates an existing problem in the database by editing its tags, test cases, or reference solution.
 * It merges new data with existing ones (avoiding duplicates), validates test cases against the reference solution,
 * and ensures that only allowed fields are updated.
 *
 * @route PUT /api/problems/edit
 * @access Private/Admin
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - The payload containing editable fields
 * @param {number} req.body.problemNumber - Unique identifier of the problem to be updated (required)
 * @param {string[]} [req.body.problemTags] - DSA topic tags for the problem (e.g. ["array", "recursion"])
 * @param {string[]} [req.body.companyTags] - List of company tags (e.g. ["Google", "Amazon"])
 * @param {Array<{input: string, output: string}>} [req.body.visibleTestCases] - User-visible test cases
 * @param {Array<{input: string, output: string}>} [req.body.hiddentestCases] - Hidden test cases for backend validation
 * @param {string} [req.body.refrenceSol] - Reference solution code to validate test cases
 *
 * @example
 * // Request Body Example
 * {
 *   "problemNumber": 12,
 *   "problemTags": ["array", "math"],
 *   "companyTags": ["Google"],
 *   "visibleTestCases": [{ "input": "2 3", "output": "5" }],
 *   "hiddentestCases": [{ "input": "10 20", "output": "30" }],
 *   "refrenceSol": "function add(a,b){ return a+b; }"
 * }
 *
 * @returns {Object} JSON Response
 * @returns {boolean} success - Status of the operation
 * @returns {string} message - Status or error message
 * @returns {Object} [data] - Updated problem object on success
 *
 * @responseExample 200 - Successful Update
 * {
 *   "success": true,
 *   "message": "problem statement 12 updated successfully",
 *   "data": {
 *     "problemNumber": 12,
 *     "problemTags": ["array", "math"],
 *     "companyTags": ["Google", "Amazon"],
 *     "visibleTestCases": [{ "input": "2 3", "output": "5" }],
 *     "hiddentestCases": [{ "input": "10 20", "output": "30" }],
 *     "refrenceSol": "function add(a,b){ return a+b; }"
 *   }
 * }
 *
 * @responseExample 400 - Invalid Fields
 * {
 *   "success": false,
 *   "message": "Invalid fields"
 * }
 *
 * @responseExample 404 - Missing Problem Number
 * {
 *   "success": false,
 *   "message": "No problem number provided"
 * }
 *
 * @responseExample 500 - Server Error
 * {
 *   "success": false,
 *   "message": "Internal Server Error"
 * }
 */

async function editProblem(req, res) {
  try {
    const edited = req.body;
    if (!edited)
      res.status(404).send({
        success: false,
        message: "No fields were provided for editing",
      });
    if (!edited.problemNumber) {
      res.status(404).send({
        success: false,
        message: "No problem number provided",
      });
    }
    let {
      problemTags,
      comapnyTags,
      visibleTestCases,
      hiddentestCases,
      refrenceSol,
      problemNumber,
    } = edited;
    const tobeUpdated = [
      "problemTags",
      "companyTags",
      "visibleTestCases",
      "hiddentestCases",
      "refrenceSol",
    ];
    const canUpdate = tobeUpdated.find(
      (fields) => edited[fields] !== undefined
    );
    if (!canUpdate) {
      res.status(400).send({
        success: false,
        message: "Invalid fields",
      });
    }
    // DB call
    const problem = await problemModel.findOne({ problemNumber });
    if (visibleTestCases || hiddentestCases || refrenceSol) {
       
      const testCases = [
        ...(visibleTestCases || []),
        ...(hiddentestCases || []),
      ];
      refrenceSol = refrenceSol || problem.refrenceSol;
      const result = await validateProblem({ refrenceSol, testCases });
      if (result.success == false) {
        res.status(200).send(result);
      }
    }
    problem.companyTags = Array.from(
      new Set([...(comapnyTags || []), ...(problem.companyTags || [])])
    );
    problem.problemTags = Array.from(
      new Set([...(problemTags || []), ...(problem.problemTags || [])])
    );
    if (visibleTestCases) problem.visibleTestCases = Array.from(new Set([...visibleTestCases,...(problem.visibleTestCases || [])]));
    if (hiddentestCases) problem.hiddentestCases = Array.from(new Set([...hiddentestCases,...(problem.hiddentestCases || [])]));
    if (refrenceSol) problem.refrenceSol = refrenceSol;
    await problem.save();
    res.status(200).send({
      success: true,
      message: `problem statement ${problemNumber} updated successfully`,
      data: problem,
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
}

export default editProblem;

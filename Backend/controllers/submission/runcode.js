import problemModel from "../../models/problem/problemSchema.js";
import getLanguageCode from "../../utils/problem/langCode.js";
import batchSubmit from "../../utils/submission/batchSubmit.js";
/**
 * @function runcode
 * @description Executes user-submitted code against visible test cases of a specified problem.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing code, problem number, and language.
 * @param {string} req.body.code - Source code submitted by the user.
 * @param {string} req.body.problemNumber - Unique identifier or number of the problem.
 * @param {string} req.body.language - Programming language of the submitted code.
 * 
 * @param {Object} res - Express response object.
 * 
 * @returns {Object} JSON response containing execution results of all visible test cases.
 * 
 * @example
 * // Request body
 * {
 *   "code": "print('Hello, World!')",
 *   "problemNumber": "101",
 *   "language": "python"
 * }
 * 
 * @example
 * // Successful response
 * {
 *   "success": true,
 *   "message": "code run successful",
 *   "data": [
 *     {
 *       "testCase": "input1",
 *       "expected_output": "output1",
 *       "output": "output1",
 *       "err": "",
 *       "status_id": 1
 *     },
 *     {
 *       "testCase": "input2",
 *       "expected_output": "output2",
 *       "output": "output2",
 *       "err": "",
 *       "status_id": 1
 *     }
 *   ]
 * }
 * 
 * @example
 * // Error response: missing fields
 * {
 *   "success": false,
 *   "message": "Fields missing"
 * }
 * 
 * @example
 * // Error response: unsupported language
 * {
 *   "success": false,
 *   "message": "Language not supported"
 * }
 * 
 * @example
 * // Error response: server error
 * {
 *   "success": false,
 *   "message": "Internal Server Error"
 * }
 */

export default async function runcode(req, res) {
  try {
    const { code, problemNumber, language } = req.body;
    if (!code || !problemNumber || !language) {
      return res.status(404).json({
        success: false,
        message: "Fields missing",
      });
    }
    const languageId = getLanguageCode(language);
    if (!languageId) {
      return res.status(404).json({
        success: false,
        message: "Language not supported",
      });
    }
    const problem = await problemModel.findOne({ problemNumber });
    const visibleTestCases = problem.visibleTestCases;
    let submissions = [];
    for (let i = 0; i < visibleTestCases.length; i++) {
      const { testCase, output } = visibleTestCases[i];
      submissions.push({
        language_id: languageId,
        source_code: code,
        stdin: testCase,
        expected_output: output,
      });
    }
    const submissionResult = (await batchSubmit(submissions)).data;
    let analysis = [];
    for (let result of submissionResult) {
      analysis.push({
        testCase: result.stdin,
        expected_output: result.expected_output,
        output: result.stdout,
        err: result.stderr,
        status_id: result.status_id,
      });
    }
    res.send({
      success : true , 
      message : "code run successfull", 
      data : analysis 
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

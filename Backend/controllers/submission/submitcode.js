import getLanguageCode from "../../utils/problem/langCode.js";
import submissionModel from "../../models/submission/submission.js";
import batchSubmit from "../../utils/submission/batchSubmit.js";
import redisClient from "../../models/redis/client.js";
import { Buffer } from "buffer";
import jwt from "jsonwebtoken";
import decode from "../../utils/submission/decodebase64.js";
import cpp_runner from "../../submissionTemplate/cpp_runner.js";
import java_runner from "../../submissionTemplate/java_runner.js";
import python_runner from "../../submissionTemplate/py_runner.js";
import js_runner from "../../submissionTemplate/js_runner.js";

/**
 * @route POST /submit
 * @desc Submits a code for a problem and evaluates it against hidden test cases
 * @access Private (requires JWT in cookies)
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.code - The source code to be submitted
 * @param {number} req.body.problemNumber - Unique identifier of the problem
 * @param {string} req.body.language - Programming language used ("cpp", "java", "python")
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON Response
 *
 * @returnsExample 200 - Success
 * {
 *   "success": true,
 *   "message": "Code submitted successfully",
 *   "data": {
 *     "problemNumber": 12,
 *     "status": "solved",
 *     "languageUsed": "cpp",
 *     "totalTestcases": 3,
 *     "testcasesPassed": 3,
 *     "code": "int add(int a, int b) { return a+b; }",
 *     "runtime": 0.52,
 *     "memory": 1024,
 *     "failedTest": null
 *   }
 * }
 *
 * @returnsExample 200 - Cache Hit
 * {
 *   "success": true,
 *   "message": "Code submitted successfully",
 *   "data": {
 *     "problemNumber": 12,
 *     "status": "solved",
 *     "languageUsed": "cpp",
 *     "totalTestcases": 3,
 *     "testcasesPassed": 3,
 *     "code": "int add(int a, int b) { return a+b; }",
 *     "runtime": 0.52,
 *     "memory": 1024,
 *     "failedTest": null
 *   }
 * }
 *
 * @returnsExample 400 - Missing Fields
 * {
 *   "success": false,
 *   "message": "Fields missing"
 * }
 *
 * @returnsExample 404 - Problem Not Found
 * {
 *   "success": false,
 *   "message": "problem not found"
 * }
 *
 * @returnsExample 404 - Language Not Supported
 * {
 *   "success": false,
 *   "message": "Language not supported"
 * }
 *
 * @returnsExample 500 - Internal Server Error
 * {
 *   "success": false,
 *   "message": "Internal Server Error"
 * }
 */

async function submitCode(req, res) {
  try {
    let { code, problemNumber, language, functionName ,returnType, inputs } = req.body;
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
    const problem = JSON.parse(
      await redisClient.get(`problem:${problemNumber}`)
    );
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "problem not found",
      });
    }
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded._id;
    const hiddentestCases = problem.hiddentestCases;
    const newSubmission = await submissionModel.create({
      user: userId,
      problemNumber: parseInt(problemNumber),
      status: "pending",
      languageUsed: language,
      totalTestcases: hiddentestCases.length,
      code: code,
    });
    const cachekey = newSubmission.generateCacheKey();
    const result = await redisClient.get(cachekey);
    if (result) {
      const cachedSubmission = JSON.parse(result);
      return res.status(200).json({
        success: true,
        message: "Code submitted successfully",
        data: cachedSubmission,
      });
    }
    let submissions = [];
    for (let i = 0; i < hiddentestCases.length; i++) {
      const { testCase, output } = hiddentestCases[i];
      const cleanInput = testCase.replace(/^"|"$/g, "");
      submissions.push({
        language_id: languageId,
        source_code: Buffer.from(code).toString("base64"),
        stdin: Buffer.from(cleanInput).toString("base64"),
        expected_output: Buffer.from(output).toString("base64"),
      });
    }
    let runtime = 0;
    let memory = 0;
    let testcasesPassed = 0;
    let failedTest = null;
    const submissionResult = await batchSubmit(submissions);
    const data = submissionResult.data;

    for (let result of data) {
      runtime += Math.ceil(parseFloat(result.time) || 0);
      memory = Math.max(memory, result.memory || 0);
      if (result.status_id == 3) {
        testcasesPassed++;
      } else {
        if (!failedTest) {
          failedTest = {
            testCase: decode(result.stdin),
            expected_output: decode(result.expected_output),
            output: decode(result.stdout),
            err: decode(result.stderr),
            status_id: result.status_id,
            compilation_output: decode(result.compile_output),
          };
        }
      }
    }

    const submission = await submissionModel
      .findByIdAndUpdate(
        newSubmission._id,
        {
          status:
            testcasesPassed === hiddentestCases.length ? "solved" : "attempted",
          runtime: runtime,
          memory: memory,
          testcasesPassed: testcasesPassed,
          failedTest: failedTest,
        },
        { new: true }
      )
      .select("-user -__v -createdAt -updatedAt");
    redisClient.set(cachekey, JSON.stringify(submission), { EX: 3600 });

    if (testcasesPassed === hiddentestCases.length) {
      if (req.result.updateProblemSolved(req.problem._id)) {
        req.result.problemSolved;
      }
    }
    res.status(200).json({
      success: true,
      message: "Code submitted successfully",
      data: submission,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
export default submitCode;

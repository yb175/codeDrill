import problemModel from "../../models/problem/problemSchema.js";
import getLanguageCode from "../../utils/problem/langCode.js";
import batchSubmit from "../../utils/submission/batchSubmit.js";
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

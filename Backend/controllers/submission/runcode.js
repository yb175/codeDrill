import problemModel from "../../models/problem/problemSchema.js";
import getLanguageCode from "../../utils/problem/langCode.js";
import batchSubmit from "../../utils/submission/batchSubmit.js";
import decode from "../../utils/submission/decodebase64.js";

export default async function runcode(req, res) {
  try {
    let { code, problemNumber, language } = req.body;

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

    const problem = req.problem;
    const visibleTestCases = problem.visibleTestCases;

    let submissions = [];

    for (let i = 0; i < visibleTestCases.length; i++) {
      const { testCase, output } = visibleTestCases[i];
      const cleanInput = testCase.replace(/^"|"$/g, "");
      submissions.push({
        language_id: languageId,
        source_code: Buffer.from(code).toString("base64"),
        stdin: Buffer.from(cleanInput).toString("base64"),
        expected_output: Buffer.from(output).toString("base64"),
      });
    }

    const submissionData = await batchSubmit(submissions);

    if (!submissionData.success) {
      return res.status(500).json({
        success: false,
        message: submissionData.message,
      });
    }

    const submissionResult = submissionData.data;
    let analysis = [];

    for (let result of submissionResult) {
      analysis.push({
        testCase: decode(result.stdin),
        expected_output: decode(result.expected_output),
        output: decode(result.stdout),
        err: decode(result.stderr),
        status_id: decode(result.status_id),
        compilation_output: decode(result.compile_output),
      });
    }

    res.send({
      success: true,
      message: "code run successfull",
      data: analysis,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

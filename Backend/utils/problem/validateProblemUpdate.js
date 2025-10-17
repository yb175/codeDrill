import getLanguageCode from "./langCode.js";
import axios from "axios";
import getSubmissionResult from "./submissionResults.js";

/**
 * @function validateProblemUpdate
 * @description
 * Validates payload for editing a problem. Checks only the provided fields
 * (problemTags, companyTags, visibleTestCases, hiddentestCases, refrenceSol).
 * Runs reference solution against test cases if both are provided.
 * Title and description are NOT mandatory for update.
 *
 * @param {Object} data - Update payload
 * @param {Array<{input:string, output:string}>} [data.testCases] - Test cases to validate
 * @param {Array<{language:string, snippet:string}>} [data.refrenceSol] - Reference solutions
 *
 * @returns {Object} Validation result
 * @returns {boolean} success - true if valid, false if invalid
 * @returns {string} message - Description
 */
async function validateProblemUpdate(data) {
  try {
    const { refrenceSol, testCases } = data;

    // If both testCases and refrenceSol are provided, validate them
    if (refrenceSol && testCases) {
      if (!Array.isArray(refrenceSol) || !Array.isArray(testCases))
        return { success: false, message: "invalid input format" };

      for (let { language, snippet } of refrenceSol) {
        if (!language || !snippet)
          return { success: false, message: "language or snippet missing in reference solution" };
      }

      for (let { testCase, output } of testCases) {
        if (testCase === undefined || output === undefined)
          return { success: false, message: "invalid test case format" };
      }

      // --- Judge0 Validation ---
      const submissions = refrenceSol.flatMap(({ language, snippet }) =>
        testCases.map(({ testCase, output }) => ({
          source_code: Buffer.from(snippet).toString("base64"),
          language_id: getLanguageCode(language),
          stdin: Buffer.from(testCase).toString("base64"),
          expected_output: Buffer.from(output).toString("base64"),
        }))
      );

      const options = {
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
        params: { base64_encoded: "true" },
        headers: {
          "x-rapidapi-key": process.env.JUDGE0_API_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        data: { submissions },
      };

      const response = await axios.request(options);
      if (!response || !response.data) return { success: false, message: "tokens not present" };

      const tokens = response.data.map((item) => item.token);
      const result = await getSubmissionResult(tokens);
      if (!result.success) return { success: false, message: result.message };
    }

    // If only one or none of testCases / refrenceSol are provided → skip Judge0 validation
    return { success: true, message: "Validation passed" };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export default validateProblemUpdate;
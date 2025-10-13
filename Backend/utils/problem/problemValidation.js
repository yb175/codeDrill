import getLanguageCode from "./langCode.js";
import axios from "axios";
import getSubmissionResult from "./submissionResults.js";
/**
 * Validates a problem by checking if the reference solution passes all visible test cases.
 * @param {Object} data - an object containing the reference solution and visible test cases.
 * @returns {Promise<Object>} - a promise that resolves to an object containing the validation result.
 * @throws {Error} - if there is an error in the validation process.
 */
async function validateProblem(data) {
  try {
    const { refrenceSol, visibleTestCases } = data;
    for (let { language, snippet } of refrenceSol) {
      if (!language || !snippet) {
        return { success: false, message: "language or snippet is missing" };
      }
      const submissions = visibleTestCases.map(({ testCase, output }) => {
        console.log(`testcase : ${testCase} output : ${output}`)
        if (!testCase || !output) throw new Error("invalid input format");
        return {
          source_code: Buffer.from(snippet).toString("base64"),
          language_id: getLanguageCode(language),
          stdin: Buffer.from(testCase).toString("base64"),
          expected_output: Buffer.from(output).toString("base64"),
        };
      });
      const options = {
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
        params: { base64_encoded: "true" },
        headers: {
          "x-rapidapi-key": process.env.JUDGE0_API_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        data: {
          submissions,
        },
      };
      async function fetchToken() {
        try {
          const response = await axios.request(options);
          return response;
        } catch (error) {
          throw new Error(error.message);
        }
      }
      const tokenResponse = await fetchToken();
      if (!tokenResponse) return { success: false, message: "tokens not present" };
      const tokens = tokenResponse.data.map((item) => item.token);
      const res = await getSubmissionResult(tokens);
      if (res.success === false)
        return { success: false, message: res.message };
    }
    return { success: true, message: "All testcase passed" };
  } catch (err) {
    // console.log(err);
    return {success : false , message : err.message};
  }
}

export default validateProblem;
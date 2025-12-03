import getLanguageCode from "./langCode.js";
import axios from "axios";
import getSubmissionResult from "./submissionResults.js";

/**
 * ----------------------------------------------------------------------------
 * FUNCTION: validateProblem (Simplified)
 * ----------------------------------------------------------------------------
 *
 * DESCRIPTION:
 *  Validates a programming problem before saving it to the database.
 *  Ensures:
 *   1. The provided reference solutions successfully pass all visible test cases.
 *
 * ----------------------------------------------------------------------------
 * INPUT JSON FORMAT:
 * {
 *   "title": "Multiply Two Numbers",
 *   "description": {
 *       "text": "Given two integers, find their product.",
 *       "imgUrl": ""
 *   },
 *   "testCases": [
 *       { "testCase": "2 3", "output": "6" },
 *       { "testCase": "10 5", "output": "50" }
 *   ],
 *   "refrenceSol": [
 *       { "language": "c++", "snippet": "#include <iostream>..." }
 *   ]
 * }
 * ----------------------------------------------------------------------------
 */

async function validateProblem(data) {
  try {
    const { refrenceSol, testCases, title, description } = data;

    // --- STEP 1: Input validation ---
    if (!refrenceSol || !testCases || !title || !description)
      return { success: false, message: "invalid input format" };

    // --- STEP 2: Validate all reference solutions against test cases ---
    for (let { language, snippet } of refrenceSol) {
      if (!language || !snippet) {
        return { success: false, message: "language or snippet is missing" };
      }

      const submissions = testCases.map(({ testCase, output }) => {
        if (!testCase || !output) throw new Error("invalid test case format");

        return {
          source_code: Buffer.from(snippet).toString("base64"),
          language_id: getLanguageCode(language),
          stdin: Buffer.from(
            typeof testCase === "string" ? testCase : JSON.stringify(testCase)
          ).toString("base64"),
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
        data: { submissions },
      };

      const fetchToken = async () => {
        try {
          const response = await axios.request(options);
          return response;
        } catch (error) {
          throw new Error(error.message);
        }
      };

      const tokenResponse = await fetchToken();
      if (!tokenResponse)
        return { success: false, message: "tokens not present" };

      const tokens = tokenResponse.data.map((item) => item.token);
      const res = await getSubmissionResult(tokens);

      if (res.success === false)
        return { success: false, message: res.message };
    }

    // ✅ All testcases passed
    return { success: true, message: "All testcase passed" };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export default validateProblem;

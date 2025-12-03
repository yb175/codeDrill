import getLanguageCode from "./langCode.js";
import axios from "axios";
import getSubmissionResult from "./submissionResults.js";

async function validateProblemUpdate(data) {
  try {
    const { refrenceSol, testCases } = data;

    if (refrenceSol && testCases) {
      if (!Array.isArray(refrenceSol) || !Array.isArray(testCases))
        return { success: false, message: "invalid input format" };

      for (let { language, snippet } of refrenceSol) {
        if (!language || !snippet)
          return { success: false, message: "language or snippet missing" };
      }

      for (let { testCase, output } of testCases) {
        if (testCase === undefined || output === undefined)
          return { success: false, message: "invalid test case format" };
      }

      // BUILD SUBMISSIONS
      const submissions = refrenceSol.flatMap(({ language, snippet }) => {
        const langId = getLanguageCode(language);
        if (!langId)
          return [{ error: true, message: `Unsupported language: ${language}` }];

        return testCases.map(({ testCase, output }) => ({
          source_code: Buffer.from(snippet).toString("base64"),
          language_id: langId,
          stdin: Buffer.from(JSON.stringify(testCase)).toString("base64"),
          expected_output: Buffer.from(output.toString()).toString("base64")
        }));
      });

      // If any unsupported language was found → stop
      if (submissions.some(s => s.error))
        return submissions.find(s => s.error);

      const response = await axios.request({
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
        params: { base64_encoded: true },
        headers: {
          "x-rapidapi-key": process.env.JUDGE0_API_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        data: { submissions }
      });

      if (!response?.data)
        return { success: false, message: "No tokens received" };

      const tokens = response.data.map(t => t.token);
      const result = await getSubmissionResult(tokens);

      if (!result.success)
        return { success: false, message: result.message };
    }

    return { success: true, message: "Validation passed" };

  } catch (err) {
    return { success: false, message: err.message };
  }
}

export default validateProblemUpdate;

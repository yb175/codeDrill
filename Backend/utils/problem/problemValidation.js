import getLanguageCode from "./langCode.js";
import axios from "axios";
import getSubmissionResult from "./submissionResults.js";
import getThreshhold from "./checkSementicMeaning.js";
/**
 * ----------------------------------------------------------------------------
 * FUNCTION: validateProblem
 * ----------------------------------------------------------------------------
 * 
 * DESCRIPTION:
 *  Validates a programming problem before saving it to the database.
 *  The validation ensures:
 *   1. The problem is not semantically duplicate of an existing one.
 *   2. The provided reference solutions pass all visible test cases.
 * 
 * ----------------------------------------------------------------------------
 * INPUT JSON FORMAT:
 * {
 *   "title": "Multiply Two Numbers",              // String: Problem title
 *   "description": {                              // Object: Problem statement
 *       "text": "Given two integers, find their product.",
 *       "imgUrl": "https://example.com/problem.png"
 *   },
 *   "testCases": [                                // Array of test cases
 *       {
 *         "testCase": "2 3",                      // String: Input for program
 *         "output": "6"                           // String: Expected output
 *       },
 *       {
 *         "testCase": "10 5",
 *         "output": "50"
 *       }
 *   ],
 *   "refrenceSol": [                              // Array of reference solutions
 *       {
 *         "language": "c++",                      // String: Programming language
 *         "snippet": "#include <iostream>..."      // String: Source code
 *       }
 *   ]
 * }
 * ----------------------------------------------------------------------------
 * 
 * PROCESS FLOW:
 *  1. **Input Validation**
 *     - Checks presence of required fields: `refrenceSol`, `testCases`, `title`, `description`.
 *     - Returns error if any are missing.
 * 
 *  2. **Duplicate Detection**
 *     - Calls `getThreshhold({ title, description })` to compute semantic similarity
 *       between current problem and existing ones in the DB.
 *     - If similarity (threshold) ≥ `DUPLICATE_THRESHOLD` (default: 0.82),
 *       returns an error with the matching problem’s data.
 * 
 *  3. **Reference Solution Validation**
 *     - Iterates through each solution in `refrenceSol`.
 *     - For every test case:
 *         • Encodes code, input, and expected output in Base64.
 *         • Prepares batch submissions for the Judge0 API.
 *     - Sends the submissions to `https://judge0-ce.p.rapidapi.com/submissions/batch`
 *       using the RapidAPI Judge0 key.
 *     - Retrieves tokens → checks results via `getSubmissionResult(tokens)`.
 *     - If any test case fails → returns an error message.
 * 
 *  4. **Final Response**
 *     - If all validations succeed → returns `{ success: true, message: "All testcase passed" }`.
 * 
 * ----------------------------------------------------------------------------
 * OUTPUT JSON FORMAT:
 * 
 * // ✅ SUCCESS RESPONSE:
 * {
 *   "success": true,
 *   "message": "All testcase passed"
 * }
 * 
 * // ❌ FAILURE RESPONSE EXAMPLES:
 * 
 * // 1. Missing required fields
 * {
 *   "success": false,
 *   "message": "invalid input format"
 * }
 * 
 * // 2. Duplicate problem found
 * {
 *   "success": false,
 *   "message": "problem with same semantic meaning existing in db",
 *   "data": { ...existingProblemData }
 * }
 * 
 * // 3. Judge0 compilation or execution error
 * {
 *   "success": false,
 *   "message": "tokens not present" 
 * }
 * 
 * // 4. Test case mismatch or runtime failure
 * {
 *   "success": false,
 *   "message": "some testcases failed"
 * }
 * 
 * ----------------------------------------------------------------------------
 * DEPENDENCIES:
 * - axios: For API requests to Judge0.
 * - getLanguageCode(language): Converts human-readable language (e.g. 'c++')
 *   to Judge0-compatible language ID.
 * - getThreshhold({ title, description }): Computes similarity score vs DB problems.
 * - getSubmissionResult(tokens): Polls Judge0 for execution results.
 * 
 * ----------------------------------------------------------------------------
 * CONFIGURABLES:
 * - DUPLICATE_THRESHOLD = 0.82     // Can be adjusted for more or less strict duplication detection
 * - JUDGE0_API_KEY (in .env)       // RapidAPI Judge0 key
 * ----------------------------------------------------------------------------
 */
async function validateProblem(data) {
  try {
    const { refrenceSol, testCases, title, description } = data;
    if (!refrenceSol || !testCases || !title || !description)
      return { success: false, message: "invalid input format" };

    
    const DUPLICATE_THRESHOLD = 0.82; // adjust as needed
    const { threshhold, problem } = await getThreshhold({ title, description });
    if (threshhold >= DUPLICATE_THRESHOLD)
      return {
        success: false,
        message: "problem with same semantic meaning existing in db",
        data: problem,
      };

    // --- STEP 2: Validate all reference solutions against test cases ---
    for (let { language, snippet } of refrenceSol) {
      if (!language || !snippet) {
        return { success: false, message: "language or snippet is missing" };
      }

      const submissions = testCases.map(({ testCase, output }) => {
        console.log(`testcase : ${testCase} output : ${output}`);
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
        data: { submissions },
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
      if (!tokenResponse)
        return { success: false, message: "tokens not present" };

      const tokens = tokenResponse.data.map((item) => item.token);
      const res = await getSubmissionResult(tokens);
      if (res.success === false)
        return { success: false, message: res.message };
    }

    return { success: true, message: "All testcase passed" };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export default validateProblem;
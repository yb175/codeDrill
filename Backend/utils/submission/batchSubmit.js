import getbatchSubmit from "./getbatchSubmit.js";
import axios from "axios";

/**
 * Submits a batch of code for a problem and evaluates it against the hidden test cases of the problem.
 * 
 * @param {Array<Object>} submissions - Array of submission objects containing code, problemNumber and language
 * @returns {Promise<Object>} - Returns an object with success flag and data or message
 */
async function batchSubmit(submissions) {
    try {
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

        let tokenResponse;
        try {
            tokenResponse = await axios.request(options);
        } catch (error) {
            return {
                success: false,
                message: `Judge0 POST failed: ${error.message}`,
            };
        }

        if (!tokenResponse || !tokenResponse.data) {
            return {
                success: false,
                message: "Tokens not received after initial submission.",
            };
        }

        const tokens = tokenResponse.data.map((item) => item.token);
        const submissionResult = await getbatchSubmit(tokens);

        if (!submissionResult.success) {
            return {
                success: false,
                message: submissionResult.message || "Submission polling failed.",
            };
        }

        return { success: true, data: submissionResult.data };
    } catch (err) {
        return {
            success: false,
            message: `Worker execution failed: ${err.message}`,
        };
    }
}

export default batchSubmit;

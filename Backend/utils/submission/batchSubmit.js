import getbatchSubmit from "./getbatchSubmit.js";
import axios from "axios";
/**
 * Submits a batch of code for a problem and evaluates it against the hidden test cases of the problem.
 * 
 * @param {Array<Object>} submissions - Array of submission objects containing code, problemNumber and language
 * @returns {Promise<Object>} - A promise that resolves to an object containing the submission results
 * @throws {Error} - if the submission processing times out or if there is an error in the API request
 */
async function batchSubmit(submissions) {
    //  console.log(submissions) ; 
    try {
        const options = {
            method: "POST",
            url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
            params: {
                base64_encoded: "false",
            },
            headers: {
                "x-rapidapi-key": process.env.JUDGE0_API_KEY,
                "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                "Content-Type": "application/json",
            },
            data: {
                submissions,
            },
        };
        
        let tokenResponse;
        try {
            tokenResponse = await axios.request(options);
        } catch (error) {
            throw new Error(`Judge0 POST failed: ${error.message}`);
        }
        
        if (!tokenResponse) {
            throw new Error("Tokens not received after initial submission.");
        }
        
        const tokens = tokenResponse.data.map((item) => item.token);
        const submissionResult = await getbatchSubmit(tokens);
        
        if (!submissionResult.success) {
            throw new Error(submissionResult.message || "Submission polling failed.");
        }
        
        return submissionResult;
    } catch (err) {
        throw new Error(`Worker execution failed: ${err.message}`);
    }
}

export default batchSubmit;
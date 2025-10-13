import axios from "axios";
/**
 * Retrieves the submission results from the Judge0 API.
 * @param {Array} tokens - an array of submission tokens.
 * @returns {Promise<Object>} - a promise that resolves to an object containing the submission results.
 * @throws {Error} - if the submission processing times out or if there is an error in the API request.
 */
async function getSubmissionResult(tokens) {
  try {
    const tokenString = tokens.map(t => t.token || t).join(",");
    if (!tokens) throw new Error("No token found");

    const options = {
      method: "GET",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: {
        tokens: tokenString,
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": process.env.JUDGE0_API_KEY,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
    };

    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      const response = await axios.request(options);
      const submissions = response.data.submissions;
      const allFinished = submissions.every((item) => item && item.status.id > 2);

      if (allFinished) {
        const allPassed = submissions.every((item) => item.status.id === 3);
        if (allPassed) {
          return { success: true, data: submissions };
        } else {
          return { success: false, message: "Some test cases failed", data: submissions };
        }
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    return { success: false, message: "Submission processing timed out." };

  } catch (err) {
    const message = err.response ? err.response.data.error : err.message;
    return { success: false, message: message };
  }
}

export default getSubmissionResult;
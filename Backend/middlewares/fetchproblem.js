import problemModel from "../models/problem/problemSchema.js";
import redisClient from "../models/redis/client.js";

async function fetchProblem(req, res, next) {
  try {
    const problemNumber = req.body.problemNumber;
    if (!problemNumber)
      return res.status(404).json({
        succes: false,
        message: "Problem not found",
      });
    const cachedResult = await redisClient.get(`problem:${problemNumber}`);
    if (cachedResult) {
      req.problem = JSON.parse(cachedResult) ;
      return next();
    }
    const problem = await problemModel.findOne({ problemNumber });
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "problem does not exist",
      });
    }
    await redisClient.set(
      `problem:${problemNumber}`,
      JSON.stringify(problem),
      { EX: 3600 } 
    );
    req.problem = problem ; 
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export default fetchProblem;

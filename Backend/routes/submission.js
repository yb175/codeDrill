import express from "express";
import submitCode from "../controllers/submission/submitcode.js";
import checkBlackList from "../middlewares/userAuth.js";
import runcode from "../controllers/submission/runcode.js";
import fetchProblem from "../middlewares/fetchproblem.js";
import ratelimiter from "../middlewares/ratelimiter.js";

const submissionRouter = express.Router();

submissionRouter.post("/",checkBlackList,ratelimiter,fetchProblem,submitCode); 
submissionRouter.get("/run",ratelimiter,fetchProblem,runcode) ;
export default submissionRouter;
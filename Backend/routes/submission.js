import express from "express";
import submitCode from "../controllers/submission/submitcode.js";
import checkBlackList from "../middlewares/userAuth.js";
import runcode from "../controllers/submission/runcode.js";
import fetchProblem from "../middlewares/fetchproblem.js";

const submissionRouter = express.Router();

submissionRouter.post("/",checkBlackList,fetchProblem,submitCode); 
submissionRouter.get("/run",fetchProblem,runcode) ;
export default submissionRouter;
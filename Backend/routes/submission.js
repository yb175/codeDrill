import express from "express";
import submitCode from "../controllers/submission/submitcode.js";
import checkBlackList from "../middlewares/userAuth.js";
import runcode from "../controllers/submission/runcode.js";

const submissionRouter = express.Router();

submissionRouter.post("/",checkBlackList, submitCode); 
submissionRouter.get("/run",runcode) ;
export default submissionRouter;
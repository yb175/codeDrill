import express from "express";
import submitCode from "../controllers/submission/submitcode.js";
import checkBlackList from "../middlewares/userAuth.js";
const submissionRouter = express.Router();

submissionRouter.post("/",checkBlackList, submitCode); 


export default submissionRouter;
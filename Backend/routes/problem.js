import express from "express" ; 
import adminAuth from "../middlewares/adminAuth.js";
import createProblem from "../controllers/problem/createProblem.js";
const problemRouter = express.Router() ;

// create a problem 
problemRouter.post('/create_problem',adminAuth,createProblem) ; 

// edit problem 
// delete problem

// get all problems 
// get problem by id

export default problemRouter ; 
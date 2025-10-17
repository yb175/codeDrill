import express from "express" ; 
import adminAuth from "../middlewares/adminAuth.js";
import createProblem from "../controllers/problem/createProblem.js";
import editProblem from "../controllers/problem/editproblem.js";
import { getAllProblem , getProblembyId} from "../controllers/problem/retrievel.js";
const problemRouter = express.Router() ;

// create a problem 
problemRouter.post('/',adminAuth,createProblem) ; 

// edit problem 
problemRouter.patch('/',adminAuth,editProblem) ; 

// get all problems 
problemRouter.get('/', getAllProblem);
// get problem by id
problemRouter.get(`/:id`,getProblembyId);
// get problem by comapny tag 
// get problem by topic tag 

export default problemRouter ; 
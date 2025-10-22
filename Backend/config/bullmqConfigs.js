import { Queue } from "bullmq";
import connection from "../models/redis/connection.js";
import { Worker } from "bullmq";
import batchSubmit from "../utils/submission/batchSubmit.js";
const submissionQueue = [] ; 

export const worker = async (job) => {
    try {
      let {submissions} = job;
      console.log(`Processing job ${job.id} with ${submissions.length} test cases`);
      const data = await batchSubmit(submissions) ; 
      return data ; 
    } catch (err) {
       console.error(`Submission worker failed for job ${job.id}: ${err.message}`);
        throw new Error(`Worker pipeline execution failed: ${err.message}`);
    }
  }
  
export default submissionQueue;

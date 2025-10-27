/**
 * @fileoverview Defines the Mongoose schema for a single problem submission record, typically used as a sub-document.
 *
 * @module models/schemas/problemSolvedSchema
 * @description
 * This module defines the `problemSolvedSchema` used to track the details of a user's submission to a coding problem.
 * It is designed to be embedded within a parent Mongoose schema (like a User profile) to maintain a list of solved problems.
 * TLE stands for Time Limit Exceeded. MLE stands for Memory Limit Exceeded.
 *
 * * **Schema Fields:**
 * - **`problemId`**: The numeric identifier of the problem. (Number)
 * - **`solvedAt`**: The timestamp of the submission. (Date, default: `Date.now`)
 * - **`languageUsed`**: The programming language used for the submission. (String)
 * - **`status`**: The outcome of the submission. (Enum: `"accepted"`, `"wrong answer"`, `"tle"`, `"mle"`, default: `"accepted"`)
 *
 * * **Dependencies:**
 * - `mongoose`: For schema definition.
 *
 * * **Output Format:**
 * @returns {mongoose.Schema} An uncompiled Mongoose Schema object named `problemSolvedSchema`.
 *
 * * **Usage Example:**
 * ```js
 * import problemSolvedSchema from './problemSolvedSchema.js';
 * // Used inside a parent schema:
 * const UserSchema = new Schema({
 * submissions: [problemSolvedSchema]
 * });
 * ```
 */
import mongoose from "mongoose";
const {Schema} = mongoose ; 
const problemSolvedSchema = new Schema({
    problemId : {
        type: Number
    }
})

export default problemSolvedSchema ; 
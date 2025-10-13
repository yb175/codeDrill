import mongoose from "mongoose";
import descriptionSchema from "./Schema/descriptionSchema.js";
import visibleCaseSchema from "./Schema/visibleTestCasesSchema.js";
import boilerPlateSchema from "./Schema/boilerPlateSchema.js";
const { Schema } = mongoose;
/**
 * @fileoverview Defines the Mongoose schema and model for problems in the coding platform application.
 *
 * * @module models/problem
 * @description
 * This module defines the `Problem` schema and model used to store problem-related information such as
 * title, description, test cases, boilerplate code, tags, difficulty, acceptance rate, and problem creator.
 * Each problem document also stores metadata like timestamps and auto-incremented problem number.
 *
 * * **Schema Fields:**
 * - **`title`**: Problem title. (String, required, min 10, max 500)
 * - **`problemNumber`**: Unique problem identifier. (Number, unique, indexed, auto-incremented)
 * - **`description`**: Problem description document, defined in `descriptionSchema` (required)
 * - **`problemTags`**: Array of tags related to problem topics (Array of Strings, default: empty)
 * - **`companyTags`**: Array of company tags for which the problem is relevant (Array of Strings, default: empty)
 * - **`hints`**: Array of hints for the problem (Array of Strings, default: empty)
 * - **`acceptanceRate`**: Problem acceptance percentage (Number, min 0, max 100, optional)
 * - **`visibleTestCases`**: Array of visible test case documents (Array of `visibleCaseSchema`, required)
 * - **`hiddenTestCases`**: Array of hidden test case strings (Array of Strings, default: empty)
 * - **`boilerplate`**: Array of boilerplate code documents (Array of `boilerPlateSchema`, required)
 * - **`problemCreater`**: Reference to user who created the problem (ObjectId, required)
 * - **`difficulty`**: Problem difficulty level (String, Enum: `"easy"`, `"medium"`, `"hard"`, required)
 * - **`timestamps`**: Automatically adds `createdAt` and `updatedAt` fields to each document
 *
 * * **Dependencies:**
 * - `mongoose`: For schema and model creation
 * - `descriptionSchema`: Imported sub-schema defining the problem description structure
 * - `visibleCaseSchema`: Imported sub-schema for visible test cases
 * - `boilerPlateSchema`: Imported sub-schema for boilerplate code in multiple languages
 *
 * * **Output Format:**
 * @returns {mongoose.Model} A compiled Mongoose model named `'problem'`, representing the `Problem` collection in MongoDB.
 *
 * * **Usage Example:**
 * ```js
 * import problemModel from './models/problem.js';
 * const newProblem = new problemModel({
 *   title: "Two Sum",
 *   description: { problemStatement: "Find two numbers...", constraints: [], examples: [] },
 *   visibleTestCases: [{ testCase: "nums = [2,7,11,15], target = 9", description: "Example 1" }],
 *   boilerplate: [{ language: "javascript", snippet: "function twoSum(nums, target) {}" }],
 *   problemCreater: userId,
 *   difficulty: "easy"
 * });
 * await newProblem.save();
 * ```
 */

const problemSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxLength: 500,
    minLength: 10,
  },
  problemNumber: {
    type: Number,
    unique: true,
    index: true,
  },
  description: {
    type: descriptionSchema,
    required: true,
  },
  problemTags: [String],
  companyTags: [String],
  hints: [String],
  acceptanceRate: {
    type: Number,
  },
  visibleTestCases: {
    type: [visibleCaseSchema],
    required: true,
  },
  hiddentestCases: [
    {
    testCase: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    output: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    }
}],
  boilerplate: {
    type: [boilerPlateSchema],
    required: true,
  },
  refrenceSol: {
    type: [boilerPlateSchema],
    required: true,
  },
  problemCreater: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
});

const problemModel = mongoose.model("problem", problemSchema);
export default problemModel;

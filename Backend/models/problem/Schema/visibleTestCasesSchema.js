import mongoose from "mongoose";
const { Schema } = mongoose;
/**
 * @fileoverview Defines the Mongoose schema for visible test cases of a coding problem.
 *
 * @module models/schemas/visibleCaseSchema
 * @description
 * This module defines the `visibleCaseSchema`, which stores individual test cases that are visible
 * to users for a problem. Each test case can have an input string, optional description, and optional image URL.
 * It is typically embedded within a parent schema like `Problem`.
 *
 * * **Schema Fields:**
 * - **`testCase`**: The actual input string for the test case. (String, required, min length 1, max length 200)
 * - **`description`**: Optional textual explanation for the test case. (String, max length 3000, default: "")
 * - **`imgUrl`**: Optional image URL illustrating the test case. Must be a valid URL ending with an image extension (png, jpg, jpeg, gif, svg). (String, default: "")
 *
 * * **Dependencies:**
 * - `mongoose`: For schema definition.
 *
 * * **Output Format:**
 * @returns {mongoose.Schema} An uncompiled Mongoose Schema object named `visibleCaseSchema`.
 *
 * * **Usage Example:**
 * ```js
 * import visibleCaseSchema from './visibleCaseSchema.js';
 * // Used inside a parent schema:
 * const ProblemSchema = new Schema({
 *   title: { type: String, required: true },
 *   visibleTestCases: [visibleCaseSchema]
 * });
 * ```
 */
const visibleCaseSchema = new Schema({
  testCase: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 200,
  },
  output : {
    type : String ,
    required : true , 
    trim : true , 
    minlength : 1, 
    maxlength : 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 3000, 
    default: "",
  },
  imgUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true; // allow empty
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i.test(v);
      },
      message: props => `${props.value} is not a valid image URL!`,
    },
    default: "",
  },
});

export default visibleCaseSchema;
/**
 * @fileoverview Defines the Mongoose schema for problem descriptions, including text and optional image URLs.
 *
 * @module models/schemas/descriptionSchema
 * @description
 * This module defines the `descriptionSchema`, which stores the textual description of a coding problem
 * and an optional image illustrating the problem. Each description document is typically embedded in a parent
 * schema like `Problem`.
 *
 * * **Schema Fields:**
 * - **`text`**: The main textual description of the problem. (String, required, max length 5000)
 * - **`imgUrl`**: Optional URL to an image related to the problem. (String, optional)
 *
 * * **Dependencies:**
 * - `mongoose`: For schema definition.
 *
 * * **Output Format:**
 * @returns {mongoose.Schema} An uncompiled Mongoose Schema object named `descriptionSchema`.
 *
 * * **Usage Example:**
 * ```js
 * import descriptionSchema from './descriptionSchema.js';
 * // Used inside a parent schema:
 * const ProblemSchema = new Schema({
 *   title: { type: String, required: true },
 *   description: descriptionSchema
 * });
 * ```
 */
import mongoose from "mongoose";
const {Schema} = mongoose

const descriptionSchema = Schema({
    text : {
        type : String ,
        required : true , 
        maxLenghth : 5000
    }, 
    imgUrl : {
        type : String , 
    }
})

export default descriptionSchema 
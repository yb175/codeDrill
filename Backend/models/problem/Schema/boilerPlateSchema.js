/**
 * @fileoverview Defines the Mongoose schema for boilerplate code templates in multiple programming languages.
 *
 * @module models/schemas/boilerPlateSchema
 * @description
 * This module defines the `boilerPlateSchema`, which stores boilerplate code templates for different languages.
 * Each boilerplate document is typically embedded in a parent schema (like a Problem) to provide starter code
 * for users to write their solutions in the specified programming language.
 *
 * * **Schema Fields:**
 * - **`language`**: The programming language of the boilerplate. (String, required, trimmed, max length 100)
 * - **`snippet`**: The code snippet provided as boilerplate. (String, required, trimmed, max length 500)
 *
 * * **Dependencies:**
 * - `mongoose`: For schema definition.
 *
 * * **Output Format:**
 * @returns {mongoose.Schema} An uncompiled Mongoose Schema object named `boilerPlateSchema`.
 *
 * * **Usage Example:**
 * ```js
 * import boilerPlateSchema from './boilerPlateSchema.js';
 * // Used inside a parent schema:
 * const ProblemSchema = new Schema({
 *   title: { type: String, required: true },
 *   boilerplate: [boilerPlateSchema]
 * });
 * ```
 */
import mongoose from "mongoose";
const { Schema } = mongoose;
const boilerPlateSchema = new Schema({
  language: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100, 
  },
  snippet: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000, 
  },
});

export default boilerPlateSchema;
 
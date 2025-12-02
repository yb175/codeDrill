/**
 * @fileoverview Defines the schema for storing a universal function signature
 * for a coding problem (LeetCode-style).
 *
 * This schema DOES NOT store language-specific boilerplate code.
 * Instead, it stores a *universal*, language-agnostic signature such as:
 *
 *  {
 *    "functionName": "maxDepth",
 *    "returnType": "int",
 *    "inputs": [
 *      { "name": "root", "type": "TreeNode" }
 *    ]
 *  }
 *
 * Each language (C++, Python, Java, JS) later maps this universal signature
 * into its own syntax using a "type-mapper".
 *
 * Why is this schema better?
 * ---------------------------
 * ✔ No code duplication
 * ✔ Easily generate boilerplate for ANY language
 * ✔ LeetCode-style unified runner system
 * ✔ Supports complex types (TreeNode, ListNode, int[], string[], etc.)
 *
 * Schema Fields:
 * ---------------
 * - functionSignature.functionName : String  
 *      The method name the user must implement.
 *
 * - functionSignature.returnType : String  
 *      Logical/universal type (NOT language dependent):
 *      Examples: "int", "string", "int[]", "TreeNode", "ListNode"
 *
 * - functionSignature.inputs[] : Array  
 *      List of parameters the function receives.
 *      Each param has:
 *        - name:  variable name (e.g., "root", "nums")
 *        - type:  universal type (same type rules as returnType)
 *
 * @module models/schemas/boilerPlateSchema
 */

import mongoose from "mongoose";
const { Schema } = mongoose;
const boilerPlateSchema = new Schema({
  functionSignature: {
    functionName: { type: String, required: true },
    returnType: { type: String, required: true },
    inputs: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
      }
    ],
  },
});

export default boilerPlateSchema

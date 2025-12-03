import problemModel from "../../models/problem/problemSchema.js";
import {
  cpp_boilerplate_template,
  java_template,
  python_boilerplate_template,
  js_boilerplate_template
} from "../../boilerplateTemplate/boilerplate.js";

/**
 * ============================================================
 * 🧠 FUNCTION: getAllProblem
 * ============================================================
 * @description Fetch paginated list of problems.
 *
 * @route GET /problems?page=1&limit=10
 *
 * @returns JSON:
 * {
 *   success: true,
 *   pageNumber: 1,
 *   count: 50,
 *   totalPages: 5,
 *   data: [
 *     {
 *       "title": "Two Sum",
 *       "problemNumber": 1,
 *       "problemTags": [...],
 *       "companyTags": [...],
 *       "difficulty": "easy"
 *     }
 *   ]
 * }
 */
export async function getAllProblem(req, res) {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const problems = await problemModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select("title problemNumber problemTags companyTags difficulty");

    const total = await problemModel.countDocuments();

    return res.status(200).json({
      success: true,
      pageNumber: page,
      count: total,
      totalPages: Math.ceil(total / limit),
      data: problems,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 * ============================================================
 * 🧠 FUNCTION: getProblembyId
 * ============================================================
 * @description Fetch a full problem by its problemNumber and
 *              auto-generate language boilerplate template
 *              from functionSignature stored in DB.
 *
 * @route GET /problems/:id
 *
 * @returns JSON (same format as before):
 * {
 *   "success": true,
 *   "data": {
 *     "title": "...",
 *     "problemNumber": 1,
 *     "description": {...},
 *     "problemTags": [...],
 *     "companyTags": [...],
 *     "hints": [...],
 *     "acceptanceRate": 80,
 *     "visibleTestCases": [...],
 *     "hiddentestCases": [...],
 *     "boilerplate": [
 *        { "language": "cpp", "snippet": "class Solution {...}" },
 *        { "language": "py",  "snippet": "class Solution: ..." }
 *     ],
 *     "refrenceSol": [...],
 *     "difficulty": "easy"
 *   }
 * }
 */
export async function getProblembyId(req, res) {
  try {
    const id = req.params.id;

    const problem = await problemModel
      .findOne({ problemNumber: id })
      .lean()
      .select(
        "title problemNumber description problemTags companyTags hints acceptanceRate visibleTestCases hiddentestCases boilerplate difficulty refrenceSol"
      );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "problem not found",
      });
    }

    // ------------------------------------------------
    // 🔥 Extract universal signature (ONE object)
    // ------------------------------------------------
    const sig = problem.boilerplate?.functionSignature;

    if (!sig) {
      return res.status(500).json({
        success: false,
        message: "Function signature missing in DB",
      });
    }

    // ------------------------------------------------
    // 🔥 Auto-generate for all supported languages
    // ------------------------------------------------
    const generated = [
      {
        language: "cpp",
        snippet: cpp_boilerplate_template(sig.functionName, sig.returnType, sig.inputs),
      },
      {
        language: "java",
        snippet: java_template(sig.functionName, sig.returnType, sig.inputs),
      },
      {
        language: "python",
        snippet: python_boilerplate_template(sig.functionName, sig.returnType, sig.inputs),
      },
      {
        language: "javascript",
        snippet: js_boilerplate_template(sig.functionName, sig.returnType, sig.inputs),
      }
    ];

    // overwrite boilerplate with newly generated array
    problem.boilerplate = generated;
    problem.functionSignature = sig ; 
    return res.status(200).json({
      success: true,
      data: problem,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

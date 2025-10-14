import problemModel from "../../models/problem/problemSchema.js";
import validateProblem from "../../utils/problem/problemValidation.js";
async function editProblem(req, res) {
  try {
    const edited = req.body;
    if (!edited)
      res.status(404).send({
        success: false,
        message: "No fields were provided for editing",
      });
    if (!edited.problemNumber) {
      res.status(404).send({
        success: false,
        message: "No problem number provided",
      });
    }
    let {
      problemTags,
      comapnyTags,
      visibleTestCases,
      hiddentestCases,
      refrenceSol,
      problemNumber,
    } = edited;
    const tobeUpdated = [
      "problemTags",
      "companyTags",
      "visibleTestCases",
      "hiddentestCases",
      "refrenceSol",
    ];
    const canUpdate = tobeUpdated.find(
      (fields) => edited[fields] !== undefined
    );
    if (!canUpdate) {
      res.status(400).send({
        success: false,
        message: "Invalid fields",
      });
    }
    // DB call
    const problem = await problemModel.findOne({ problemNumber });

    if (visibleTestCases || hiddentestCases || refrenceSol) {
      const testCases = [
        ...(visibleTestCases || []),
        ...(hiddentestCases || []),
      ];
      refrenceSol = refrenceSol || problem.refrenceSol;
      const result = await validateProblem({ refrenceSol, testCases });
      if (result.success == false) {
        res.status(200).send(result);
      }
    }
    problem.companyTags = Array.from(
      new Set([...(comapnyTags || []), ...(problem.companyTags || [])])
    );
    problem.problemTags = Array.from(
      new Set([...(problemTags || []), ...(problem.problemTags || [])])
    );
    if (visibleTestCases) problem.visibleTestCases = Array.from(new Set([...visibleTestCases,...(problem.visibleTestCases || [])]));
    if (hiddentestCases) problem.hiddentestCases = Array.from(new Set([...hiddentestCases,...(problem.hiddentestCases || [])]));
    if (refrenceSol) problem.refrenceSol = refrenceSol;
    await problem.save();
    res.status(200).send({
      success: true,
      message: `problem statement ${problemNumber} updated successfully`,
      data: problem,
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
}

export default editProblem;

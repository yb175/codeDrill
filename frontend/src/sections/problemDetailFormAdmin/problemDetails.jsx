// src/components/ProblemDetails.jsx
import { X } from "lucide-react";
import AccordionItem from "../../assets/AccordationItem";
import { useDispatch, useSelector } from "react-redux";
import { updateProblemData, removeFromArray } from "../../slice/problemSlice";

export default function ProblemDetails() {
  const dispatch = useDispatch();

  const { title, difficulty, problemTags = [], companyTags = [] } =
    useSelector((state) => state.problem.addProblemData);

  const updateField = (key, value) => {
    dispatch(updateProblemData({ key, value }));
  };

  // Add tag safely (without isNew flag)
  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newTag = e.target.value.trim();
      if (!problemTags.includes(newTag)) {
        dispatch(
          updateProblemData({
            key: "problemTags",
            value: [...problemTags, newTag],
          })
        );
      }
      e.target.value = "";
    }
  };

  // Add company tag safely
  const handleAddCompany = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newCompany = e.target.value.trim();
      if (!companyTags.includes(newCompany)) {
        dispatch(
          updateProblemData({
            key: "companyTags",
            value: [...companyTags, newCompany],
          })
        );
      }
      e.target.value = "";
    }
  };

  const removeTag = (tag) => {
    const updated = problemTags.filter((t) => t !== tag);
    dispatch(updateProblemData({ key: "problemTags", value: updated }));
  };

  const removeCompany = (company) => {
    const updated = companyTags.filter((c) => c !== company);
    dispatch(updateProblemData({ key: "companyTags", value: updated }));
  };

  return (
    <AccordionItem title="Problem Details" defaultOpen={true}>
      <div className="space-y-6">

        {/* Problem Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Problem Title
          </label>
          <input
            type="text"
            placeholder="e.g., Two Sum"
            value={title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-base-100/30 
              border border-neutral-700/50 focus:border-primary/50 outline-none"
          />
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Difficulty
          </label>
          <select
            value={difficulty || "easy"}
            onChange={(e) => updateField("difficulty", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-base-100/30 
              border border-neutral-700/50 focus:border-primary/50 outline-none"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Problem Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Problem Tags
          </label>

          <div className="w-full min-h-[48px] rounded-lg bg-base-100/20 
              border border-neutral-700/40 px-3 py-2 flex flex-wrap gap-2 items-center">

            {problemTags.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md 
                  text-sm bg-primary/15 text-primary border border-primary/30"
              >
                {String(tag)}
                <X
                  size={14}
                  className="cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => removeTag(tag)}
                />
              </span>
            ))}

            <input
              type="text"
              placeholder="Add tag…"
              className="flex-grow min-w-[100px] bg-transparent focus:outline-none text-sm"
              onKeyDown={handleAddTag}
            />
          </div>
        </div>

        {/* Company Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Company Tags
          </label>

          <div className="w-full min-h-[48px] rounded-lg bg-base-100/20 
              border border-neutral-700/40 px-3 py-2 flex flex-wrap gap-2 items-center">

            {companyTags.map((c, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md 
                  text-sm bg-blue-600/15 text-blue-400 border border-blue-500/30"
              >
                {String(c)}
                <X
                  size={14}
                  className="cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => removeCompany(c)}
                />
              </span>
            ))}

            <input
              type="text"
              placeholder="Add company…"
              className="flex-grow min-w-[100px] bg-transparent focus:outline-none text-sm"
              onKeyDown={handleAddCompany}
            />
          </div>
        </div>
      </div>
    </AccordionItem>
  );
}

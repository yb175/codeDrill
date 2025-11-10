// src/components/ProblemDetails.jsx
import { useState } from "react";
import { X } from "lucide-react";
import AccordionItem from "../../assets/AccordationItem";

export default function ProblemDetails() {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");

  const [tags, setTags] = useState(["Array", "Hash Table"]);
  const [companies, setCompanies] = useState(["Google", "Meta"]);

  const [tagInput, setTagInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");

  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const addCompanyTag = (e) => {
    if (e.key === "Enter" && companyInput.trim() !== "") {
      if (!companies.includes(companyInput.trim())) {
        setCompanies([...companies, companyInput.trim()]);
      }
      setCompanyInput("");
    }
  };

  const removeTag = (t) => setTags(tags.filter((i) => i !== t));
  const removeCompany = (c) => setCompanies(companies.filter((i) => i !== c));

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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-base-100/30 border border-neutral-700/50 
                     focus:border-primary/50 outline-none transition placeholder:text-neutral-500"
          />
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-base-100/30 border border-neutral-700/50 
                     focus:border-primary/50 outline-none transition"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {/* Problem Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Problem Tags
          </label>

          <div
            className="w-full min-h-[48px] rounded-lg bg-base-100/20 border border-neutral-700/40 
                        px-3 py-2 flex flex-wrap gap-2 items-center"
          >
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-sm
                         bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition"
              >
                {tag}
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
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
            />
          </div>
        </div>

        {/* Company Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Company Tags
          </label>

          <div
            className="w-full min-h-[48px] rounded-lg bg-base-100/20 border border-neutral-700/40 
                        px-3 py-2 flex flex-wrap gap-2 items-center"
          >
            {companies.map((c, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-sm
                         bg-blue-600/15 text-blue-400 border border-blue-500/30 hover:bg-blue-600/25 transition"
              >
                {c}
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
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              onKeyDown={addCompanyTag}
            />
          </div>
        </div>
      </div>
    </AccordionItem>
  );
}

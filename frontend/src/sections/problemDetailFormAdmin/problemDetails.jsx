// src/components/ProblemDetails.jsx
import React from "react";
import { 
  X, 
  Hash, 
  Tag, 
  Building2, 
  BarChart2, 
  Type 
} from "lucide-react";
import AccordionItem from "../../assets/AccordationItem";
import { useDispatch, useSelector } from "react-redux";
import { updateProblemData } from "../../slice/problemSlice";
import { motion, AnimatePresence } from "framer-motion";

export default function ProblemDetails() {
  const dispatch = useDispatch();

  const { title, difficulty, problemTags = [], companyTags = [] } =
    useSelector((state) => state.problem.addProblemData);

  const updateField = (key, value) => {
    dispatch(updateProblemData({ key, value }));
  };

  // --- HANDLERS ---
  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newTag = e.target.value.trim();
      if (!problemTags.includes(newTag)) {
        dispatch(updateProblemData({ key: "problemTags", value: [...problemTags, newTag] }));
      }
      e.target.value = "";
    }
  };

  const handleAddCompany = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newCompany = e.target.value.trim();
      if (!companyTags.includes(newCompany)) {
        dispatch(updateProblemData({ key: "companyTags", value: [...companyTags, newCompany] }));
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

  // --- DIFFICULTY OPTIONS ---
  const difficulties = [
    { value: "easy", label: "Easy", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { value: "medium", label: "Medium", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { value: "hard", label: "Hard", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  ];

  return (
    <AccordionItem title="Problem Details" defaultOpen={true}>
      <div className="space-y-6 p-1">

        {/* 1. TITLE INPUT */}
        <div className="space-y-2 group">
          <label className="text-[10px] uppercase tracking-widest font-mono text-slate-500 flex items-center gap-2 group-focus-within:text-blue-400 transition-colors">
            <Type size={12} /> Problem Title
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="e.g. Reverse Linked List"
              value={title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0a0a0c] 
                border border-white/10 text-slate-200 text-sm
                focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20
                placeholder:text-slate-600 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* 2. DIFFICULTY SELECTOR (SEGMENTED CONTROL) */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-mono text-slate-500 flex items-center gap-2">
            <BarChart2 size={12} /> Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-3 p-1 rounded-xl bg-[#0a0a0c] border border-white/10">
            {difficulties.map((diff) => {
              const isActive = (difficulty || "easy") === diff.value;
              return (
                <button
                  key={diff.value}
                  onClick={() => updateField("difficulty", diff.value)}
                  className={`
                    relative py-2.5 text-xs font-medium rounded-lg transition-all duration-300 border
                    ${isActive 
                      ? `${diff.bg} ${diff.color} ${diff.border} shadow-[0_0_15px_rgba(0,0,0,0.2)]` 
                      : "bg-transparent text-slate-500 border-transparent hover:bg-white/5 hover:text-slate-300"
                    }
                  `}
                >
                  {diff.label}
                  {isActive && (
                    <span className={`absolute inset-0 rounded-lg ring-1 ring-inset ${diff.border.replace('border', 'ring')} opacity-50`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. PROBLEM TAGS */}
        <div className="space-y-2 group">
          <label className="text-[10px] uppercase tracking-widest font-mono text-slate-500 flex items-center gap-2 group-focus-within:text-blue-400 transition-colors">
            <Tag size={12} /> Topic Tags
          </label>

          <div className="w-full min-h-[52px] rounded-xl bg-[#0a0a0c] border border-white/10 p-2 flex flex-wrap gap-2 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all shadow-inner">
            <AnimatePresence>
              {problemTags.map((tag, idx) => (
                <motion.span
                  key={tag + idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                  className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
                >
                  {tag}
                  <button 
                    onClick={() => removeTag(tag)}
                    className="p-0.5 hover:bg-blue-500/20 rounded-md transition-colors"
                  >
                    <X size={12} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>

            <input
              type="text"
              placeholder="+ Add Tag (Enter)"
              className="flex-grow min-w-[120px] bg-transparent p-1 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none"
              onKeyDown={handleAddTag}
            />
          </div>
        </div>

        {/* 4. COMPANY TAGS */}
        <div className="space-y-2 group">
          <label className="text-[10px] uppercase tracking-widest font-mono text-slate-500 flex items-center gap-2 group-focus-within:text-purple-400 transition-colors">
            <Building2 size={12} /> Companies
          </label>

          <div className="w-full min-h-[52px] rounded-xl bg-[#0a0a0c] border border-white/10 p-2 flex flex-wrap gap-2 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all shadow-inner">
            <AnimatePresence>
              {companyTags.map((c, idx) => (
                <motion.span
                  key={c + idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                  className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
                >
                  {c}
                  <button 
                    onClick={() => removeCompany(c)}
                    className="p-0.5 hover:bg-purple-500/20 rounded-md transition-colors"
                  >
                    <X size={12} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>

            <input
              type="text"
              placeholder="+ Add Company (Enter)"
              className="flex-grow min-w-[120px] bg-transparent p-1 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none"
              onKeyDown={handleAddCompany}
            />
          </div>
        </div>

      </div>
    </AccordionItem>
  );
}
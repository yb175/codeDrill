import React from "react";
import { motion } from "framer-motion";
import AccordionItem from "../../assets/AccordationItem";
import { Terminal, ArrowRight, Lightbulb, Sparkles } from "lucide-react";

// --- ULTRA-CLEAN FORMATTER ---
const formatValue = (val) => {
  if (!val) return "null";

  // 1. Try to parse if it's a stringified JSON (removes "\n", "\", "{")
  if (typeof val === "string") {
    try {
      // If it looks like an object or array, parse it
      if (val.trim().startsWith("{") || val.trim().startsWith("[")) {
        const parsed = JSON.parse(val);
        return formatValue(parsed); // Recursively format the parsed object
      }
      // If it's just a regular string, remove raw quote marks if present
      return val.replace(/^"|"$/g, '');
    } catch (e) {
      // If parsing fails, return as is but clean up newlines
      return val;
    }
  }

  // 2. Handle Arrays: [1, 2, 3]
  if (Array.isArray(val)) {
    return `[${val.map(v => JSON.stringify(v)).join(", ")}]`;
  }

  // 3. Handle Objects: root = [...], target = 5
  if (typeof val === "object") {
    return Object.entries(val)
      .map(([k, v]) => {
        // Recursively clean the value
        const cleanV = Array.isArray(v) ? JSON.stringify(v) : JSON.stringify(v);
        return `${k} = ${cleanV}`;
      })
      .join(",  ");
  }

  // 4. Primitives (numbers, booleans)
  return JSON.stringify(val);
};

export default function DescriptionView({ description, visibleTestCases = [], hints = [] }) {
  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-purple-500/30">

      {/* ---------- PROBLEM DESCRIPTION ---------- */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-invert max-w-none"
      >
        <div className="text-[16px] leading-7 text-gray-300 font-light tracking-wide whitespace-pre-line">
          {description?.text}
        </div>
      </motion.div>

      {/* ---------- EXAMPLES SECTION ---------- */}
      <AccordionItem title="Examples" defaultOpen={true}>
        <div className="flex flex-col gap-6 mt-4">
          {visibleTestCases.map((test, index) => {
            // Apply the new cleaner to both Input and Output
            const inputStr = formatValue(test.testCase || test.input);
            const outputStr = formatValue(test.output);
            const explanation = test.description || test.explanation;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#1e1e2e]/50 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:bg-[#1e1e2e]/80"
              >
                {/* Decorative Gradient Bar on Hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="p-5">
                  <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[10px] text-white">
                      {index + 1}
                    </span>
                    Example Case
                  </h3>

                  {/* Input / Output Grid */}
                  <div className="space-y-3">
                    
                    {/* INPUT ROW */}
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start">
                      <span className="flex w-24 shrink-0 items-center gap-2 pt-2 font-mono text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Terminal size={12} className="text-purple-400" />
                        Input
                      </span>
                      <code className="flex-1 rounded-lg bg-[#000000]/40 border border-white/5 px-4 py-2 font-mono text-[13px] text-purple-200 shadow-inner break-words leading-6">
                        {inputStr}
                      </code>
                    </div>

                    {/* OUTPUT ROW */}
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start">
                      <span className="flex w-24 shrink-0 items-center gap-2 pt-2 font-mono text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <ArrowRight size={12} className="text-green-400" />
                        Output
                      </span>
                      <code className="flex-1 rounded-lg bg-[#000000]/40 border border-white/5 px-4 py-2 font-mono text-[13px] text-green-300 shadow-inner break-words leading-6">
                        {outputStr}
                      </code>
                    </div>

                  </div>

                  {/* Explanation Block */}
                  {explanation && (
                    <div className="mt-4 flex gap-3 rounded-lg border border-yellow-500/10 bg-yellow-500/5 p-3 text-sm text-gray-400">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                      <p className="leading-relaxed opacity-90">{explanation}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </AccordionItem>

      {/* ---------- HINTS SECTION ---------- */}
      <AccordionItem title="Hints">
        <div className="mt-2 space-y-3">
          {hints.length === 0 ? (
            <p className="text-sm italic text-gray-600 pl-2">No hints available.</p>
          ) : (
            hints.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 rounded-lg border border-transparent hover:bg-white/5 p-2 transition-colors"
              >
                <Lightbulb size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed text-gray-300">{h}</p>
              </motion.div>
            ))
          )}
        </div>
      </AccordionItem>

    </div>
  );
}
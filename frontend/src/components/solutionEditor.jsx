import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { useDispatch, useSelector } from "react-redux";
import AccordionItem from "../assets/AccordationItem";
import { addToArray, updateArrayItem } from "../slice/problemSlice";
import { ChevronDown, ChevronRight, Code2 } from "lucide-react";

export default function SolutionEditor() {
  const dispatch = useDispatch();

  const refrenceSol =
    useSelector((state) => state.problem.addProblemData.refrenceSol) || [];

  const languages = [
    { label: "Python3", key: "python", ext: python },
    { label: "JavaScript", key: "javascript", ext: javascript },
    { label: "C++", key: "c++", ext: cpp },
  ];

  const [openLang, setOpenLang] = React.useState("python");

  const getDefaultSnippet = (lang) => {
    const existing = refrenceSol.find((r) => r.language === lang);
    if (existing) return existing.snippet;

    switch (lang) {
      case "python":
        return `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your solution here`;
      case "javascript":
        return `function twoSum(nums, target) {\n  // Write your solution here\n}`;
      case "c++":
        return `#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n}\n\nint main(){\n    return 0;\n}`;
      default:
        return "";
    }
  };

  // NEW: Universal solution handler
  const handleChange = (lang, value) => {
    const existingIndex = refrenceSol.findIndex((r) => r.language === lang);

    if (existingIndex !== -1) {
      // Update existing solution
      dispatch(updateArrayItem({
        arrayKey: "refrenceSol",
        index: existingIndex,
        updates: { snippet: value }
      }));
    } else {
      // Add new solution
      dispatch(addToArray({
        arrayKey: "refrenceSol",
        item: { language: lang, snippet: value }
      }));
    }
  };

  return (
    <AccordionItem title="Reference Solution" defaultOpen={true}>
      <div className="space-y-3">
        {languages.map((lang) => {
          const isOpen = openLang === lang.key;
          return (
            <div
              key={lang.key}
              className={`rounded-xl border border-neutral-700/50 bg-base-100/20 backdrop-blur-md transition-all ${
                isOpen ? "shadow-md" : "opacity-80 hover:opacity-100"
              }`}
            >
              {/* Header Row */}
              <button
                onClick={() =>
                  setOpenLang(isOpen ? null : lang.key)
                }
                className="flex w-full items-center justify-between px-4 py-3 text-neutral-200 font-medium text-sm"
              >
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <span>{lang.label}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                )}
              </button>

              {/* Editor (collapsible body) */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? "max-h-[400px]" : "max-h-0"
                }`}
              >
                {isOpen && (
                  <div className="p-3 pt-0 border-t border-neutral-700/40">
                    <div className="rounded-lg overflow-hidden border border-neutral-700/50">
                      <CodeMirror
                        value={getDefaultSnippet(lang.key)}
                        height="250px"
                        theme={dracula}
                        extensions={[lang.ext()]}
                        onChange={(value) => handleChange(lang.key, value)}
                        className="text-sm font-mono"
                        basicSetup={{
                          lineNumbers: true,
                          highlightActiveLine: true,
                          highlightActiveLineGutter: true,
                          indentOnInput: true,
                          bracketMatching: true,
                          closeBrackets: true,
                          autocompletion: true,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AccordionItem>
  );
}
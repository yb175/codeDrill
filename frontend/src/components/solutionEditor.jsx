import React, { useEffect, useState } from "react";
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

  const [openLang, setOpenLang] = useState("python");

  // Local state for editor values
  const [localSnippets, setLocalSnippets] = useState({});

  const getDefaultSnippet = (lang) => {
    const existing = refrenceSol.find((s) => s.language === lang);
    if (existing) return existing.snippet;

    switch (lang) {
      case "python":
        return `class Solution:\n    def solve(self):\n        pass`;
      case "javascript":
        return `function solve() {\n  \n}`;
      case "c++":
        return `#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n  \n}\n\nint main(){ return 0; }`;
      default:
        return "";
    }
  };

  // Hydrate local state from Redux on edit page load
  useEffect(() => {
    const initialState = {};
    languages.forEach((lang) => {
      initialState[lang.key] = getDefaultSnippet(lang.key);
    });
    setLocalSnippets(initialState);
  }, []);

  const handleChange = (lang, value) => {
    setLocalSnippets((prev) => ({ ...prev, [lang]: value }));

    const index = refrenceSol.findIndex((s) => s.language === lang);

    if (index !== -1) {
      dispatch(
        updateArrayItem({
          arrayKey: "refrenceSol",
          index,
          updates: { snippet: value },
        })
      );
    } else {
      dispatch(
        addToArray({
          arrayKey: "refrenceSol",
          item: { language: lang, snippet: value },
        })
      );
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
              <button
                onClick={() => setOpenLang(isOpen ? null : lang.key)}
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

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? "max-h-[400px]" : "max-h-0"
                }`}
              >
                {isOpen && (
                  <div className="p-3 pt-0 border-t border-neutral-700/40">
                    <div className="rounded-lg overflow-hidden border border-neutral-700/50">
                      <CodeMirror
                        value={localSnippets[lang.key] || ""}
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

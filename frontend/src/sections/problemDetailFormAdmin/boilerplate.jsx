import React, { useEffect, useState } from "react";
import AccordionItem from "../../assets/AccordationItem";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { Upload, Code2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToArray, updateArrayItem } from "../../slice/problemSlice";

export default function BoilerplateSection() {
  const dispatch = useDispatch();

  const boilerplateArray =
    useSelector((state) => state.problem.addProblemData.boilerplate) || [];

  const languages = [
    { label: "JavaScript", key: "javascript", ext: javascript },
    { label: "Python", key: "python", ext: python },
    { label: "C++", key: "c++", ext: cpp },
  ];

  const [localSnippets, setLocalSnippets] = useState({});

  const getDefaultBoilerplate = (lang) => {
    const existing = boilerplateArray.find((b) => b.language === lang);
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

  // Hydrate local state when editing OR on first load
  useEffect(() => {
    const init = {};
    languages.forEach((lang) => {
      init[lang.key] = getDefaultBoilerplate(lang.key);
    });
    setLocalSnippets(init);
  }, [boilerplateArray]);

  const handleChange = (lang, value) => {
    setLocalSnippets((prev) => ({ ...prev, [lang]: value }));

    const index = boilerplateArray.findIndex((b) => b.language === lang);

    if (index !== -1) {
      dispatch(
        updateArrayItem({
          arrayKey: "boilerplate",
          index,
          updates: { snippet: value },
        })
      );
    } else {
      dispatch(
        addToArray({
          arrayKey: "boilerplate",
          item: { language: lang, snippet: value },
        })
      );
    }
  };

  const handleFileUpload = (lang, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;

      setLocalSnippets((prev) => ({ ...prev, [lang]: content }));

      const index = boilerplateArray.findIndex((b) => b.language === lang);

      if (index !== -1) {
        dispatch(
          updateArrayItem({
            arrayKey: "boilerplate",
            index,
            updates: { snippet: content },
          })
        );
      } else {
        dispatch(
          addToArray({
            arrayKey: "boilerplate",
            item: { language: lang, snippet: content },
          })
        );
      }
    };

    reader.readAsText(file);
  };

  return (
    <AccordionItem title="Boilerplate Code" defaultOpen={true}>
      <div className="space-y-6">
        {languages.map((lang) => (
          <AccordionItem
            key={lang.key}
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  <span className="text-neutral-200 font-semibold text-base">
                    {lang.label}
                  </span>
                </div>

                <label className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 cursor-pointer transition">
                  <Upload size={14} />
                  Upload
                  <input
                    type="file"
                    accept=".txt,.py,.js,.cpp,.c,.cc,.cxx"
                    className="hidden"
                    onChange={(e) => handleFileUpload(lang.key, e)}
                  />
                </label>
              </div>
            }
          >
            <div className="rounded-xl overflow-hidden border border-neutral-700/50 shadow-md hover:border-blue-500/40 transition-all">
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
          </AccordionItem>
        ))}
      </div>
    </AccordionItem>
  );
}

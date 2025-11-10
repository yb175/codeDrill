import React, { useState } from "react";
import AccordionItem from "../../assets/AccordationItem";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { Upload, Code2 } from "lucide-react";

export default function BoilerplateSection() {
  const languages = [
    { label: "JavaScript", key: "javascript", ext: javascript },
    { label: "Python", key: "python", ext: python },
  ];

  const [boilerplates, setBoilerplates] = useState({
    javascript: `function solve() {\n  // write your JavaScript solution here\n}`,
    python: `class Solution:\n    def solve(self):\n        # write your Python solution here\n        pass`,
  });

  const handleChange = (lang, value) => {
    setBoilerplates({ ...boilerplates, [lang]: value });
  };

  const handleFileUpload = (lang, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBoilerplates({ ...boilerplates, [lang]: event.target.result });
      };
      reader.readAsText(file);
    }
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
                    accept=".txt,.py,.js"
                    className="hidden"
                    onChange={(e) => handleFileUpload(lang.key, e)}
                  />
                </label>
              </div>
            }
          >
            <div className="rounded-xl overflow-hidden border border-neutral-700/50 shadow-md hover:border-blue-500/40 transition-all">
              <CodeMirror
                value={boilerplates[lang.key]}
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
                }}
              />
            </div>
          </AccordionItem>
        ))}
      </div>
    </AccordionItem>
  );
}

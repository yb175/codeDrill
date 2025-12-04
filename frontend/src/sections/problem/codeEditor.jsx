import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";

function CodeEditor({ code, language = "python", onChange }) {
  // Default to empty string if code is null/undefined to ensure editor always renders
  const [value, setValue] = useState(code || "");

  useEffect(() => {
    setValue(code || "");
  }, [code]);

  const getExtensions = () => {
    switch (language.toLowerCase()) {
      case "python": return [python()];
      case "javascript": return [javascript({ jsx: true })];
      case "cpp": return [cpp()];
      default: return [python()];
    }
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-[#282a36]">
      <div className="absolute inset-0 overflow-auto custom-scrollbar">
        <CodeMirror
          value={value}
          theme={dracula}
          height="100%"
          extensions={getExtensions()}
          onChange={(val) => {
            setValue(val);
            if (onChange) onChange(val);
          }}
          className="text-[14px]"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            tabSize: 2,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
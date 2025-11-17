import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";

function CodeEditor({ code, language = "python" }) {
  const [value, setValue] = useState(code);

  const getExtensions = () => {
    switch (language.toLowerCase()) {
      case "python":
      case "python3":
        return [python()];
      case "javascript":
      case "js":
        return [javascript({ jsx: true })];
      case "cpp":
      case "c++":
        return [cpp()];
      default:
        return [python()];
    }
  };

  return (
    <div className="flex-1 bg-[#0f0f0f] border-l border-gray-800 flex flex-col items-center overflow-hidden">
      {/* Scroll inside editor only */}
      <div className="flex-1 w-full flex justify-center py-2 overflow-hidden">
        <div className="w-full max-w-[820px] rounded-md overflow-hidden h-full">
          <CodeMirror
            value={value}
            theme={dracula}
            height="100%"
            extensions={getExtensions()}
            onChange={(val) => setValue(val)}
            className="h-full text-sm"
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: true,
              highlightActiveLineGutter: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
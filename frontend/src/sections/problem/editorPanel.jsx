import React from "react";
import EditorHeader from "./editorHeader";
import CodeEditor from "./codeEditor";
import ResultsPanel from "./resultsPanel";

export default function EditorPanel({ defaultCode, language }) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <EditorHeader language={language} />
      <CodeEditor code={defaultCode} />
      <ResultsPanel />
    </div>
  );
}

import React, { useState, useEffect, useMemo } from "react";
import EditorHeader from "./editorHeader";
import CodeEditor from "./codeEditor";
import ResultsPanel from "./resultsPanel";

export default function EditorPanel({ boilerplates }) {
  // 1. Determine the default language from the first available boilerplate (or fallback to python)
  const defaultLang = boilerplates?.[0]?.language?.toLowerCase() || "python";
  
  // 2. State for the currently selected language
  const [language, setLanguage] = useState(defaultLang);

  // 3. Find the code snippet for the active language
  // We use useMemo so it recalculates only when language or boilerplates change
  const activeCode = useMemo(() => {
    const match = boilerplates?.find((b) => {
      const lang = b.language.toLowerCase();
      // specific checks to handle backend vs frontend naming (e.g., "c++" vs "cpp")
      if (language === "cpp") return lang === "cpp" || lang === "c++";
      if (language === "javascript") return lang === "javascript" || lang === "js";
      return lang === language;
    });
    return match?.snippet || "";
  }, [language, boilerplates]);

  // Sync state if boilerplates load late (async data pattern)
  useEffect(() => {
    if (boilerplates.length > 0 && !boilerplates.find(b => b.language === language)) {
        setLanguage(boilerplates[0].language.toLowerCase());
    }
  }, [boilerplates]);

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] overflow-hidden">
      {/* 1. Top Header */}
      <div className="flex-none h-10 bg-[#1e1e1e] border-b border-[#333]">
        <EditorHeader language={language} setLanguage={setLanguage} />
      </div>

      {/* 2. Code Area - Now receives the DYNAMIC activeCode */}
      <div className="flex-1 min-h-0 relative">
        <CodeEditor code={activeCode} language={language} />
      </div>

      {/* 3. Bottom Panel */}
      <div className="flex-none h-[40%] bg-[#1e1e1e] border-t border-[#333]">
        <ResultsPanel />
      </div>
    </div>
  );
}
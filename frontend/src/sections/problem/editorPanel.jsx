import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditorHeader from "./editorHeader";
import CodeEditor from "./codeEditor";
import ResultsPanel from "./resultsPanel";
import { runProblem } from "../../slice/problemSlice";

export default function EditorPanel({ boilerplates, problem }) {
  const dispatch = useDispatch();
  const { runResult, loading } = useSelector((state) => state.problem);

  const defaultLang = boilerplates?.[0]?.language?.toLowerCase() || "python";
  const [language, setLanguage] = useState(defaultLang);
  const [code, setCode] = useState("");

  const activeBoiler = useMemo(() => {
    return boilerplates?.find((b) => {
      const lang = b.language.toLowerCase();
      if (language === "cpp") return lang === "cpp" || lang === "c++";
      if (language === "javascript") return lang === "javascript" || lang === "js";
      return lang === language;
    });
  }, [language, boilerplates]);

  const activeCode = activeBoiler?.snippet || "";

  useEffect(() => {
    setCode(activeCode);
  }, [activeCode]);

  const handleRun = () => {
    const sig = problem?.boilerplate?.functionSignature || {};

    dispatch(
      runProblem({
        problem: {
          language,
          problemNumber: problem.problemNumber,
          functionName: sig.functionName,
          returnType: sig.returnType,
          inputs: sig.inputs,
        },
        language,
        code,
      })
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] overflow-hidden">
      <div className="flex-none h-10 bg-[#1e1e1e] border-b border-[#333]">
        <EditorHeader
          language={language}
          setLanguage={setLanguage}
          onRun={handleRun}
          onSubmit={handleRun}
        />
      </div>

      <div className="flex-1 min-h-0 relative">
        <CodeEditor code={code} language={language} onChange={setCode} />
      </div>

      <div className="flex-none h-[40%] bg-[#1e1e1e] border-t border-[#333]">
        <ResultsPanel loading={loading} runResult={runResult} />
      </div>
    </div>
  );
}

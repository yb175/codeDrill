import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import EditorHeader from "./editorHeader";
import CodeEditor from "./codeEditor";
import ResultsPanel from "./resultsPanel";
import { runProblem } from "../../slice/problemSlice";

export default function EditorPanel({ boilerplates, problem }) {
  const dispatch = useDispatch();

  // We now extract error also from Redux
  const { runResult, loading, error } = useSelector((state) => state.problem);
  /* ============================
        EDITOR LANGUAGE STATE
  ============================ */
  const defaultLang = boilerplates?.[0]?.language?.toLowerCase() || "python";
  const [language, setLanguage] = useState(defaultLang);
  const [code, setCode] = useState("");

  /* ============================
        RESIZE PANEL STATE
  ============================ */
  const [panelHeight, setPanelHeight] = useState(300);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const startResize = (e) => {
    e.preventDefault();
    isDragging.current = true;
    startY.current = e.clientY;
    startHeight.current = panelHeight;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const delta = startY.current - e.clientY;
    const newHeight = startHeight.current + delta;

    if (newHeight > 50 && newHeight < 800) {
      setPanelHeight(newHeight);
    }
  };

  const stopResize = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResize);
  };

  /* ============================
        BOILERPLATE LOGIC
  ============================ */
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

  /* ============================
            RUN BUTTON
  ============================ */
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

  /* ============================
            RENDER UI
  ============================ */
  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] overflow-hidden">

      {/* ---------------- HEADER ---------------- */}
      <div className="flex-none h-10 bg-[#1e1e1e] border-b border-[#333]">
        <EditorHeader
          language={language}
          setLanguage={setLanguage}
          onRun={handleRun}
          onSubmit={handleRun}
        />
      </div>

      {/* ---------------- CODE EDITOR ---------------- */}
      <div className="flex-1 min-h-0 relative">
        <CodeEditor code={code} language={language} onChange={setCode} />
      </div>

      {/* ---------------- RESIZER HANDLE ---------------- */}
      <div
        onMouseDown={startResize}
        className="h-2 w-full bg-[#1e1e1e] border-t border-white/5 cursor-row-resize flex items-center justify-center hover:bg-white/5 transition-colors group z-50 flex-none"
      >
        <div className="w-12 h-1 rounded-full bg-white/10 group-hover:bg-purple-500 transition-colors" />
      </div>

      {/* ---------------- RESULTS PANEL ---------------- */}
      <div
        style={{ height: panelHeight }}
        className="flex-none bg-[#1e1e1e] border-t border-[#333] transition-none"
      >
        <ResultsPanel
          loading={loading}
          runResult={runResult}
          error={error}   // ⬅ THE IMPORTANT FIX
        />
      </div>

    </div>
  );
}

import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { Rocket, Sparkles } from "lucide-react";

const ComingSoonOverlay = ({ language }) => (
  <div className="h-full w-full flex flex-col items-center justify-center bg-[#09090b] relative overflow-hidden text-center p-6 select-none">

    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent"></div>

    <div className="relative z-10 flex flex-col items-center">

      <div className="relative mb-8 group">
        <div className="absolute -inset-4 border border-dashed border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute -inset-4 border border-dashed border-purple-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-50"></div>

        <div className="relative bg-[#18181b] p-6 rounded-full border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
          <Rocket className="w-8 h-8 text-cyan-400 animate-bounce-slow" />
        </div>

        <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-300 animate-pulse" />
        <Sparkles className="absolute -bottom-2 -left-2 w-3 h-3 text-purple-300 animate-pulse delay-700" />
      </div>

      <div className="space-y-3 max-w-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-[10px] font-mono text-cyan-400 tracking-wider uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          In Development
        </div>

        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white tracking-tight">
          {language} Support
        </h3>

        <p className="text-sm text-zinc-400 leading-relaxed">
          Our engineers are currently compiling the kernel for <span className="text-cyan-300 font-mono capitalize">{language}</span>. 
          Expect a drop soon.
        </p>
      </div>

      <div className="mt-8 w-48 space-y-2">
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>COMPILING_ASSETS...</span>
          <span>78%</span>
        </div>
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-[78%] animate-[pulse_2s_infinite]"></div>
        </div>
      </div>
    </div>
  </div>
);

function CodeEditor({ code, language = "python", onChange }) {
  const [value, setValue] = useState(code);

  useEffect(() => {
    setValue(code);
  }, [code]);

  const getExtensions = () => {
    switch (language.toLowerCase()) {
      case "python": return [python()];
      case "javascript": return [javascript({ jsx: true })];
      case "cpp": return [cpp()];
      default: return [python()];
    }
  };

  if (!code) {
    return (
      <div className="h-full w-full relative overflow-hidden bg-[#1e1e1e] border-l border-[#333]">
        <ComingSoonOverlay language={language} />
      </div>
    );
  }

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
            if (onChange) onChange(val);   // FIXED
          }}
          className="text-[14px]"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;

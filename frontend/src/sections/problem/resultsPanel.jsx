import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  Copy, 
  Check, 
  TerminalSquare,
  AlertTriangle,
  Timer
} from "lucide-react";
import { toast } from "sonner";

/* =====================================================
   THEME CONSTANTS
===================================================== */
const COLORS = {
  bg: "bg-[#111111]",
  surface: "bg-[#1A1A1A]",
  border: "border-white/10",
  success: "text-emerald-400",
  error: "text-rose-400",
  warning: "text-amber-400",
};

/* =====================================================
   HELPER: FORMATTER
===================================================== */
const formatValue = (val) => {
  if (val === null || val === undefined) return "null";
  if (typeof val === "string") return val.replace(/\\n/g, "\n").replace(/\\"/g, '"');
  if (typeof val === "object") return JSON.stringify(val, null, 2);
  return String(val);
};

/* =====================================================
   COMPONENT: COPY BUTTON
===================================================== */
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-md text-gray-500 hover:text-white"
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
    </button>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */
export default function ResultsPanel({ runResult, loading }) {
  const [activeTab, setActiveTab] = useState(0);

  // Auto-toast errors
  useEffect(() => {
    if (runResult?.stderr) {
      toast.error("Execution Failed", {
        className: "!bg-red-950 !border-red-900 !text-red-200",
        description: "Runtime error detected.",
      });
    }
  }, [runResult]);

  // --- LOGIC TO DETECT STATE ---
  const stderr = runResult?.stderr || "";
  const compilationOutput = runResult?.data?.[0]?.compilation_output || ""; 

  // 1. Check for TLE (Time Limit Exceeded)
  // distinct from normal errors if your backend sends "Time Limit Exceeded" in stderr
  const isTLE = stderr.toLowerCase().includes("time limit exceeded");

  // 2. Check for Runtime Errors (excluding TLE if handled separately)
  const isRuntimeError = !!stderr && !isTLE;

  // 3. Check for Compilation Issues (Warnings or Errors)
  const isCompilationIssue = compilationOutput.length > 0;

  // 4. Clean Run?
  const isCleanRun = !isTLE && !isRuntimeError && !isCompilationIssue;

  // Test Cases Data
  const testCases = runResult && Array.isArray(runResult.data) ? runResult.data : [];
  const currentCase = testCases[activeTab];
  
  const allPassed = testCases.length > 0 && testCases.every(
    (t) => String(t.output).trim() === String(t.expected_output).trim()
  );

  return (
    <div className={`flex flex-col h-full w-full ${COLORS.bg} font-sans`}>
      
      {/* ================= HEADER ================= */}
      <div className={`
        px-6 py-3 border-b border-white/5 flex items-center justify-between flex-shrink-0
        ${isRuntimeError || isTLE ? 'bg-red-500/5' : isCompilationIssue ? 'bg-amber-500/5' : allPassed && runResult ? 'bg-emerald-500/5' : 'bg-[#111]'}
      `}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
             {loading ? (
                <div className="h-5 w-5 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
             ) : !runResult ? (
                <TerminalSquare size={18} className="text-gray-500" />
             ) : isTLE ? (
                <Timer size={18} className={COLORS.error} />
             ) : isRuntimeError ? (
                <XCircle size={18} className={COLORS.error} />
             ) : isCompilationIssue ? (
                <AlertTriangle size={18} className={COLORS.warning} />
             ) : allPassed ? (
                <CheckCircle2 size={18} className={COLORS.success} />
             ) : (
                <XCircle size={18} className={COLORS.warning} />
             )}
             
             <span className={`font-bold tracking-tight ${
               !runResult ? 'text-gray-500' :
               isTLE || isRuntimeError ? COLORS.error : 
               isCompilationIssue ? COLORS.warning : 
               allPassed ? COLORS.success : 
               COLORS.warning
             }`}>
               {loading ? "Running Code..." : 
                !runResult ? "Console" : 
                isTLE ? "Time Limit Exceeded" :
                isRuntimeError ? "Runtime Error" : 
                isCompilationIssue ? "Compilation Info" : 
                allPassed ? "Accepted" : "Wrong Answer"}
             </span>
          </div>

          {/* Metrics (Only show if Clean Run) */}
          {isCleanRun && !loading && runResult && (
             <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500 font-mono border-l border-white/10 pl-4">
                <span className="flex items-center gap-1"><Clock size={12} /> 12ms</span>
                <span className="flex items-center gap-1"><Zap size={12} /> 4.2MB</span>
             </div>
          )}
        </div>
      </div>

      {/* ================= CONTENT AREA ================= */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#111111] relative">
        
        {/* LOADING */}
        {loading && (
          <div className="p-8 space-y-4 opacity-50">
             <div className="h-4 w-1/3 bg-white/10 rounded animate-pulse" />
             <div className="h-24 w-full bg-white/5 rounded animate-pulse" />
          </div>
        )}

        {/* EMPTY STATE */}
        {!runResult && !loading && (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 space-y-2 pb-8">
              <TerminalSquare size={48} strokeWidth={1} className="opacity-20" />
              <p className="text-sm font-medium">Ready to execute</p>
           </div>
        )}

        {/* 1. RUNTIME ERROR / TLE STATE (Hides Testcases) */}
        {runResult && (isRuntimeError || isTLE) && (
          <div className="p-6">
            <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4 font-mono text-red-200 text-sm whitespace-pre-wrap">
              <div className="flex items-center gap-2 mb-2 border-b border-red-500/10 pb-2 text-red-400 font-semibold">
                  <XCircle size={14} /> Error Output
               </div>
              {stderr}
            </div>
          </div>
        )}

        {/* 2. COMPILATION ISSUE STATE (Hides Testcases) */}
        {runResult && isCompilationIssue && !isRuntimeError && !isTLE && (
          <div className="p-6">
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 font-mono text-amber-200 text-sm whitespace-pre-wrap">
               <div className="flex items-center gap-2 mb-2 border-b border-amber-500/10 pb-2 text-amber-400 font-semibold">
                  <AlertTriangle size={14} /> Compilation Output
               </div>
               {compilationOutput}
            </div>
          </div>
        )}

        {/* 3. CLEAN RUN (Shows Testcases) */}
        {/* Only render this block if there are NO errors and NO warnings */}
        {runResult && isCleanRun && (
          <div className="flex flex-col min-h-0">
            {/* TABS */}
            <div className="px-6 py-2 border-b border-white/5 bg-[#111] sticky top-0 z-10 flex gap-2 overflow-x-auto">
                {testCases.map((t, i) => {
                    const passed = String(t.output).trim() === String(t.expected_output).trim();
                    return (
                        <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            className={`
                                px-3 py-1.5 rounded text-xs font-medium transition-colors border flex items-center gap-2
                                ${activeTab === i 
                                    ? 'bg-white/10 border-white/10 text-white' 
                                    : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5'}
                            `}
                        >
                            Case {i + 1}
                            <div className={`w-1.5 h-1.5 rounded-full ${passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        </button>
                    )
                })}
            </div>

            {/* TAB CONTENT */}
            {currentCase && (
               <div className="p-6 space-y-6">
                  {/* Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase">
                        <span>Input</span>
                        <CopyButton text={formatValue(currentCase.testCase)} />
                    </div>
                    <div className="p-3 bg-[#161616] rounded border border-white/5 font-mono text-sm text-gray-300">
                        {formatValue(currentCase.testCase)}
                    </div>
                  </div>

                  {/* Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase">
                            <span>Your Output</span>
                        </div>
                        <div className={`p-3 rounded border font-mono text-sm ${
                            String(currentCase.output).trim() === String(currentCase.expected_output).trim()
                            ? 'bg-[#161616] border-white/5 text-gray-300'
                            : 'bg-red-500/10 border-red-500/20 text-red-200'
                        }`}>
                            {formatValue(currentCase.output)}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase">
                            <span>Expected</span>
                        </div>
                        <div className="p-3 bg-[#161616] rounded border border-white/5 font-mono text-sm text-gray-300">
                            {formatValue(currentCase.expected_output)}
                        </div>
                    </div>
                  </div>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
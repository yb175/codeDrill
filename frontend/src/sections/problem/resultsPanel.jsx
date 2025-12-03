import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

/* =====================================================
   VALUE FORMATTER (Stable)
===================================================== */
const formatValue = (val) => {
  if (val === null || val === undefined) return "null";
  if (typeof val === "string") {
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    try {
      if (val.trim().startsWith("{") || val.trim().startsWith("[")) {
        return formatValue(JSON.parse(val));
      }
    } catch {}
    return val.replace(/\\n/g, "").replace(/\\"/g, '"');
  }
  if (Array.isArray(val)) return JSON.stringify(val, null, 2);
  if (typeof val === "object") return JSON.stringify(val, null, 2);
  return String(val);
};

/* =====================================================
   MAIN PANEL
===================================================== */
export default function ResultsPanel({ runResult, loading }) {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (runResult?.stderr) {
      toast.error("Runtime Error", {
        description: "Your code encountered a runtime failure.",
      });
    }
  }, [runResult]);

  /* =====================================================
     LOADING STATE (PREMIUM SHIMMER)
  ====================================================== */
  if (loading) {
    return (
      <div className="w-full h-full p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-40 bg-white/10 rounded"></div>
          <div className="h-32 w-full bg-white/10 rounded-lg"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-white/10 rounded-lg"></div>
            <div className="h-20 bg-white/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     EMPTY STATE
  ====================================================== */
  if (!runResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#1b1b1b] text-gray-500">
        <Terminal size={34} className="opacity-30 mb-2" />
        <div className="text-sm tracking-wide">Click Run to Execute Code</div>
      </div>
    );
  }

  /* SAFETY */
  const isError = !!runResult.stderr;
  const testCases = Array.isArray(runResult.data) ? runResult.data : [];
  const currentCase = testCases[activeTab];

  const allPassed =
    testCases.length > 0 &&
    testCases.every(
      (t) => String(t.output).trim() === String(t.expected_output).trim()
    );

  /* =====================================================
     DESIGN ROOT
  ====================================================== */
  return (
    <div className="flex flex-col h-full bg-[#181818] border-t border-white/5 shadow-inner">

      {/* =====================================================
         HEADER STATUS BAR
      ====================================================== */}
      <div className="px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">

          {isError ? (
            <div className="flex items-center gap-2 text-red-400 font-semibold text-lg">
              <XCircle size={20} />
              Runtime Error
            </div>
          ) : allPassed ? (
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-lg">
              <CheckCircle2 size={20} />
              Accepted
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-400 font-semibold text-lg">
              <XCircle size={20} />
              Wrong Answer
            </div>
          )}

          {!isError && (
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md flex items-center gap-1">
              <Clock size={12} /> 12ms
            </span>
          )}
        </div>
      </div>

      {/* =====================================================
         ERROR PANEL
      ====================================================== */}
      {isError && (
        <div className="p-6">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle size={16} />
            <span className="font-semibold text-sm">Error Message</span>
          </div>

          <pre className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300 text-sm whitespace-pre-wrap font-mono shadow-lg">
            {runResult.stderr}
          </pre>
        </div>
      )}

      {/* =====================================================
         MAIN RESULTS PANEL
      ====================================================== */}
      {!isError && (
        <div className="flex flex-col h-full overflow-hidden">

          {/* =====================================================
             TESTCASE TABS (glass pills)
          ====================================================== */}
          <div className="flex gap-2 px-6 py-3 bg-black/30 border-b border-white/10 overflow-x-auto backdrop-blur-xl">
            {testCases.map((t, i) => {
              const passed =
                String(t.output).trim() ===
                String(t.expected_output).trim();
              const selected = activeTab === i;

              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`
                    px-4 py-2 rounded-lg text-sm flex items-center gap-2
                    transition shadow-sm shrink-0
                    ${
                      selected
                        ? "bg-white/10 text-white border border-white/10"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }
                  `}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      passed ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  ></span>
                  Case {i + 1}
                </button>
              );
            })}
          </div>

          {/* =====================================================
             CONTENT AREA
          ====================================================== */}
          <div className="flex-1 overflow-y-auto p-6">

            {currentCase && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-8"
                >

                  {/* =====================================================
                     INPUT
                  ====================================================== */}
                  <div>
                    <div className="text-xs uppercase text-gray-500 mb-2 tracking-wide">
                      Input
                    </div>
                    <pre className="bg-[#222] border border-white/10 p-4 rounded-lg text-gray-300 font-mono text-sm whitespace-pre-wrap">
                      {formatValue(currentCase.testCase)}
                    </pre>
                  </div>

                  {/* =====================================================
                     OUTPUT vs EXPECTED
                  ====================================================== */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* OUTPUT */}
                    <div>
                      <div className="text-xs uppercase text-gray-500 mb-2 tracking-wide">
                        Output
                      </div>
                      <pre
                        className={`
                        p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap
                        ${
                          String(currentCase.output).trim() ===
                          String(currentCase.expected_output).trim()
                            ? "bg-[#222] border-white/10 text-gray-300"
                            : "bg-red-500/10 border-red-500/30 text-red-300"
                        }
                      `}
                      >
                        {formatValue(currentCase.output)}
                      </pre>
                    </div>

                    {/* EXPECTED */}
                    <div>
                      <div className="text-xs uppercase text-gray-500 mb-2 tracking-wide">
                        Expected
                      </div>
                      <pre className="bg-[#222] border border-white/10 p-4 rounded-lg text-gray-300 font-mono text-sm whitespace-pre-wrap">
                        {formatValue(currentCase.expected_output)}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

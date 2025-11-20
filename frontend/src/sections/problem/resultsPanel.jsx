import React, { useState } from "react";
import { Terminal, AlertCircle, CheckCircle2, ChevronUp } from "lucide-react";

export default function ResultsPanel() {
  const [active, setActive] = useState("results");

  const tabs = [
    { id: "results", name: "Results", icon: CheckCircle2 },
    { id: "output", name: "Console", icon: Terminal },
    { id: "errors", name: "Errors", icon: AlertCircle },
  ];

  return (
    <div className="flex flex-col bg-[#0a0a0d]/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">

      {/* Tabs Header */}
      <div className="flex items-center justify-between px-4 bg-[#111114]/80 border-b border-white/5">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-t
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#1a1a1d] text-emerald-400 border-b-2 border-emerald-500 shadow-inner"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-[#1a1a1d]/30"
                  }
                `}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.name}
              </button>
            );
          })}
        </div>

        <ChevronUp className="h-4 w-4 text-zinc-500 hover:text-zinc-300 cursor-pointer transition" />
      </div>

      {/* Body */}
      <div className="h-52 overflow-y-auto p-4 font-mono text-sm bg-[#0a0a0d]/60 text-zinc-300 custom-scrollbar">

        {/* Results Tab */}
        {active === "results" && (
          <div className="space-y-2 animate-[fadeIn_.25s_ease]">
            <div className="text-emerald-400 font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Ready to run tests
            </div>
            <div className="text-zinc-500">Hit “Run” to execute hidden testcases.</div>

            {/* Cute dots indicator */}
            <div className="flex gap-1 mt-3">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce delay-150"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce delay-300"></div>
            </div>
          </div>
        )}

        {/* Console Output */}
        {active === "output" && (
          <div className="space-y-2 animate-[fadeIn_.25s_ease]">
            <span className="text-zinc-500/70">// program output</span>

            <div className="text-emerald-400">
              $
              <span className="animate-pulse"> _</span>
            </div>
          </div>
        )}

        {/* Errors */}
        {active === "errors" && (
          <div className="space-y-2 animate-[fadeIn_.25s_ease]">
            <div className="flex items-center gap-2 text-red-400/80 font-medium">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
              No errors detected
            </div>
            <div className="text-zinc-500 text-xs">Your code compiled successfully.</div>
          </div>
        )}

      </div>
    </div>
  );
}

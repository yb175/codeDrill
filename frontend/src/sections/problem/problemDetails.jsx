import React, { useState } from "react";
import ProblemHeader from "./problemHeader";
import DescriptionView from "./descriptionview";
import DiscussionsView from "./discussview";

export default function ProblemDetails({
  title,
  breadcrumbs,
  tags,

  // backend objects
  description,
  examples,
  hints,
  discussions
}) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div 
      className="
        space-y-6 h-full overflow-y-auto pb-16 
        bg-slate-950 text-slate-300 relative

        /* --- ICY BLUE GLASS SCROLLBAR --- */
        scrollbar-smooth
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-blue-500/20
        [&::-webkit-scrollbar-thumb]:backdrop-blur-sm
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:border-2
        [&::-webkit-scrollbar-thumb]:border-transparent
        [&::-webkit-scrollbar-thumb]:bg-clip-content
        hover:[&::-webkit-scrollbar-thumb]:bg-blue-400/40
        active:[&::-webkit-scrollbar-thumb]:bg-blue-400/60
      "
    >
      {/* Background Ambient Glow (Optional - adds depth) */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-0">
        <ProblemHeader
          title={title}
          tags={tags}
          breadcrumbs={breadcrumbs}
        />
      </div>

      {/* GLASSY STICKY TABS */}
      <div className="sticky top-0 z-10 pt-2 border-b border-white/5 bg-slate-950/40 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <nav className="flex space-x-8 px-4">

          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 text-sm font-medium transition-all duration-300 relative tracking-wide ${
              activeTab === "description"
                ? "text-blue-200 drop-shadow-[0_0_5px_rgba(147,197,253,0.6)]" // Glowing Text
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Description
            {/* Neon Glass Indicator */}
            {activeTab === "description" && (
                <div className="absolute bottom-0 left-0 w-full h-[2px]">
                   <div className="absolute inset-0 bg-blue-400 blur-[2px]" />
                   <div className="absolute inset-0 bg-blue-400 rounded-t-full" />
                </div>
            )}
          </button>

          <button
            onClick={() => setActiveTab("discussions")}
            className={`pb-3 text-sm font-medium transition-all duration-300 relative tracking-wide ${
              activeTab === "discussions"
                ? "text-blue-200 drop-shadow-[0_0_5px_rgba(147,197,253,0.6)]"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Discussions
            {activeTab === "discussions" && (
                <div className="absolute bottom-0 left-0 w-full h-[2px]">
                   <div className="absolute inset-0 bg-blue-400 blur-[2px]" />
                   <div className="absolute inset-0 bg-blue-400 rounded-t-full" />
                </div>
            )}
          </button>

        </nav>
      </div>

      {/* CONTENT */}
      <div className="relative z-0 animate-in fade-in slide-in-from-bottom-3 duration-700 px-2">
        {activeTab === "description" && (
            <DescriptionView
            description={description}      
            visibleTestCases={examples}    
            hints={hints}
            />
        )}

        {activeTab === "discussions" && (
            <DiscussionsView discussions={discussions || []} />
        )}
      </div>

    </div>
  );
}
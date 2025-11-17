
import React, { useState } from "react";

export default function Topbar() {
  const [filters, setFilters] = useState({
    difficulty: false,
    status: false,
    arrays: false,
    graphs: false,
    dynamicProgramming: true
  });

  return (
    <header className="w-full px-8 py-6 border-b border-[#1e2734]">
      <div className="flex items-center gap-4 mb-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by #, title, or keyword..."
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#1a2332] border border-[#2a3342] text-[14px] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3d4f7a] transition-colors"
          />
        </div>

        {/* New Problem Button */}
        <button className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-white text-[14px] font-medium transition-colors whitespace-nowrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Problem
        </button>
      </div>

      {/* Filter Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <button 
          onClick={() => setFilters({...filters, difficulty: !filters.difficulty})}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2332] hover:bg-[#2a3342] border border-[#2a3342] text-gray-300 text-[13px] transition-colors"
        >
          <span>Difficulty</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <button 
          onClick={() => setFilters({...filters, status: !filters.status})}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2332] hover:bg-[#2a3342] border border-[#2a3342] text-gray-300 text-[13px] transition-colors"
        >
          <span>Status</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <button 
          onClick={() => setFilters({...filters, arrays: !filters.arrays})}
          className="px-4 py-2 rounded-lg bg-[#1a2332] hover:bg-[#2a3342] border border-[#2a3342] text-gray-300 text-[13px] transition-colors"
        >
          Arrays
        </button>

        <button 
          onClick={() => setFilters({...filters, graphs: !filters.graphs})}
          className="px-4 py-2 rounded-lg bg-[#1a2332] hover:bg-[#2a3342] border border-[#2a3342] text-gray-300 text-[13px] transition-colors"
        >
          Graphs
        </button>

        <button 
          onClick={() => setFilters({...filters, dynamicProgramming: !filters.dynamicProgramming})}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6b21a8]/20 border border-[#7c3aed]/30 text-[#c084fc] text-[13px] hover:bg-[#6b21a8]/30 transition-colors"
        >
          <span>Dynamic Programming</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Bot,
  FilePlus,
  Search,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';
const QuickTips = () => {
  const tips = [
    "Use 'Validate Payload' before submitting to catch malformed keys.",
    "Hidden tests should omit descriptions. Acceptance rate is 0-100.",
    "Use the 'Tags' feature to organize problems by topic.",
  ];

  return (
    <div className="p-6 bg-neutral-800/50 rounded-lg shadow-sm border border-neutral-700">
      <h2 className="text-xl font-semibold text-neutral-100 mb-4">Quick Tips</h2>
      <ul className="space-y-3">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <span className="text-neutral-300">{tip}</span>
          </li>
        ))}
      </ul>
      <button className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 mt-5">
        View All Tips
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuickTips;
import React, { useState } from "react";

export default function ResultsPanel() {
  const [active, setActive] = useState("results");

  const tabs = [
    { id: "results", name: "Test Results" },
    { id: "output", name: "Output" },
    { id: "errors", name: "Errors" },
  ];

  return (
    <div className="flex flex-col border-t border-gray-700">

      <div className="border-b border-gray-700">
        <nav className="flex space-x-4 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-1 py-2 border-b-2 text-sm ${
                active === tab.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 text-sm text-gray-400 h-32">
        {active === "results" && <span>Run your code to see test results.</span>}
        {active === "output" && <span>Console output will appear here.</span>}
        {active === "errors" && <span>Errors will appear here.</span>}
      </div>

    </div>
  );
}

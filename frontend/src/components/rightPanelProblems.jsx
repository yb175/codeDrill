// src/components/RightSidebar.jsx
import React, { useState } from "react";

export default function RightSidebar() {
  const [month] = useState("October 2023");
  const [showCalendar, setShowCalendar] = useState(true);

  const calendarDays = [
    24, 25, 26, 27, 28, 29, 30,
    1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28,
    29, 30, 31
  ];

  const streakDays = 7;
  const solvedToday = 3;
  const monthlySolved = 24;

  return (
    <aside className="w-80 max-w-[320px] sticky top-6">
      <div className="flex flex-col gap-4">
        
        {/* Calendar */}
        <div className="bg-[#0f1419] border border-[#1e2734] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-100">Problem of the Day</h3>
            <button
              onClick={() => setShowCalendar(v => !v)}
              className="text-xs text-neutral-400 hover:text-neutral-200"
            >
              {showCalendar ? "Hide" : "Show"}
            </button>
          </div>

          {showCalendar && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <button className="p-1 rounded hover:bg-[#131820]">
                  <svg width="14" height="14" stroke="#9ca3af" strokeWidth="2">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                <div className="text-xs text-neutral-200 font-medium">{month}</div>
                <button className="p-1 rounded hover:bg-[#131820]">
                  <svg width="14" height="14" stroke="#9ca3af" strokeWidth="2">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-[11px] text-neutral-500 mb-2">
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                  <div key={d} className="text-center">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-[12px] text-neutral-300">
                {calendarDays.map((d, idx) => {
                  const isInactive = idx < 7;
                  const isActive = d === 18;

                  return (
                    <div
                      key={idx}
                      className={`py-1 rounded text-center ${
                        isInactive
                          ? "text-neutral-600"
                          : isActive
                          ? "bg-[#4f75ff] text-white font-semibold"
                          : "hover:bg-[#131820]"
                      }`}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Streak */}
        <div className="bg-[#0f1419] border border-[#1e2734] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-neutral-100">Streak & Progress</h4>
            <div className="text-xs text-neutral-400">This month</div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-neutral-400">Streak</div>
              <div className="text-lg font-semibold text-neutral-100">{streakDays}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-400">Solved today</div>
              <div className="text-lg font-semibold text-neutral-100">{solvedToday}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-400">This month</div>
              <div className="text-lg font-semibold text-neutral-100">{monthlySolved}</div>
            </div>
          </div>

          <div className="mt-3">
            <div className="w-full h-2 bg-[#131820] rounded-full">
              <div
                style={{ width: `${monthlySolved}%` }}
                className="h-2 rounded-full bg-[#5168ff]"
              ></div>
            </div>
            <p className="text-[12px] text-neutral-400 mt-2">Target: 100 problems</p>
          </div>
        </div>

        {/* Practice */}
        <div className="bg-[#0f1419] border border-[#1e2734] rounded-2xl p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-neutral-100 mb-2">Practice</h4>

          <button className="w-full py-2 rounded bg-[#5168ff] text-white text-sm hover:bg-[#3f55d9]">
            Start Timed Practice
          </button>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button className="text-xs py-2 rounded-md bg-[#12151a] border border-[#1e2734] text-neutral-200 hover:bg-[#17202a]">
              Solo (10 min)
            </button>
            <button className="text-xs py-2 rounded-md bg-[#12151a] border border-[#1e2734] text-neutral-200 hover:bg-[#17202a]">
              Topic Drill
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
}

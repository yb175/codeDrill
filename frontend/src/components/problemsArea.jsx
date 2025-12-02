// src/components/ProblemsTable.jsx
import React from "react";
import { CheckCircle2, Hourglass } from "lucide-react";
import { useNavigate } from "react-router";
export default function ProblemsTable({
  problems,
  loading,
  page,
  limit,
  total,
  onPageChange,
  solvedProblems,
}) {
  const totalPages = Math.ceil((total || 0) / limit);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-[#1f2937] bg-[#111827]/70 shadow-xl backdrop-blur-[6px] overflow-hidden">
      {/* Table */}
      <table className="w-full text-sm text-gray-300">
        <thead className="text-xs uppercase bg-[#1a2333]/40 border-b border-[#253041] text-gray-400 tracking-wide">
          <tr>
            <th className="px-6 py-3 w-16 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Problem Title</th>
            <th className="px-6 py-3 text-center font-medium">Acceptance</th>
            <th className="px-6 py-3 text-right font-medium">Difficulty</th>
          </tr>
        </thead>

        <tbody >
          {(loading ? [] : problems).map((p) => (
            <tr
              key={p._id}
              className="border-b border-[#1f2937] hover:bg-[#1e2533]/60 transition-all cursor-pointer"
             onClick={() =>{
              navigate(`/problems/${p.problemNumber}`)
              console.log(p.problemNumber);
             } }
            >
              
              {/* Status with Lucide Icons */}
              <td className="px-6 py-4">
                {solvedProblems?.some(
                  (s) => s.problemNumber === p.problemNumber
                ) ? (
                  <CheckCircle2
                    size={20}
                    strokeWidth={2.2}
                    className="text-green-400"
                  />
                ) : (
                  <Hourglass
                    size={20}
                    strokeWidth={2.2}
                    className="text-yellow-400"
                  />
                )}
              </td>

              {/* Problem Title */}
              <td className="px-6 py-4 text-white font-medium whitespace-nowrap">
                #{p.problemNumber}. {p.title}
              </td>

              {/* Acceptance */}
              <td className="px-6 py-4 text-center">
                {p.acceptanceRate ? `${p.acceptanceRate}%` : "-"}
              </td>

              {/* Difficulty Badge */}
              <td className="px-6 py-4 text-right">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border
                    ${
                      p.difficulty === "easy"
                        ? "bg-[#15351f] text-green-300 border-green-600/40"
                        : p.difficulty === "medium"
                        ? "bg-[#3b3417] text-yellow-300 border-yellow-600/40"
                        : "bg-[#3a1b1b] text-red-300 border-red-600/40"
                    }
                  `}
                >
                  {p.difficulty?.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}

          {!loading && problems.length === 0 && (
            <tr>
              <td colSpan="4" className="py-6 text-center text-gray-500">
                No problems found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#111827]/80 border-t border-[#253041]">
        {/* Showing Info */}
        <div className="text-xs text-gray-500">
          Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
          {total}
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-2">
          {/* Prev */}
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className={`px-3 py-1.5 rounded-md text-sm border border-[#253041]
              ${
                page === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[#1e2533] text-gray-300"
              }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 rounded-md text-sm border transition-all
                ${
                  p === page
                    ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                    : "border-[#253041] text-gray-300 hover:bg-[#1e2533]"
                }`}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className={`px-3 py-1.5 rounded-md text-sm border border-[#253041]
              ${
                page === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[#1e2533] text-gray-300"
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

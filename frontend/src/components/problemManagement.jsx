import React from "react";
import { FilePlus, Pencil, Search, ChevronLeft, ChevronRight, Pointer } from "lucide-react";
import { Link } from "react-router";
const ProblemManagement = ({
  problemCount,
  problems,
  loading,
  page,
  limit,
  totalPages,      // ✅ new prop
  onPageChange,
  onSearchChange,
  searchQuery,
}) => {
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;  // ✅ lock next on last page

  return (
    <div className="p-6 rounded-xl border border-neutral-700 bg-neutral-900/40 backdrop-blur-md shadow-lg">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-neutral-100 tracking-wide">
          Problems <span className="text-neutral-400 text-lg">({problemCount})</span>
        </h2>

        <Link 
        to="Add"
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/90 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md hover:shadow-blue-900/30 transition-all">
          <FilePlus className="w-5 h-5" cursor={Pointer}
           />
          Add Problem
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-2 rounded-lg bg-neutral-800/60 border border-neutral-700 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition"
          />
        </div>
      </div>

      {/* Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse h-14 w-full rounded-lg bg-neutral-800/60 border border-neutral-700 shadow-inner"
            ></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {problems?.map((p) => (
            <div
              key={p._id}
              className="group flex items-center justify-between px-4 py-4 rounded-lg border border-neutral-700 bg-neutral-900/30 backdrop-blur-sm hover:bg-neutral-900/60 hover:border-neutral-600 transition-all shadow-sm hover:shadow-md"
            >
              <div>
                <p className="text-neutral-200 font-medium text-lg tracking-wide">
                  #{p.problemNumber} <span className="text-neutral-300">{p.title}</span>
                </p>

                <span
                  className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-md font-medium capitalize
                    ${
                      p.difficulty === "easy"
                        ? "bg-green-600/20 text-green-400 border border-green-700/40"
                        : p.difficulty === "medium"
                        ? "bg-yellow-600/20 text-yellow-400 border border-yellow-700/40"
                        : "bg-red-600/20 text-red-400 border border-red-700/40"
                    }
                  `}
                >
                  {p.difficulty}
                </span>
              </div>

              <Link to={`Edit/${p.problemNumber}`} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 hover:text-white transition-all shadow-sm hover:shadow-md">
                <Pencil className="w-4 h-4" />
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-8">
        <button
          disabled={isFirstPage}
          onClick={() => onPageChange(page - 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition 
          ${isFirstPage && "opacity-40 cursor-not-allowed"}`}
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        <span className="text-neutral-400 text-sm">
          Page <span className="text-neutral-200">{page}</span> / {totalPages}
        </span>

        <button
          disabled={isLastPage}
          onClick={() => onPageChange(page + 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition 
          ${isLastPage && "opacity-40 cursor-not-allowed"}`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProblemManagement;

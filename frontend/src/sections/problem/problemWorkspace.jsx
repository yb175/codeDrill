import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getProblemById } from "../../slice/problemWorkspaceSlice";

import ProblemDetails from "./problemDetails";
import EditorPanel from "./editorPanel";
import { AlertCircle, RefreshCw } from "lucide-react";

/* ======================================================
   CUTE SHIMMER (Bluish Glass Theme)
======================================================= */
const CuteShimmer = () => (
  <div className="w-full animate-pulse p-4">
    <div className="space-y-4">
      {/* Header bars */}
      <div className="h-8 w-2/3 rounded-lg bg-slate-800/50" />
      <div className="h-4 w-1/3 rounded-lg bg-slate-800/30" />
      
      {/* Big description block */}
      <div className="h-40 w-full rounded-xl bg-slate-800/20 border border-white/5" />

      {/* Two smaller blocks (Test cases) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 rounded-xl bg-slate-800/30 border border-white/5" />
        <div className="h-24 rounded-xl bg-slate-800/30 border border-white/5" />
      </div>

      {/* Text lines */}
      <div className="space-y-3 pt-4">
        <div className="h-3 w-full rounded-md bg-slate-800/40" />
        <div className="h-3 w-5/6 rounded-md bg-slate-800/40" />
        <div className="h-3 w-4/6 rounded-md bg-slate-800/40" />
      </div>
    </div>
  </div>
);

/* ======================================================
   ERROR UI — Glassy Red
======================================================= */
const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center text-center gap-4 p-8 h-full w-full bg-slate-950 text-slate-300 relative overflow-hidden">
    {/* Background Glow */}
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.1),transparent_50%)] pointer-events-none" />

    <div className="z-10 bg-slate-900/50 p-8 rounded-2xl border border-red-500/20 backdrop-blur-md">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />

        <div>
        <h2 className="text-lg font-semibold text-red-400 mb-1">Failed to Load Problem</h2>
        <p className="text-sm text-slate-500 max-w-sm">
            {message || "Something went wrong while fetching the problem."}
        </p>
        </div>

        <button
        onClick={onRetry}
        className="mt-6 flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all duration-300"
        >
        <RefreshCw className="w-4 h-4" />
        Retry
        </button>
    </div>
  </div>
);

export default function ProblemWorkspace() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { problem, loading, error } = useSelector((s) => s.problemById);

  /* Fetch the problem */
  useEffect(() => {
    dispatch(getProblemById({ id }));
  }, [id]);

  /* ======================================================
      LOADING STATE
  ======================================================= */
  if (loading) {
    return (
      <main className="flex h-screen w-full overflow-hidden bg-slate-950 p-6 gap-6">
        <div className="flex-1"><CuteShimmer /></div>
        <div className="hidden lg:block w-1/2 border-l border-white/5 pl-6"><CuteShimmer /></div>
      </main>
    );
  }

  /* ======================================================
      ERROR STATE
  ======================================================= */
  if (error || !problem) {
    const msg =
      error?.message ||
      error?.response?.data?.message ||
      "Unable to fetch problem from server.";

    return (
      <ErrorState
        message={msg}
        onRetry={() => dispatch(getProblemById({ id }))}
      />
    );
  }

  /* ======================================================
      MAIN RENDER
  ======================================================= */
  return (
    <main className="flex h-screen w-full text-slate-300 overflow-hidden bg-slate-950 relative">
      
      {/* GLOBAL BACKGROUND GLOW (Matches ProblemDetails) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none z-0" />

      {/* LEFT: PROBLEM DETAILS */}
      <div className="flex-1 h-full z-10 md:pl-2">
        <ProblemDetails
          title={problem.title}
          breadcrumbs={[
            { name: "Problems", href: "/problems" },
            { name: problem.difficulty, href: "#" },
            { name: problem.title, href: "#" },
          ]}
          tags={[
            {
              name: problem.difficulty,
              color:
                problem.difficulty === "easy"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : problem.difficulty === "medium"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20",
            },
            ...(problem.problemTags || []).map((t) => ({
              name: t,
              color: "bg-slate-800/50 text-slate-400 border border-white/5",
            })),
          ]}
          description={problem.description}
          examples={(problem.visibleTestCases || []).map((ex, i) => ({
            id: i + 1,
            input: JSON.stringify(ex.testCase, null, 2),
            output: ex.output,
            explanation: ex.description || "",
          }))}
          hints={problem.hints || []}
          discussions={[]}
        />
      </div>

      {/* RIGHT: EDITOR */}
      {/* Added z-10 to sit above background, and border-white/5 for glass effect */}
      <div className="hidden lg:flex flex-col flex-1 h-full border-l border-white/5 lg:w-1/2 overflow-hidden z-10 bg-slate-950/30 backdrop-blur-sm">
        <EditorPanel
          boilerplates={problem.boilerplate || []}
          problem={problem}
        />
      </div>
    </main>
  );
}
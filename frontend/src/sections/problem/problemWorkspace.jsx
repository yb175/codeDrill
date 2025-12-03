import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getProblemById } from "../../slice/problemWorkspaceSlice";

import ProblemDetails from "./problemDetails";
import EditorPanel from "./editorPanel";
import { AlertCircle, RefreshCw } from "lucide-react";

/* ======================================================
   CUTE SHIMMER (kept same, only polished)
======================================================= */
const CuteShimmer = () => (
  <div className="w-full animate-pulse">
    <div className="space-y-4">
      <div className="h-6 w-2/3 rounded-lg bg-[#1f2937]" />
      <div className="h-4 w-1/3 rounded-lg bg-[#1e293b]" />
      <div className="h-32 w-full rounded-xl bg-[#1f2937]" />

      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 rounded-xl bg-[#1e293b]" />
        <div className="h-24 rounded-xl bg-[#1e293b]" />
      </div>

      <div className="space-y-2 pt-2">
        <div className="h-4 w-full rounded-md bg-[#1f2937]" />
        <div className="h-4 w-5/6 rounded-md bg-[#1f2937]" />
        <div className="h-4 w-2/3 rounded-md bg-[#1f2937]" />
      </div>
    </div>
  </div>
);

/* ======================================================
   ERROR UI — Beautiful & Safe
======================================================= */
const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center text-center gap-4 p-8 h-full w-full bg-[#111111] text-gray-300">
    <AlertCircle className="h-10 w-10 text-red-400" />

    <div>
      <h2 className="text-lg font-semibold text-red-400 mb-1">Failed to Load Problem</h2>
      <p className="text-sm text-gray-500 max-w-sm">
        {message || "Something went wrong while fetching the problem."}
      </p>
    </div>

    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded bg-red-600 hover:bg-red-700 transition"
    >
      <RefreshCw className="w-4 h-4" />
      Retry
    </button>
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
      <main className="flex h-full overflow-hidden p-6 gap-6">
        <div className="flex-1"><CuteShimmer /></div>
        <div className="hidden lg:block w-1/2"><CuteShimmer /></div>
      </main>
    );
  }

  /* ======================================================
     ERROR STATE (FULLY SAFE)
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
    <main className="flex h-screen w-full text-white overflow-hidden bg-[#0d0d0d]">

      {/* LEFT: PROBLEM DETAILS */}
      <div className="flex-1 overflow-y-scroll p-4 md:p-6 lg:w-1/2">
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
                  ? "bg-green-700/20 text-green-400"
                  : problem.difficulty === "medium"
                  ? "bg-yellow-700/20 text-yellow-400"
                  : "bg-red-700/20 text-red-400",
            },
            ...(problem.problemTags || []).map((t) => ({
              name: t,
              color: "bg-gray-700/20 text-gray-400",
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
      <div className="hidden lg:flex flex-col flex-1 border-l border-gray-700 lg:w-1/2 overflow-y-hidden">
        <EditorPanel
          boilerplates={problem.boilerplate || []}
          problem={problem}
        />
      </div>
    </main>
  );
}

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getProblemById } from "../../slice/problemWorkspaceSlice";
import ProblemDetails from "./problemDetails";
import EditorPanel from "./editorPanel";

export default function ProblemWorkspace() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { problem, loading, error } = useSelector((s) => s.problemById);

  useEffect(() => {
    dispatch(getProblemById({ id }));
  }, [id]);

  /* ---------------- CUTE SHIMMER ---------------- */
  const CuteShimmer = () => (
    <div className="w-full animate-pulse">
      <div className="space-y-4">
        <div className="h-6 w-2/3 rounded-lg bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#111827]" />

        <div className="h-4 w-1/3 rounded-lg bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a]" />

        <div className="h-32 w-full rounded-xl bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#111827]" />

        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 rounded-xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
          <div className="h-24 rounded-xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
        </div>

        <div className="space-y-2 pt-2">
          <div className="h-4 w-full rounded-md bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#111827]" />
          <div className="h-4 w-5/6 rounded-md bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#111827]" />
          <div className="h-4 w-2/3 rounded-md bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#111827]" />
        </div>
      </div>
    </div>
  );

  /* -------------- LOADING UI ---------------- */
  if (loading) {
    return (
      <main className="flex h-full overflow-hidden p-6 gap-6">
        <div className="flex-1">
          <CuteShimmer />
        </div>
        <div className="hidden lg:block w-1/2">
          <CuteShimmer />
        </div>
      </main>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Failed to load problem.
      </div>
    );
  }

  return (
    <main className="flex h-screen w-full  text-white overflow-hidden">
      {/* LEFT */}
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
          description={[problem?.description?.text || ""]}
          examples={(problem.visibleTestCases || []).map((ex, i) => ({
            id: i + 1,
            input: ex.testCase,
            output: ex.output,
            explanation: ex.description,
          }))}
          hints={problem.hints || []}
          discussions={[]}
        />
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex flex-col flex-1 border-l border-gray-700 lg:w-1/2 overflow-y-hidden">
        <EditorPanel
          // PASS THE FULL ARRAY instead of just one string
          boilerplates={problem.boilerplate || []}
        />
      </div>
    </main>
  );
}

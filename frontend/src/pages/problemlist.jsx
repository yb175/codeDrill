import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProblems, addProblem } from "../slice/problemSlice";
import LeftSidebar from "../components/leftSidebarProblem";
import TopBar from "../components/topBarProblems";
import ProblemsTable from "../components/problemsArea";
import RightPanel from "../components/rightPanelProblems";
import ProblemTableShimmer from "../components/problemShimmer";
import { fetchProblemSolved } from "../slice/authSlice";

export default function ProblemsPage() {
  const dispatch = useDispatch();

  const {
    data: problemsData,
    loading,
    number: totalCount,
  } = useSelector((s) => s.problem);

  const { user, loadingStates, profile } = useSelector((s) => s.auth);

  const problems = problemsData || [];

  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (!problemsData[page]) {
      dispatch(getProblems({ page, limit }));
    }
    if (!profile?.problemSolved) {
      dispatch(fetchProblemSolved());
    }
  }, [dispatch, page]);
  console.log(profile);
  const handleNewProblem = () => {
    const payload = {
      title: "Untitled Problem",
      description: { text: "", imgUrl: "" },
      problemTags: [],
      companyTags: [],
      hints: [],
      acceptanceRate: 0,
      visibleTestCases: [],
      hiddentestCases: [],
      boilerplate: [],
      refrenceSol: [],
      problemCreater: "",
      difficulty: "easy",
    };

    dispatch(addProblem(payload)).then(() => {
      dispatch(getProblems({ page: 1, limit }));
      setPage(1);
    });
  };

  const solvedLoading = loadingStates?.solved === "loading";
  const solvedError = loadingStates?.solved === "error";

  return (
    <div
      className="flex h-screen text-neutral-200 mt-10 mb-8"
      style={{ background: "var(--bg)" }}
    >
      <LeftSidebar width={sidebarWidth} setWidth={setSidebarWidth} />

      <main className="flex-1 p-4">
        <TopBar onNew={handleNewProblem} />

        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-8 space-y-4">
            {/* Show shimmer while loading */}
            {(loading || solvedLoading) && <ProblemTableShimmer />}

            {/* Error alert if solved problems API fails */}
            {solvedError && (
              <div role="alert" className="alert alert-error shadow-lg">
                <span>Failed to load solved problems. Please try again.</span>
              </div>
            )}

            {/* Render actual table when all data is ready */}
            {!loading && !solvedLoading && !solvedError && (
              <ProblemsTable
                problems={problems}
                loading={loading}
                page={page}
                limit={limit}
                total={totalCount}
                solvedProblems={profile?.problemSolved || []}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </div>

          <div className="col-span-4">
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

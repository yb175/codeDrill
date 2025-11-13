// src/pages/EditProblemPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { fetchProblem, resetProblemData } from "../../slice/problemSlice";

import ProblemDetailsForm from "../../components/problemDetails";
import SolutionEditor from "../../components/solutionEditor";
import ExecutionOutput from "../../components/executionOutput";
import PageActions from "../../components/pageAction";
import EditProblemSkeleton from "./editProblemSkeleton";

export default function EditProblemPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { loading, addProblemData, error } = useSelector(
    (state) => state.problem
  );

  // Fetch problem when page loads
  useEffect(() => {
    dispatch(resetProblemData());     // clear old leftover data
    dispatch(fetchProblem(id));       // fetch data for this problem
  }, [dispatch, id]);

  return (
    <div className="min-h-screen p-8 text-base-content mt-10">

      {/* Loading State */}
      {loading ? (
        <EditProblemSkeleton />
      ) : error ? (
        <div className="text-center text-red-400 py-20">
          Failed to fetch problem. Try again.
        </div>
      ) : (
        <>
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left column */}
            <div className="flex flex-col gap-6">
              <ProblemDetailsForm />
              <PageActions isEditMode={true} />
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">
              <SolutionEditor />
              <ExecutionOutput />
            </div>
          </div>

          {/* Extra space for floating actions */}
          <div className="pb-24"></div>
        </>
      )}
    </div>
  );
}

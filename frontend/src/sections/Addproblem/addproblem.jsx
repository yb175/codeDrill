// src/pages/AddProblemPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { resetProblemData } from "../../slice/problemSlice";

import ProblemDetailsForm from "../../components/problemDetails";
import SolutionEditor from "../../components/solutionEditor";
import ExecutionOutput from "../../components/executionOutput";
import PageActions from "../../components/pageAction";

export default function AddProblemPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetProblemData());
  }, [dispatch]);

  return (
    <div className="min-h-screen p-8 text-base-content mt-10">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="flex flex-col gap-6">
          <ProblemDetailsForm />
          <PageActions isEditMode={false} />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6">
          <SolutionEditor />
          <ExecutionOutput isEditMode={false} />
        </div>

      </div>

      <div className="pb-24"></div>

    </div>
  );
}


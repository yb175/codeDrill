// src/components/AddProblemPage.jsx
import React from "react";
import ProblemDetailsForm from "../../components/problemDetails";
import SolutionEditor from "../../components/solutionEditor";
import ExecutionOutput from "../../components/executionOutput";
import PageActions from "../../components/pageAction";

export default function AddProblemPage() {
  return (
    <div className="min-h-screen p-8 text-base-content mt-10">
      {/* Main Page Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <ProblemDetailsForm />
          <PageActions isEditMode={false} />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <SolutionEditor />
          <ExecutionOutput isEditMode={false} />
        </div>
      </div>

      <div className="pb-24"></div>
    </div>
  );
}

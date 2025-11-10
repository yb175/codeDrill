// src/components/AddProblemPage.jsx
import React from 'react';
import ProblemDetailsForm from '../../components/problemDetails';
import SolutionEditor from '../../components/solutionEditor';
import ExecutionOutput from '../../components/executionOutput';
import PageActions from '../../components/pageAction';

export default function AddProblemPage() {
  return (
    // Set the theme for the whole page. 'night' is a dark theme from daisyUI.
    <div className=" min-h-screen p-8 text-base-content mt-10" >
       
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Form */}
        <div className="flex flex-col gap-6">
          <ProblemDetailsForm />
           <PageActions />
        </div>

        {/* Right Column: Editor & Output */}
        <div className="flex flex-col gap-6">
          <SolutionEditor />
          <ExecutionOutput output={{ success: true, message: "All test cases passed." }} />
        </div>
      </div>


      {/* Add padding to the bottom to avoid content being hidden by the sticky PageActions footer */}
      <div className="pb-24"></div>
    </div>
  );
}
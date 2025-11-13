// src/components/EditProblemSkeleton.jsx
import React from "react";

export default function EditProblemSkeleton() {
  return (
    <div className="animate-pulse space-y-8">

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">

          {/* Problem Details Skeleton */}
          <div className="p-6 rounded-xl bg-base-200">
            <div className="h-6 w-1/3 bg-base-300 rounded mb-4"></div>
            <div className="h-4 w-full bg-base-300 rounded mb-2"></div>
            <div className="h-4 w-5/6 bg-base-300 rounded mb-2"></div>
            <div className="h-4 w-4/6 bg-base-300 rounded mb-2"></div>
            <div className="h-4 w-full bg-base-300 rounded mb-2"></div>
          </div>

          {/* Page Actions Skeleton */}
          <div className="p-4 rounded-xl bg-base-200 flex gap-3">
            <div className="h-10 w-24 rounded bg-base-300"></div>
            <div className="h-10 w-24 rounded bg-base-300"></div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">

          {/* Solution Editor Skeleton */}
          <div className="p-4 rounded-xl bg-base-200">
            <div className="h-6 w-1/3 bg-base-300 rounded mb-4"></div>
            <div className="h-64 w-full bg-base-300 rounded"></div>
          </div>

          {/* Execution Output Skeleton */}
          <div className="p-4 rounded-xl bg-base-200">
            <div className="h-6 w-1/4 bg-base-300 rounded mb-4"></div>
            <div className="h-48 w-full bg-base-300 rounded"></div>
          </div>
        </div>

      </div>

      {/* Extra bottom spacing */}
      <div className="pb-24"></div>
    </div>
  );
}

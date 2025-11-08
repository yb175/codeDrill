import React, { useEffect } from "react";
import { LayoutDashboard } from "lucide-react";
import Stats from "../sections/Admin/stats";
import ProblemsSection from "../sections/Admin/problems";
import { useDispatch } from "react-redux";
import { getProblems } from "../slice/problemSlice";
import { useSelector } from "react-redux";
export default function Admin() {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen p-6 sm:p-20 text-neutral-100 font-inter">
      <div className="max-w-7xl mx-auto">
        
        {/* Only Problem Count Needed */}
        <Stats />

        {/* Problems Table / JSON Validator / etc */}
        <ProblemsSection />
      </div>
    </div>
  );
}
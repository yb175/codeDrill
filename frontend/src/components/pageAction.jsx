import React, { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addProblem, editProblem } from "../slice/problemSlice";
import ErrorToast from "../assets/errorToast";

export default function PageActions({ isEditMode = false }) {
  const dispatch = useDispatch();
  const { addProblemData, loading } = useSelector((state) => state.problem);

  const [toastMessage, setToastMessage] = useState("");

  const handlePublish = async () => {
    if (!addProblemData || Object.keys(addProblemData).length === 0) {
      setToastMessage("Form is empty!");
      return;
    }

    const requiredFields = ["title", "description", "difficulty","visibleTestCases", "boilerplate"];
    const missing = requiredFields.filter((f) => !addProblemData[f]);

    if (missing.length > 0) {
      setToastMessage(`Missing: ${missing.join(", ")}`);
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(editProblem(addProblemData)).unwrap();
        setToastMessage("Problem updated successfully!");
      } else {
        await dispatch(addProblem(addProblemData)).unwrap();
        setToastMessage("Problem created successfully!");
      }
    } catch (err) {
      setToastMessage(err?.message || "Server error occurred");
    }
  };

  return (
    <>
      {/* TOAST MESSAGE */}
      {toastMessage && <ErrorToast message={toastMessage} />}

      <div className="flex justify-end mt-3 mb-2 px-3 py-2 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-4">

          {/* Save Status */}
          <div className="flex items-center gap-1 text-sm text-neutral-400">
            <Save size={15} className="opacity-70" />
            <span className="opacity-70">{loading ? "Saving..." : "Saved"}</span>
          </div>

          {/* Draft */}
          <button
            className="
              px-4 py-1.5 rounded-md text-sm
              border border-neutral-700/60 
              text-neutral-300 
              hover:bg-neutral-800/70 
              transition
            "
            onClick={() => setToastMessage("Draft feature coming soon!")}
          >
            Draft
          </button>

          {/* Validate */}
          <button
            className="
              px-4 py-1.5 rounded-md text-sm
              border border-blue-500/60 
              text-blue-300 
              hover:bg-blue-500/20 
              transition
            "
            onClick={() => {
              if (addProblemData.title && addProblemData.description?.text) {
                setToastMessage("Valid!");
              } else {
                setToastMessage("Invalid: Missing required fields");
              }
            }}
          >
            Validate
          </button>

          {/* Publish / Update */}
          <button
            onClick={handlePublish}
            disabled={loading}
            className={`
              flex items-center justify-center gap-2
              px-4 py-1.5 rounded-md text-sm
              bg-blue-600 text-white 
              hover:bg-blue-500 
              transition shadow relative
              ${loading ? "opacity-70 cursor-not-allowed" : ""}
            `}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                <div className="w-16 h-3 bg-blue-300/30 rounded animate-pulse"></div>
              </div>
            ) : (
              isEditMode ? "Update" : "Publish"
            )}
          </button>

        </div>
      </div>
    </>
  );
}

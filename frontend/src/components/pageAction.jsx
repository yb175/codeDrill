// src/components/PageActions.jsx
import React from "react";
import { Save, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addProblem } from "../slice/problemSlice";

export default function PageActions() {
  const dispatch = useDispatch();
  const { addProblemData, loading } = useSelector((state) => state.problem);

  // ✅ Publish Handler
  const handlePublish = async () => {
    if (!addProblemData || Object.keys(addProblemData).length === 0) {
      console.warn("⚠️ Please fill all problem details before publishing!");
      return;
    }

    const requiredFields = ["title", "description", "difficulty"];
    const missingFields = requiredFields.filter(
      (field) => !addProblemData[field]
    );

    if (missingFields.length > 0) {
      console.warn(`⚠️ Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    try {
      await dispatch(addProblem(addProblemData)).unwrap();
      console.log("✅ Problem published successfully!");
    } catch (err) {
      console.error("❌ Publish failed:", err);
    }
  };

  return (
    <div
      className="
      flex justify-end mt-3 mb-2 
      px-3 py-2
      rounded-lg
      backdrop-blur-sm
    "
    >
      <div className="flex items-center gap-4">
        {/* Save Status */}
        <div className="flex items-center gap-1 text-sm text-neutral-400">
          <Save size={15} className="opacity-70" />
          <span className="opacity-70">
            {loading ? "Saving..." : "Saved"}
          </span>
        </div>

        {/* Draft Button */}
        <button
          className="
          px-4 py-1.5 rounded-md text-sm
          border border-neutral-700/60 
          text-neutral-300 
          hover:bg-neutral-800/70 
          transition
        "
          onClick={() => console.log("📝 Draft feature coming soon (local save only)")}
        >
          Draft
        </button>

        {/* Validate Button */}
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
              console.log("✅ All required fields are filled!");
            } else {
              console.warn("❌ Please fill title and description first!");
            }
          }}
        >
          Validate
        </button>

        {/* Publish Button */}
        <button
          onClick={handlePublish}
          disabled={loading}
          className={`
          flex items-center justify-center gap-2
          px-4 py-1.5 rounded-md text-sm
          bg-blue-600 text-white 
          hover:bg-blue-500 
          transition shadow 
          ${loading ? "opacity-70 cursor-not-allowed" : ""}
        `}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}

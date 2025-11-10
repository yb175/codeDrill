// src/components/PageActions.jsx
import { Save } from "lucide-react";

export default function PageActions() {
  return (
    <div className="
      flex justify-end mt-3 mb-2 
      px-3 py-2
      rounded-lg
     
      backdrop-blur-sm
    ">

      <div className="flex items-center gap-4">

        {/* Save Status */}
        <div className="flex items-center gap-1 text-sm text-neutral-400">
          <Save size={15} className="opacity-70" />
          <span className="opacity-70">Saved</span>
        </div>

        {/* Buttons */}
        <button className="
          px-4 py-1.5 rounded-md text-sm
          border border-neutral-700/60 
          text-neutral-300 
          hover:bg-neutral-800/70 
          transition
        ">
          Draft
        </button>

        <button className="
          px-4 py-1.5 rounded-md text-sm
          border border-blue-500/60 
          text-blue-300 
          hover:bg-blue-500/20 
          transition
        ">
          Validate
        </button>

        <button className="
          px-4 py-1.5 rounded-md text-sm
          bg-blue-600 text-white 
          hover:bg-blue-500 
          transition shadow 
        ">
          Publish
        </button>

      </div>
    </div>
  );
}


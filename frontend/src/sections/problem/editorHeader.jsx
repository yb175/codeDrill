import React from "react";
import { Play, ChevronDown } from "lucide-react";

export default function EditorHeader({ language }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-700 p-2">

      <button className="flex items-center bg-gray-700/50 px-3 py-1.5 rounded-md text-white">
        <span>{language}</span>
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>

      <div className="flex items-center space-x-2">

        <button className="flex items-center bg-gray-700/50 px-3 py-1.5 rounded-md text-gray-300 hover:bg-gray-700">
          <Play className="h-4 w-4" />
          <span className="ml-1">Run</span>
        </button>

        <button className="bg-green-600 px-3 py-1.5 rounded-md text-white font-medium hover:bg-green-700">
          Submit
        </button>

      </div>
    </div>
  );
}

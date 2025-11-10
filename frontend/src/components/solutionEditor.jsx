import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";

export default function SolutionEditor() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(
`class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your solution here`
  );

  const getLangExt = () => {
    switch (language) {
      case "python": return python();
      case "javascript": return javascript();
      default: return python();
    }
  };

  return (
    <div className="rounded-xl shadow-xl border border-neutral-700/60 bg-base-200/40 overflow-hidden">

      <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-700/60 bg-base-300/40">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>

          <h2 className="ml-3 text-lg font-semibold tracking-wide">
            Solution Editor
          </h2>
        </div>

        <select
          className="select select-sm select-bordered bg-base-100 border-neutral-600/60 text-sm"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="python">Python3</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      <CodeMirror
        value={code}
        onChange={(val) => setCode(val)}
        theme={dracula}
        height="300px"
        extensions={[getLangExt()]}
      />
    </div>
  );
}

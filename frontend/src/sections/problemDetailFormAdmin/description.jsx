import { useState } from "react";
import AccordionItem from "../../assets/AccordationItem";
import { Eye, Edit3, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ProblemDescription() {
  const [description, setDescription] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <AccordionItem title="Description" defaultOpen={true}>
      <div
        className="relative group p-4 rounded-2xl 
                   bg-gradient-to-br from-base-100/30 to-neutral-900/30 
                   backdrop-blur-md border border-white/10 shadow-lg transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles
              size={18}
              className="text-purple-400/60 group-hover:text-purple-300 transition-all duration-300"
            />
            <h2 className="text-sm font-semibold text-neutral-200 tracking-wide">
              Problem Description
              <span className="ml-2 text-xs text-neutral-500">
                (Markdown Supported)
              </span>
            </h2>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium 
            border border-neutral-700/60 transition-all duration-300 
            ${
              previewMode
                ? "bg-gradient-to-r from-purple-600/60 to-pink-600/60 text-white shadow-md"
                : "text-neutral-300 hover:text-white bg-base-100/30 hover:bg-base-100/50"
            }`}
          >
            {previewMode ? <Edit3 size={16} /> : <Eye size={16} />}
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </button>
        </div>

        {/* Editor / Preview Area */}
        <div className="relative">
          {!previewMode ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your problem description, constraints, and examples..."
              className="w-full min-h-[220px] px-4 py-3 rounded-xl resize-none
                        bg-white/5 backdrop-blur-lg border border-white/10 
                        text-neutral-200 text-sm leading-relaxed shadow-inner
                        focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20
                        placeholder:text-neutral-500 transition-all duration-300"
            />
          ) : (
            <div
              className="p-5 min-h-[220px] rounded-xl bg-white/5 border border-white/10 
                         text-neutral-200 text-sm leading-relaxed 
                         prose prose-invert max-w-none 
                         prose-p:my-2 prose-headings:text-white prose-strong:text-purple-300 
                         prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:rounded prose-code:text-purple-400
                         prose-li:marker:text-purple-400"
            >
              {description ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {description}
                </ReactMarkdown>
              ) : (
                <p className="text-neutral-500 italic text-sm">
                  Nothing to preview yet — start typing in Markdown ✍️
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </AccordionItem>
  );
}

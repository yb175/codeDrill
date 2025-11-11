import AccordionItem from "../../assets/AccordationItem";
import { Eye, Edit3, Sparkles, Image } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDispatch, useSelector } from "react-redux";
import { updateNestedProblemData, updateProblemData } from "../../slice/problemSlice";

export default function ProblemDescription() {
  const dispatch = useDispatch();

  // 🧠 Redux data
  const description = useSelector((state) => state.problem.addProblemData.description) || {
    text: "",
    imgUrl: "",
  };

  const { text, imgUrl } = description;
  const previewMode = useSelector((state) => state.problem.addProblemData.previewMode) || false;

  // 🪄 Helper to update nested description fields - USING NEW ACTION
  const updateDescription = (field, value) => {
    dispatch(
      updateNestedProblemData({
        parentKey: "description",
        childKey: field,
        value: value,
      })
    );
  };

  // Toggle preview mode - USING NEW ACTION
  const togglePreview = () => {
    dispatch(
      updateProblemData({
        key: "previewMode",
        value: !previewMode,
      })
    );
  };

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
            onClick={togglePreview}
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
        <div className="relative space-y-4">
          {!previewMode ? (
            <>
              <textarea
                value={text || ""}
                onChange={(e) => updateDescription("text", e.target.value)}
                placeholder="Write your problem description, constraints, and examples..."
                className="w-full min-h-[220px] px-4 py-3 rounded-xl resize-none
                          bg-white/5 backdrop-blur-lg border border-white/10 
                          text-neutral-200 text-sm leading-relaxed shadow-inner
                          focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20
                          placeholder:text-neutral-500 transition-all duration-300"
              />

              {/* Image URL Field */}
              <div className="flex items-center gap-3">
                <Image className="w-4 h-4 text-purple-400/70" />
                <input
                  type="text"
                  placeholder="Image URL (optional)"
                  value={imgUrl || ""}
                  onChange={(e) => updateDescription("imgUrl", e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg bg-base-100/40 border border-neutral-700/60
                             focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20
                             text-neutral-200 placeholder:text-neutral-500 transition"
                />
              </div>
            </>
          ) : (
            <div
              className="p-5 min-h-[220px] rounded-xl bg-white/5 border border-white/10 
                         text-neutral-200 text-sm leading-relaxed 
                         prose prose-invert max-w-none 
                         prose-p:my-2 prose-headings:text-white prose-strong:text-purple-300 
                         prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:rounded prose-code:text-purple-400
                         prose-li:marker:text-purple-400"
            >
              {text ? (
                <>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {text}
                  </ReactMarkdown>
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt="Problem illustration"
                      className="rounded-lg mt-4 border border-neutral-700/60 shadow-md"
                    />
                  )}
                </>
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

import AccordionItem from "../../assets/AccordationItem";
import { Eye, Edit3, Image as ImageIcon, FileText, TerminalSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDispatch, useSelector } from "react-redux";
import { updateNestedProblemData, updateProblemData } from "../../slice/problemSlice";
import { motion, AnimatePresence } from "framer-motion";

export default function ProblemDescription() {
  const dispatch = useDispatch();

  // 🧠 Redux data
  const description = useSelector((state) => state.problem.addProblemData.description) || {
    text: "",
    imgUrl: "",
  };

  const { text, imgUrl } = description;
  const previewMode = useSelector((state) => state.problem.addProblemData.previewMode) || false;

  // 🪄 Helper to update nested description fields
  const updateDescription = (field, value) => {
    dispatch(
      updateNestedProblemData({
        parentKey: "description",
        childKey: field,
        value: value,
      })
    );
  };

  // Toggle preview mode
  const togglePreview = () => {
    dispatch(updateProblemData({ key: "previewMode", value: !previewMode }));
  };

  return (
    <AccordionItem title="Description" defaultOpen={true}>
      <div className="relative group rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md overflow-hidden transition-all hover:border-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
        
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />

        {/* --- HEADER --- */}
        <div className="flex items-center justify-between px-5 py-4 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-blue-500/10 border border-blue-500/20">
              <TerminalSquare size={16} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
                Problem Statement
              </h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                Markdown Supported
              </p>
            </div>
          </div>

          {/* Techy Toggle Switch */}
          <button
            onClick={togglePreview}
            className="relative flex items-center bg-black/40 rounded-lg p-1 border border-white/5 h-9"
          >
            <div
              className={`absolute inset-y-1 w-1/2 rounded-md bg-blue-600 shadow-lg transition-all duration-300 ease-out ${
                previewMode ? "left-[calc(50%-2px)] translate-x-[2px]" : "left-1"
              }`}
            />
            <span
              className={`relative z-10 flex items-center gap-2 px-3 text-xs font-medium transition-colors duration-300 ${
                !previewMode ? "text-white" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Edit3 size={12} />
              Editor
            </span>
            <span
              className={`relative z-10 flex items-center gap-2 px-3 text-xs font-medium transition-colors duration-300 ${
                previewMode ? "text-white" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Eye size={12} />
              Preview
            </span>
          </button>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="p-5 relative min-h-[300px]">
          <AnimatePresence mode="wait">
            {!previewMode ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 h-full flex flex-col"
              >
                {/* Textarea */}
                <div className="relative flex-1 group/input">
                  <textarea
                    value={text || ""}
                    onChange={(e) => updateDescription("text", e.target.value)}
                    placeholder="# Problem Title&#10;&#10;Describe the problem here...&#10;- Use Markdown&#10;- Be creative"
                    className="w-full h-64 px-4 py-4 rounded-xl resize-none
                             bg-[#0a0a0c] border border-white/10 
                             text-slate-300 font-mono text-sm leading-relaxed
                             focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20
                             placeholder:text-slate-600 transition-all duration-300
                             scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700/50 scrollbar-thumb-rounded-full"
                  />
                  {/* Subtle 'Markdown' Badge inside textarea */}
                  <div className="absolute bottom-3 right-3 pointer-events-none opacity-20 group-focus-within/input:opacity-50 transition-opacity">
                    <FileText size={40} />
                  </div>
                </div>

                {/* Image Input */}
                <div className="relative group/img">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-4 w-4 text-slate-500 group-focus-within/img:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Paste an image URL here for diagrams..."
                    value={imgUrl || ""}
                    onChange={(e) => updateDescription("imgUrl", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0a0a0c] border border-white/10
                             text-sm text-slate-300 placeholder:text-slate-600
                             focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20
                             transition-all duration-300"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full rounded-xl bg-[#0a0a0c]/50 border border-white/5 p-6 overflow-hidden"
              >
                <div className="prose prose-invert prose-sm max-w-none
                              prose-headings:text-slate-100 prose-headings:font-semibold
                              prose-p:text-slate-400 prose-p:leading-7
                              prose-strong:text-blue-400
                              prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-blue-300 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                              prose-ul:marker:text-blue-500
                              prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-img:shadow-lg"
                >
                  {text ? (
                    <>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {text}
                      </ReactMarkdown>
                      {imgUrl && (
                        <div className="mt-6 relative group overflow-hidden rounded-xl border border-white/10">
                           <img
                            src={imgUrl}
                            alt="Problem illustration"
                            className="w-full h-auto object-cover opacity-90 transition-opacity hover:opacity-100"
                           />
                           <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              Reference Image
                           </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-600">
                      <FileText size={32} className="mb-3 opacity-20" />
                      <p className="text-sm italic">Nothing to preview yet.</p>
                      <button onClick={togglePreview} className="text-xs text-blue-500 hover:underline mt-1">Switch to Editor</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Status Bar */}
        <div className="bg-black/20 border-t border-white/5 px-4 py-2 flex items-center justify-end gap-3">
             <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${text.length > 0 ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" : "bg-slate-600"}`} />
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {text.length > 0 ? "Content Active" : "Empty"}
                </span>
             </div>
             <div className="h-3 w-[1px] bg-white/10" />
             <span className="text-[10px] font-mono text-slate-500">
                {text.length} chars
             </span>
        </div>

      </div>
    </AccordionItem>
  );
}
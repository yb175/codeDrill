import React, { useState } from "react";
import { createPortal } from "react-dom";
import AccordionItem from "../../assets/AccordationItem";
import {
  Plus,
  Trash2,
  Terminal,
  Eye,
  EyeOff,
  Cpu,
  Save,
  MonitorPlay,
  X,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToArray,
  removeFromArray,
  updateArrayItem,
} from "../../slice/problemSlice";
import { motion, AnimatePresence } from "framer-motion";

/* ==================================================================================
   1. TECHY "SIDE DRAWER" (FIXED WITH PORTAL)
   ================================================================================== */
const HiddenCaseDrawer = ({ isOpen, onClose, onSave }) => {
  const [inputVal, setInputVal] = useState("");
  const [outputVal, setOutputVal] = useState("");

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end isolate">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />

      {/* Slide-in Drawer */}
      <motion.div 
        initial={{ x: "100%" }} 
        animate={{ x: 0 }} 
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative z-10 h-full w-full md:w-1/2 bg-[#0f0f11] border-l border-purple-500/20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
      >
        
        {/* --- Header --- */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Cpu className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                   Hidden Edge Case
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">
                   Configure private validation tests
                </p>
              </div>
           </div>
           <button 
             onClick={onClose} 
             className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
           >
              <X size={20} />
           </button>
        </div>

        {/* --- Scrollable Body --- */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
           
           {/* Input Field */}
           <div className="space-y-3 group">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-500 flex items-center gap-2 group-focus-within:text-purple-400 transition-colors">
                 <Terminal size={14} /> Input Stream
              </label>
              <div className="relative">
                <textarea
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="e.g. [1, 5, 10], target=5"
                    className="w-full h-40 bg-[#050505] border border-white/10 rounded-xl p-4 text-sm font-mono text-purple-300 placeholder:text-slate-700 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none shadow-inner"
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-slate-700 font-mono">STDIN</div>
              </div>
           </div>

           {/* Output Field */}
           <div className="space-y-3 group">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-500 flex items-center gap-2 group-focus-within:text-green-400 transition-colors">
                 <MonitorPlay size={14} /> Expected Output
              </label>
              <div className="relative">
                <textarea
                    value={outputVal}
                    onChange={(e) => setOutputVal(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full h-32 bg-[#050505] border border-white/10 rounded-xl p-4 text-sm font-mono text-green-400 placeholder:text-slate-700 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all resize-none shadow-inner"
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-slate-700 font-mono">STDOUT</div>
              </div>
           </div>

           {/* Info Box */}
           <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 text-xs text-blue-300/80 leading-relaxed">
              <strong>Note:</strong> Hidden cases are used to validate submissions but are not shown to users unless they have "Reveal Solutions" privileges or after the contest ends.
           </div>

        </div>

        {/* --- Footer --- */}
        <div className="px-8 py-5 border-t border-white/5 bg-[#0a0a0c] flex justify-between items-center">
           <button 
             onClick={onClose}
             className="text-xs font-medium text-slate-500 hover:text-white transition-colors"
           >
             Discard Changes
           </button>
           <button 
             onClick={() => {
                onSave({ testCase: inputVal, output: outputVal });
                setInputVal("");
                setOutputVal("");
                onClose();
             }}
             className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wide rounded-lg shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
           >
             <Save size={16} /> Save Case
           </button>
        </div>

      </motion.div>
    </div>,
    document.body
  );
};


/* ==================================================================================
   2. MAIN COMPONENT
   ================================================================================== */
export default function TestCasesSection() {
  const dispatch = useDispatch();
  const { visibleTestCases = [], hiddentestCases = [] } = useSelector(
    (state) => state.problem.addProblemData
  );
  console.log(visibleTestCases, hiddentestCases);
  const [hiddenDrawerOpen, setHiddenDrawerOpen] = useState(false);

  // --- ACTIONS ---

  const handleAddVisible = () => {
    dispatch(
      addToArray({
        arrayKey: "visibleTestCases",
        item: {
          testCase: "",
          output: "",
          description: "",
          imgUrl: "",
          open: true,
        },
      })
    );
  };

  const handleAddHidden = (data) => {
    dispatch(
      addToArray({
        arrayKey: "hiddentestCases",
        item: {
          ...data,
          description: "Hidden Edge Case",
          imgUrl: "",
          open: false,
        },
      })
    );
  };

  const handleRemove = (arrayKey, index) => {
    dispatch(removeFromArray({ arrayKey, index }));
  };

  const handleChangeVisible = (index, field, value) => {
    dispatch(
      updateArrayItem({
        arrayKey: "visibleTestCases",
        index,
        updates: { [field]: typeof value === "string" ? value : String(value ?? "") },
      })
    );
  };

  const toggleAccordion = (index) => {
    dispatch(
      updateArrayItem({
        arrayKey: "visibleTestCases",
        index,
        updates: { open: !visibleTestCases[index]?.open },
      })
    );
  };

  return (
    <AccordionItem title="Test Cases" defaultOpen={true}>
      <div className="space-y-6">
        
        {/* =======================
            SECTION 1: HIDDEN CASES (SUMMARY CARD)
            ======================= */}
        <div className="relative group rounded-xl border border-dashed border-purple-500/20 bg-purple-900/5 hover:bg-purple-900/10 transition-colors p-1">
           {/* Section Label */}
           <div className="absolute -top-3 left-4 px-2 bg-[#09090b] text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2 border border-purple-500/20 rounded-full">
              <EyeOff size={10} /> Hidden / Edge Cases
           </div>

           <div className="p-4">
              {/* List of Hidden Cases */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-4">
                 <AnimatePresence>
                 {hiddentestCases.map((tc, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#0f0f11] border border-white/5 group/item hover:border-purple-500/30 transition-all"
                    >
                       <div className="flex flex-col gap-1 overflow-hidden">
                          <div className="flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                             <span className="text-[10px] text-slate-500 font-mono">Case #{i + 1}</span>
                          </div>
                          <code className="text-xs text-slate-300 truncate font-mono bg-black/20 px-1 rounded">
                             In: {tc.testCase.slice(0, 15)}{tc.testCase.length > 15 && "..."}
                          </code>
                       </div>
                       <button 
                         onClick={() => handleRemove("hiddentestCases", i)}
                         className="p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover/item:opacity-100"
                       >
                          <Trash2 size={14} />
                       </button>
                    </motion.div>
                 ))}
                 </AnimatePresence>
                 
                 {/* Add Button */}
                 <button
                    onClick={() => setHiddenDrawerOpen(true)}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border border-white/5 bg-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 text-slate-400 hover:text-purple-300 transition-all gap-2 min-h-[80px]"
                 >
                    <Plus size={20} />
                    <span className="text-xs font-medium">Add Hidden Case</span>
                 </button>
              </div>
           </div>
        </div>


        {/* =======================
            SECTION 2: VISIBLE CASES (FULL INPUT/OUTPUT LIST)
            ======================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Eye size={16} className="text-blue-400" />
                Public Test Cases
             </h3>
             <button
               onClick={handleAddVisible}
               className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all"
             >
               <Plus size={14} /> Add New
             </button>
          </div>

          <div className="space-y-3">
             <AnimatePresence>
             {visibleTestCases.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-white/5 bg-[#0f0f11] overflow-hidden transition-all hover:border-blue-500/20"
                >
                   {/* Card Header */}
                   <div 
                      className="flex justify-between items-center px-4 py-3 cursor-pointer bg-white/[0.02] hover:bg-white/[0.04]"
                      onClick={() => toggleAccordion(i)}
                   >
                      <div className="flex items-center gap-3">
                         <div className={`p-1.5 rounded-md ${t.open ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-500"}`}>
                            <Terminal size={14} />
                         </div>
                         <span className="text-sm text-slate-300 font-medium">
                            {t.description || `Test Case ${i + 1}`}
                         </span>
                      </div>

                      <div className="flex items-center gap-2">
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleRemove("visibleTestCases", i); }}
                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                         >
                            <Trash2 size={14} />
                         </button>
                         {t.open ? <ChevronDown size={16} className="text-slate-500"/> : <ChevronRight size={16} className="text-slate-500"/>}
                      </div>
                   </div>

                   {/* Card Body (Input, Output, Description) */}
                   {t.open && (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5">
                         
                         {/* Input Area */}
                         <div className="space-y-2">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Input</label>
                            <textarea
                               placeholder="10 40"
                               value={t.testCase}
                               onChange={(e) => handleChangeVisible(i, "testCase", e.target.value)}
                               className="w-full h-20 bg-[#050505] border border-white/10 rounded-lg p-3 text-sm font-mono text-blue-200 focus:outline-none focus:border-blue-500/30 transition-all resize-none"
                            />
                         </div>

                         {/* Output Area */}
                         <div className="space-y-2">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Expected Output</label>
                            <textarea
                               placeholder="50"
                               value={t.output}
                               onChange={(e) => handleChangeVisible(i, "output", e.target.value)}
                               className="w-full h-20 bg-[#050505] border border-white/10 rounded-lg p-3 text-sm font-mono text-green-300 focus:outline-none focus:border-green-500/30 transition-all resize-none"
                            />
                         </div>

                         {/* Description Area (Full Width) */}
                         <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Explanation / Description</label>
                            <input
                               type="text"
                               placeholder="Explain the logic behind this case..."
                               value={t.description}
                               onChange={(e) => handleChangeVisible(i, "description", e.target.value)}
                               className="w-full h-10 bg-[#050505] border border-white/10 rounded-lg px-3 text-sm text-slate-400 focus:outline-none focus:border-blue-500/30 transition-all"
                            />
                         </div>
                      </div>
                   )}
                </motion.div>
             ))}
             </AnimatePresence>
          </div>
        </div>

      </div>

      {/* RENDER THE SIDE DRAWER (PORTALED) */}
      <AnimatePresence>
        {hiddenDrawerOpen && (
           <HiddenCaseDrawer 
             isOpen={hiddenDrawerOpen} 
             onClose={() => setHiddenDrawerOpen(false)} 
             onSave={handleAddHidden}
           />
        )}
      </AnimatePresence>

    </AccordionItem>
  );
}
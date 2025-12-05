import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFunctionSignature } from "../../slice/problemSlice";
import AccordionItem from "../../assets/AccordationItem";
import { 
  Plus, 
  Trash2, 
  FunctionSquare, 
  ArrowRight, 
  Type, 
  Variable 
} from "lucide-react";

// Default object
const defaultFunctionSignature = {
  functionName: "",
  returnType: "",
  inputs: []
};

export default function BoilerplateSection() {
  const dispatch = useDispatch();

  // SAFE SELECTOR
  const functionSignature = useSelector((state) => {
    return (
      state.problem?.addProblemData?.boilerplate?.functionSignature ||
      defaultFunctionSignature
    );
  });

  // MEMOIZED VALUES
  const safeInputs = useMemo(
    () => functionSignature.inputs || [],
    [functionSignature.inputs]
  );

  const safeFunctionName = useMemo(
    () => functionSignature.functionName || "",
    [functionSignature.functionName]
  );

  const safeReturnType = useMemo(
    () => functionSignature.returnType || "",
    [functionSignature.returnType]
  );

  // --- HANDLERS ---
  const handleUpdate = (updates) => {
    dispatch(updateFunctionSignature(updates));
  };

  const handleFieldChange = (field, value) => {
    handleUpdate({ [field]: value });
  };

  const handleAddInput = () => {
    const newInputs = [...safeInputs, { name: "", type: "" }];
    handleUpdate({ inputs: newInputs });
  };

  const handleRemoveInput = (index) => {
    const newInputs = safeInputs.filter((_, i) => i !== index);
    handleUpdate({ inputs: newInputs });
  };

  const handleInputChange = (index, field, value) => {
    const newInputs = safeInputs.map((input, i) => {
      if (i === index) {
        return { ...input, [field]: value };
      }
      return input;
    });
    handleUpdate({ inputs: newInputs });
  };

  return (
    <AccordionItem title="Function Signature (Boilerplate)" defaultOpen={true}>
      <div className="space-y-6">
        
        {/* Top Row: Function Name & Return Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Function Name */}
          <div className="group">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Function Name
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-blue-400">
                <FunctionSquare size={16} />
              </div>
              <input
                type="text"
                value={safeFunctionName}
                onChange={(e) => handleFieldChange("functionName", e.target.value)}
                className="w-full bg-slate-950/50 text-blue-100 font-mono text-sm pl-10 pr-3 py-2.5 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-slate-700"
                placeholder="twoSum"
              />
            </div>
          </div>

          {/* Return Type */}
          <div className="group">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Return Type
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-purple-400">
                <ArrowRight size={16} />
              </div>
              <input
                type="text"
                value={safeReturnType}
                onChange={(e) => handleFieldChange("returnType", e.target.value)}
                className="w-full bg-slate-950/50 text-purple-200 font-mono text-sm pl-10 pr-3 py-2.5 rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 focus:outline-none transition-all placeholder:text-slate-700"
                placeholder="int[]"
              />
            </div>
          </div>
        </div>

        {/* Inputs Section divider */}
        <div className="border-t border-slate-800/50 my-2" />

        {/* Inputs List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <span className="text-sm font-medium text-slate-300">Parameters</span>
               <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 font-mono">
                  {safeInputs.length}
               </span>
            </div>
            <button
              type="button"
              onClick={handleAddInput}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors border border-blue-500/20"
            >
              <Plus size={14} />
              Add Parameter
            </button>
          </div>

          <div className="space-y-2">
            {safeInputs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 border border-dashed border-slate-800 rounded-lg bg-slate-900/20">
                <Variable className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-sm text-slate-500">No parameters defined</p>
                <p className="text-xs text-slate-600">Click add to define inputs</p>
              </div>
            ) : (
              safeInputs.map((input, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-2 p-2 rounded-lg bg-slate-900/30 border border-transparent hover:border-slate-700 transition-colors"
                >
                  {/* Input Name */}
                  <div className="flex-1 relative">
                    <div className="absolute top-2.5 left-3 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                      <Variable size={14} />
                    </div>
                    <input
                      type="text"
                      value={input?.name || ""}
                      onChange={(e) => handleInputChange(index, "name", e.target.value)}
                      placeholder="varName"
                      className="w-full bg-slate-950 text-slate-200 font-mono text-sm pl-9 pr-3 py-2 rounded border border-slate-800 focus:border-blue-500/40 focus:outline-none placeholder:text-slate-700"
                    />
                    <span className="absolute -top-2 left-2 px-1 bg-slate-900 text-[10px] text-slate-500">Name</span>
                  </div>

                  {/* Input Type */}
                  <div className="flex-1 relative">
                    <div className="absolute top-2.5 left-3 text-slate-500 group-focus-within:text-purple-400 transition-colors">
                      <Type size={14} />
                    </div>
                    <input
                      type="text"
                      value={input?.type || ""}
                      onChange={(e) => handleInputChange(index, "type", e.target.value)}
                      placeholder="type"
                      className="w-full bg-slate-950 text-purple-300 font-mono text-sm pl-9 pr-3 py-2 rounded border border-slate-800 focus:border-purple-500/40 focus:outline-none placeholder:text-slate-700"
                    />
                    <span className="absolute -top-2 left-2 px-1 bg-slate-900 text-[10px] text-slate-500">Type</span>
                  </div>

                  {/* Delete Action */}
                  <button
                    type="button"
                    onClick={() => handleRemoveInput(index)}
                    className="mt-1 p-2 rounded text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Remove parameter"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AccordionItem>
  );
}
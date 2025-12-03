import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateNestedProblemData } from "../../slice/problemSlice";
import AccordionItem from "../../assets/AccordationItem";
import { Plus, Trash } from "lucide-react";

// Default object outside component to avoid recreation
const defaultFunctionSignature = {
  functionName: "",
  returnType: "",
  inputs: []
};

export default function BoilerplateSection() {
  const dispatch = useDispatch();
  
  // FIXED: Memoized selector
  const functionSignature = useSelector((state) => {
    return state.problem?.addProblemData?.boilerplate?.functionSignature || defaultFunctionSignature;
  });
  
  // Optional: Memoize derived values
  const safeInputs = useMemo(() => functionSignature.inputs || [], [functionSignature.inputs]);
  const safeFunctionName = useMemo(() => functionSignature.functionName || "", [functionSignature.functionName]);
  const safeReturnType = useMemo(() => functionSignature.returnType || "", [functionSignature.returnType]);

  // Update function signature field
  const updateFunctionSignatureField = (field, value) => {
    dispatch(
      updateNestedProblemData({
        parentKey: "boilerplate",
        childKey: "functionSignature",
        value: { 
          ...functionSignature, 
          [field]: value 
        },
      })
    );
  };

  // Update function inputs
  const updateFunctionInputs = (newInputs) => {
    dispatch(
      updateNestedProblemData({
        parentKey: "boilerplate",
        childKey: "functionSignature",
        value: { 
          ...functionSignature, 
          inputs: newInputs 
        },
      })
    );
  };

  // Handle function name change
  const handleFunctionNameChange = (e) => {
    updateFunctionSignatureField("functionName", e.target.value);
  };

  // Handle return type change
  const handleReturnTypeChange = (e) => {
    updateFunctionSignatureField("returnType", e.target.value);
  };

  // Handle adding new input
  const handleAddInput = () => {
    const newInputs = [
      ...safeInputs,
      { name: "", type: "" }
    ];
    updateFunctionInputs(newInputs);
  };

  // Handle removing input
  const handleRemoveInput = (index) => {
    const newInputs = safeInputs.filter((_, i) => i !== index);
    updateFunctionInputs(newInputs);
  };

  // Handle input field change
  const handleInputChange = (index, field, value) => {
    const newInputs = safeInputs.map((input, i) => {
      if (i === index) {
        return { ...input, [field]: value };
      }
      return input;
    });
    updateFunctionInputs(newInputs);
  };

  return (
    <AccordionItem title="Function Signature (Boilerplate)" defaultOpen={true}>
      <div className="space-y-4">
        {/* Function Name */}
        <div>
          <label className="block text-sm text-neutral-300 mb-1">
            Function Name
          </label>
          <input
            type="text"
            value={safeFunctionName}
            onChange={handleFunctionNameChange}
            className="w-full bg-neutral-900 text-neutral-100 px-3 py-2 rounded border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., twoSum"
          />
        </div>

        {/* Return Type */}
        <div>
          <label className="block text-sm text-neutral-300 mb-1">
            Return Type
          </label>
          <input
            type="text"
            value={safeReturnType}
            onChange={handleReturnTypeChange}
            className="w-full bg-neutral-900 text-neutral-100 px-3 py-2 rounded border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., int[], string, TreeNode"
          />
        </div>

        {/* Inputs Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-neutral-300 font-medium">Inputs</span>
            <button
              type="button"
              onClick={handleAddInput}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium"
            >
              <Plus size={16} />
              Add Input
            </button>
          </div>

          {/* Inputs List */}
          {safeInputs.length === 0 ? (
            <div className="text-center py-4 text-neutral-500 border border-neutral-700 rounded">
              No inputs added yet
            </div>
          ) : (
            safeInputs.map((input, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-neutral-900 border border-neutral-700 p-3 rounded"
              >
                <input
                  type="text"
                  value={input?.name || ""}
                  onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  placeholder="Name (e.g., nums)"
                  className="flex-1 bg-neutral-800 text-neutral-100 px-3 py-2 rounded border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={input?.type || ""}
                  onChange={(e) => handleInputChange(index, "type", e.target.value)}
                  placeholder="Type (e.g., int[], string)"
                  className="flex-1 bg-neutral-800 text-neutral-100 px-3 py-2 rounded border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveInput(index)}
                  className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-400/10"
                  title="Remove input"
                >
                  <Trash size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </AccordionItem>
  );
}
import { useState } from "react";
import AccordionItem from "../../assets/AccordationItem";
import { Upload, PlusCircle, Trash2, FileText, Info, ChevronDown, ChevronRight } from "lucide-react";

export default function TestCasesSection() {
  const [visibleTestCases, setVisibleTestCases] = useState([
    { testCase: "", output: "", description: "", imgUrl: "", open: true },
  ]);

  const [hiddenFile, setHiddenFile] = useState(null);

  const handleAddVisible = () => {
    setVisibleTestCases([
      ...visibleTestCases,
      { testCase: "", output: "", description: "", imgUrl: "", open: false },
    ]);
  };

  const handleRemoveVisible = (index) => {
    setVisibleTestCases(visibleTestCases.filter((_, i) => i !== index));
  };

  const handleChangeVisible = (index, field, value) => {
    const updated = [...visibleTestCases];
    updated[index][field] = value;
    setVisibleTestCases(updated);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setHiddenFile(file);
  };

  const toggleAccordion = (index) => {
    setVisibleTestCases((prev) =>
      prev.map((tc, i) =>
        i === index ? { ...tc, open: !tc.open } : tc
      )
    );
  };

  return (
    <AccordionItem title="Test Cases" defaultOpen={true}>
      <div className="space-y-8">
        
        {/* HIDDEN TEST CASE SECTION */}
        <div className="p-4 rounded-xl border border-neutral-700/60 bg-base-100/20 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-neutral-200 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" /> Hidden Test Cases
            </h3>
            <label className="text-xs text-neutral-500 flex items-center gap-1">
              <Info size={14} />
              <span>Upload a `.txt` file containing test inputs & outputs</span>
            </label>
          </div>

          {/* Upload Box */}
          <div className="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-700/60 rounded-lg py-10 hover:border-purple-400/50 transition">
            <Upload className="w-8 h-8 text-purple-400/70" />
            <p className="text-sm text-neutral-400">
              {hiddenFile ? hiddenFile.name : "Click or drag to upload file"}
            </p>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* Example format */}
          <div className="mt-3 text-xs text-neutral-500">
            Example format:
            <pre className="bg-neutral-900/60 rounded-md p-3 mt-2 text-[11px] text-neutral-400 font-mono whitespace-pre-wrap">
{`[
  { "testCase": "100 200", "output": "300" },
  { "testCase": "-10 5", "output": "-5" }
]`}
            </pre>
          </div>
        </div>

        {/* VISIBLE TEST CASE SECTION */}
        <div className="p-4 rounded-xl border border-neutral-700/60 bg-base-100/20 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-neutral-200 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-green-400" /> Visible Test Cases
            </h3>
            <button
              onClick={handleAddVisible}
              className="text-sm text-purple-400 hover:text-purple-300 transition"
            >
              + Add Test Case
            </button>
          </div>

          {/* Mini Accordions for each test case */}
          <div className="space-y-3">
            {visibleTestCases.map((t, i) => (
              <div
                key={i}
                className="rounded-lg border border-neutral-700/50 bg-neutral-900/30 backdrop-blur-sm transition hover:border-neutral-600/50"
              >
                {/* Accordion Header */}
                <button
                  className="w-full flex justify-between items-center px-4 py-3 text-sm text-neutral-200 font-medium focus:outline-none"
                  onClick={() => toggleAccordion(i)}
                >
                  <span className="flex items-center gap-2">
                    {t.description || `Test Case ${i + 1}`}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveVisible(i);
                      }}
                      className="text-neutral-500 hover:text-red-500 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                    {t.open ? (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                </button>

                {/* Accordion Body */}
                {t.open && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-neutral-400">Input</label>
                        <input
                          type="text"
                          placeholder="e.g., 2 3"
                          value={t.testCase}
                          onChange={(e) =>
                            handleChangeVisible(i, "testCase", e.target.value)
                          }
                          className="input input-bordered w-full bg-base-100/30 border-neutral-700/60 text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-neutral-400">Expected Output</label>
                        <input
                          type="text"
                          placeholder="e.g., 5"
                          value={t.output}
                          onChange={(e) =>
                            handleChangeVisible(i, "output", e.target.value)
                          }
                          className="input input-bordered w-full bg-base-100/30 border-neutral-700/60 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-neutral-400">Description</label>
                      <textarea
                        placeholder="Explain what this test case represents..."
                        value={t.description}
                        onChange={(e) =>
                          handleChangeVisible(i, "description", e.target.value)
                        }
                        className="textarea textarea-bordered w-full bg-base-100/30 border-neutral-700/60 text-sm min-h-[80px]"
                      ></textarea>
                    </div>

                    <div>
                      <label className="text-xs text-neutral-400">Image URL (optional)</label>
                      <input
                        type="text"
                        placeholder="https://example.com/image.png"
                        value={t.imgUrl}
                        onChange={(e) =>
                          handleChangeVisible(i, "imgUrl", e.target.value)
                        }
                        className="input input-bordered w-full bg-base-100/30 border-neutral-700/60 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AccordionItem>
  );
}

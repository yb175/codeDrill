import { useState } from "react";
import AccordionItem from "../../assets/AccordationItem";
import {
  Upload,
  PlusCircle,
  Trash2,
  FileText,
  Info,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToArray,
  removeFromArray,
  updateArrayItem,
} from "../../slice/problemSlice";

export default function TestCasesSection() {
  const dispatch = useDispatch();
  const { visibleTestCases = [], hiddentestCases = [] } = useSelector(
    (state) => state.problem.addProblemData
  );

  const [selectedLang, setSelectedLang] = useState("cpp");

  // Add empty test case (always string-based)
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

  const handleRemoveVisible = (index) => {
    dispatch(removeFromArray({ arrayKey: "visibleTestCases", index }));
  };

  // Ensure testCase/output remain STRINGS only
  const safeString = (value) =>
    typeof value === "string" ? value : String(value ?? "");

  const handleChangeVisible = (index, field, value) => {
    dispatch(
      updateArrayItem({
        arrayKey: "visibleTestCases",
        index,
        updates: { [field]: safeString(value) },
      })
    );
  };

  // Hidden test cases upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      const text = ev.target.result;

      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const parsed = [];

      for (let line of lines) {
        // Example: [1,2,3], 9, [0,2]
        const match = line.match(/^\s*(\[.*?\])\s*,\s*(.*)$/);

        if (!match) {
          console.warn("Invalid line:", line);
          continue;
        }

        parsed.push({
          testCase: match[1],
          output: match[2],
          description: "Imported",
          imgUrl: "",
          open: false,
        });
      }

      parsed.forEach((tc) =>
        dispatch(addToArray({ arrayKey: "hiddentestCases", item: tc }))
      );
    };

    reader.readAsText(file);
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

  const getPlaceholder = (field) => {
    if (field === "input") return "10 40";
    if (field === "output") return "50";
  };

  return (
    <AccordionItem title="Test Cases" defaultOpen={true}>
      <div className="space-y-8">
        {/* Hidden Test Cases */}
        <div className="p-4 rounded-xl border border-neutral-700/60 bg-base-100/20">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-neutral-200 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Hidden Test Cases
            </h3>
            <label className="text-xs text-neutral-500 flex items-center gap-1">
              <Info size={14} /> Upload .txt file
            </label>
          </div>

          <div className="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-700/60 rounded-lg py-10">
            <Upload className="w-8 h-8 text-purple-400/70" />
            <p className="text-sm text-neutral-400">Upload text file</p>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <pre className="bg-neutral-900/60 rounded-md p-3 mt-3 text-[11px] text-neutral-400">
{`[1 2], 3
[10 40], 50`}
          </pre>
        </div>

        {/* Visible Test Cases */}
        <div className="p-4 rounded-xl border border-neutral-700/60 bg-base-100/20">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-neutral-200 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-green-400" />
                Visible Test Cases
              </h3>

              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="select select-sm bg-base-100/20 border-neutral-600 text-sm"
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>

            <button
              onClick={handleAddVisible}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              + Add Test Case
            </button>
          </div>

          <div className="space-y-3">
            {visibleTestCases.map((t, i) => (
              <div
                key={i}
                className="rounded-lg border border-neutral-700/50 bg-neutral-900/30"
              >
                <div className="flex justify-between items-center px-4 py-3">
                  <span>{t.description || `Test Case ${i + 1}`}</span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAccordion(i)}
                      className="text-neutral-500 hover:text-blue-400"
                    >
                      {t.open ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleRemoveVisible(i)}
                      className="text-neutral-500 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {t.open && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-neutral-400">Input</label>
                        <input
                          type="text"
                          placeholder={getPlaceholder("input")}
                          value={safeString(t.testCase)}
                          onChange={(e) =>
                            handleChangeVisible(i, "testCase", e.target.value)
                          }
                          className="input input-bordered w-full bg-base-100/30"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-neutral-400">
                          Output
                        </label>
                        <input
                          type="text"
                          placeholder={getPlaceholder("output")}
                          value={safeString(t.output)}
                          onChange={(e) =>
                            handleChangeVisible(i, "output", e.target.value)
                          }
                          className="input input-bordered w-full bg-base-100/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-neutral-400">
                        Description
                      </label>
                      <textarea
                        placeholder="Explain this test case"
                        value={safeString(t.description)}
                        onChange={(e) =>
                          handleChangeVisible(i, "description", e.target.value)
                        }
                        className="textarea textarea-bordered w-full bg-base-100/30"
                      ></textarea>
                    </div>

                    <div>
                      <label className="text-xs text-neutral-400">
                        Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com"
                        value={safeString(t.imgUrl)}
                        onChange={(e) =>
                          handleChangeVisible(i, "imgUrl", e.target.value)
                        }
                        className="input input-bordered w-full bg-base-100/30"
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

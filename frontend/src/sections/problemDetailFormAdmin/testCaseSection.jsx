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
import { addToArray, removeFromArray, updateArrayItem } from "../../slice/problemSlice";

export default function TestCasesSection() {
  const dispatch = useDispatch();

  const { visibleTestCases = [], hiddentestCases = [] } = useSelector(
    (state) => state.problem.addProblemData
  );

  const [selectedLang, setSelectedLang] = useState("cpp");

  // Universal array handlers
  const handleAddVisible = () => {
    const newCase = {
      testCase: "",
      output: "",
      description: "",
      imgUrl: "",
      open: true,
    };
    dispatch(addToArray({ arrayKey: "visibleTestCases", item: newCase }));
  };

  const handleRemoveVisible = (index) => {
    dispatch(removeFromArray({ arrayKey: "visibleTestCases", index }));
  };

  const handleChangeVisible = (index, field, value) => {
    dispatch(updateArrayItem({ 
      arrayKey: "visibleTestCases", 
      index, 
      updates: { [field]: value } 
    }));
  };

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
      // Input and output MUST be separated by a comma
      const parts = line.split(",");

      if (parts.length < 2) {
        console.warn("Skipping invalid line (no comma found):", line);
        continue;
      }

      const input = parts[0].trim();
      const output = parts.slice(1).join(",").trim(); // support multiple commas safely

      parsed.push({
        testCase: input,
        output: output,
        description: "Imported from file",
        imgUrl: "",
        open: false,
      });
    }

    console.log("Parsed test cases:", parsed);

    parsed.forEach((tc) =>
      dispatch(addToArray({ arrayKey: "hiddentestCases", item: tc }))
    );
  };

  reader.readAsText(file);
};


  const toggleAccordion = (index) => {
    dispatch(updateArrayItem({ 
      arrayKey: "visibleTestCases", 
      index, 
      updates: { open: !visibleTestCases[index]?.open } 
    }));
  };

  const getPlaceholder = (field) => {
    if (field === "input") {
      switch (selectedLang) {
        case "cpp":
          return "e.g., 2 3 (cin >> a >> b)";
        case "python":
          return "e.g., 2 3 (input split by space)";
        case "javascript":
          return "e.g., '2 3' or [2,3]";
        default:
          return "Enter input values";
      }
    } else if (field === "output") {
      return selectedLang === "cpp"
        ? "e.g., 5 (cout << result)"
        : "e.g., 5 or [1,2]";
    }
  };

  return (
    <AccordionItem title="Test Cases" defaultOpen={true}>
      <div className="space-y-8">
        {/* Hidden Test Cases */}
        <div className="p-4 rounded-xl border border-neutral-700/60 bg-base-100/20 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-neutral-200 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" /> Hidden Test Cases
            </h3>
            <label className="text-xs text-neutral-500 flex items-center gap-1">
              <Info size={14} />
              <span>Upload `.txt` file with hidden test cases</span>
            </label>
          </div>

          <div className="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-700/60 rounded-lg py-10 hover:border-purple-400/50 transition">
            <Upload className="w-8 h-8 text-purple-400/70" />
            <p className="text-sm text-neutral-400">
              Click or drag to upload file
            </p>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

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

        {/* Visible Test Cases */}
        <div className="p-4 rounded-xl border border-neutral-700/60 bg-base-100/20 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-neutral-200 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-green-400" /> Visible Test Cases
              </h3>

              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="select select-bordered select-sm bg-base-100/20 border-neutral-600 text-sm text-neutral-300"
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>

            <button
              onClick={handleAddVisible}
              className="text-sm text-purple-400 hover:text-purple-300 transition"
            >
              + Add Test Case
            </button>
          </div>

          <div className="space-y-3">
            {visibleTestCases.map((t, i) => (
              <div
                key={i}
                className="rounded-lg border border-neutral-700/50 bg-neutral-900/30 backdrop-blur-sm transition hover:border-neutral-600/50"
              >
                <div className="w-full flex justify-between items-center px-4 py-3 text-sm text-neutral-200 font-medium">
                  <span>{t.description || `Test Case ${i + 1}`}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAccordion(i)}
                      className="text-neutral-500 hover:text-blue-400 transition"
                    >
                      {t.open ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleRemoveVisible(i)}
                      className="text-neutral-500 hover:text-red-500 transition"
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
                          value={t.testCase || ""}
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
                          placeholder={getPlaceholder("output")}
                          value={t.output || ""}
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
                        value={t.description || ""}
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
                        value={t.imgUrl || ""}
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
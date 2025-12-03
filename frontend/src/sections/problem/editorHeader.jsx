import React, { useState } from "react";
import { Play, ChevronDown, Settings, RotateCcw, Check } from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "cpp", label: "C++" },
  { id: "java", label: "Java" },
];

export default function EditorHeader({ language, setLanguage, onRun, onSubmit }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (langId) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-4 h-full select-none relative">
      
      {/* LANGUAGE DROPDOWN */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 text-gray-400 hover:text-gray-200 cursor-pointer transition px-2 py-1 rounded hover:bg-[#2d2d2d]"
          >
            <span className="text-xs capitalize w-16 text-left">
              {SUPPORTED_LANGUAGES.find((l) => l.id === language)?.label}
            </span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              <div className="absolute top-full left-0 mt-1 w-40 bg-[#1e1e1e] border border-[#333] rounded-md shadow-xl z-50 py-1">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageSelect(lang.id)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-[#2d2d2d]"
                  >
                    <span>{lang.label}</span>
                    {language === lang.id && (
                      <Check className="w-3 h-3 text-green-500" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT BUTTONS */}
      <div className="flex items-center space-x-3">
        <button className="p-1.5 text-gray-400 hover:bg-[#333] rounded-md transition">
          <Settings className="w-4 h-4" />
        </button>

        <button className="p-1.5 text-gray-400 hover:bg-[#333] rounded-md transition">
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* RUN / SUBMIT */}
        <div className="flex items-center bg-[#2d2d2d] rounded-md p-0.5">
          <button
            onClick={onRun}
            className="flex items-center gap-2 px-3 py-1 hover:bg-[#3e3e3e] text-gray-300 text-xs font-medium transition"
          >
            <Play className="w-3 h-3" />
            Run
          </button>

          <div className="w-[1px] h-4 bg-[#444]" />

          <button
            onClick={onSubmit}
            className="px-3 py-1 hover:bg-[#3e3e3e] text-green-500 text-xs font-medium transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

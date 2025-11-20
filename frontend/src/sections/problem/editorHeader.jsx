import React, { useState } from "react";
import { Play, ChevronDown, Settings, RotateCcw, Check } from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "cpp", label: "C++" },
  { id: "java", label: "Java" },
];

// Now accepts 'setLanguage' prop to update parent state
export default function EditorHeader({ language, setLanguage }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (langId) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-4 h-full select-none relative">
      
      {/* Left: Language Selector */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          {/* Trigger Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors px-2 py-1 rounded hover:bg-[#2d2d2d]"
          >
            <span className="text-xs font-medium capitalize w-16 text-left">
              {SUPPORTED_LANGUAGES.find(l => l.id === language)?.label || language}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              {/* Invisible backdrop to close on click outside */}
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              
              <div className="absolute top-full left-0 mt-1 w-40 bg-[#1e1e1e] border border-[#333] rounded-md shadow-xl z-50 py-1">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageSelect(lang.id)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-[#2d2d2d] transition-colors"
                  >
                    <span>{lang.label}</span>
                    {language === lang.id && <Check className="w-3 h-3 text-green-500" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-1">
           <span className="w-2 h-2 rounded-full bg-green-500"></span>
           <span>Auto</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        <button className="p-1.5 text-gray-400 hover:bg-[#333] rounded-md transition-colors">
          <Settings className="w-4 h-4" />
        </button>
        
        <button className="p-1.5 text-gray-400 hover:bg-[#333] rounded-md transition-colors">
           <RotateCcw className="w-4 h-4" />
        </button>

        {/* Run / Submit */}
        <div className="flex items-center bg-[#2d2d2d] rounded-md p-0.5">
            <button className="flex items-center gap-2 px-3 py-1 rounded hover:bg-[#3e3e3e] text-gray-300 text-xs font-medium transition-colors">
                <Play className="w-3 h-3 fill-current" />
                Run
            </button>
            <div className="w-[1px] h-4 bg-[#444]"></div>
            <button className="px-3 py-1 rounded hover:bg-[#3e3e3e] text-green-500 text-xs font-medium transition-colors">
                Submit
            </button>
        </div>
      </div>
    </div>
  );
}
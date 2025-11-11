// src/components/ExecutionOutput.jsx
import React from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useSelector } from "react-redux";

export default function ExecutionOutput() {
  const { loading, error } = useSelector((state) => state.problem);

  // Agar backend se koi specific success message aya ho
  const output = error
    ? { success: false, message: error.message || "Server error occurred" }
    : loading
    ? null
    : { success: true, message: "✅ Problem created successfully!" };

  const isSuccess = output?.success;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-neutral-700 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-bold text-purple-300 tracking-wide">
          Execution Output
        </h2>
      </div>

      {/* Output Box */}
      <div className="p-4 min-h-[110px] font-mono text-sm rounded-xl border border-neutral-700 bg-neutral-900/60 shadow-inner">
        {loading ? (
          // 🌀 Shimmer while loading
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-1/3 bg-neutral-700 rounded"></div>
            <div className="h-4 w-2/3 bg-neutral-700 rounded"></div>
            <div className="h-4 w-1/2 bg-neutral-700 rounded"></div>
          </div>
        ) : error ? (
          // ❌ Show error
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 drop-shadow-md"
          >
            ❌ {error.message || "Some test cases failed or server error"}
          </motion.p>
        ) : (
          // ✅ Show success
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 drop-shadow-md"
          >
            ✅ Problem created successfully!
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

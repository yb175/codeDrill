import React from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export default function ExecutionOutput({ output }) {
  const isSuccess = output?.success;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-neutral-700 shadow-xl"
    >
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-bold text-purple-300 tracking-wide">
          Execution Output
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 min-h-[110px] font-mono text-sm rounded-xl border border-neutral-700 bg-neutral-900/60 shadow-inner"
      >
        {isSuccess ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 drop-shadow-md"
          >
            ✅ {output.message}
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 drop-shadow-md"
          >
            ❌ {output.message}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

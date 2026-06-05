"use client";

import { motion, AnimatePresence } from "framer-motion";

type IslandMode = "idle" | "generating" | "success" | "error";

interface DynamicIslandProps {
  mode: IslandMode;
  errorMsg?: string;
}

export default function DynamicIsland({ mode, errorMsg }: DynamicIslandProps) {
  const isExpanded = mode !== "idle";
  const isErr = mode === "error";
  const isOk = mode === "success";

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className={`flex items-center justify-center gap-2 overflow-hidden rounded-full shadow-2xl ${
        isExpanded ? "px-5 py-2.5" : "px-6 py-1.5"
      } ${
        isErr
          ? "bg-black border border-red-500/40"
          : isOk
          ? "bg-black border border-emerald-500/40"
          : "bg-black border border-white/10"
      }`}
    >
      <AnimatePresence mode="wait">
        {mode === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] font-mono text-gray-500 tracking-[0.2em] uppercase select-none"
          >
            MPA Terminal
          </motion.span>
        )}
        {mode === "generating" && (
          <motion.span
            key="gen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-xs font-mono text-cyan-400"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            Streaming…
          </motion.span>
        )}
        {mode === "success" && (
          <motion.span
            key="ok"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs font-mono text-emerald-400"
          >
            ✓ Prompt Ready
          </motion.span>
        )}
        {mode === "error" && (
          <motion.span
            key="err"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs font-mono text-red-400 max-w-[200px] truncate"
          >
            ⚠ {errorMsg ?? "Error"}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface HistoryEntry {
  id: string;
  entity: string;
  model: string;
  tokensUsed: number;
  durationMs: number;
  prompt: string;
  createdAt: number;
}

interface PromptHistoryProps {
  entries: HistoryEntry[];
  onLoad: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export default function PromptHistory({ entries, onLoad, onClear }: PromptHistoryProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-body-muted text-[11px] font-mono uppercase tracking-widest">
          Prompt History ({entries.length})
        </p>
        <button onClick={onClear}
          className="text-xs font-mono text-error/50 hover:text-error transition-colors">
          Clear All
        </button>
      </div>

      {/* Pills */}
      <div className="flex gap-2 flex-wrap">
        {entries.map(entry => (
          <button
            key={entry.id}
            onClick={() => {
              onLoad(entry);
              setExpanded(expanded === entry.id ? null : entry.id);
            }}
            className={`text-xs font-mono px-3 py-1.5 rounded-full transition-colors border ${
              expanded === entry.id
                ? "bg-surface-tile-3 text-body-on-dark border-white/10"
                : "bg-surface-tile-2 text-body-muted hover:bg-surface-tile-3 hover:text-body-on-dark border-white/5"
            }`}>
            {entry.entity.length > 22 ? entry.entity.slice(0, 22) + "…" : entry.entity}
            <span className="ml-1.5 opacity-50">
              {new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </button>
        ))}
      </div>

      {/* Expanded preview */}
      <AnimatePresence>
        {expanded && (() => {
          const entry = entries.find(e => e.id === expanded);
          if (!entry) return null;
          return (
            <motion.div
              key={expanded}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden">
              <div className="bg-surface-tile-1 rounded-2xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                  <div>
                    <p className="text-body-on-dark text-xs font-medium">{entry.entity}</p>
                    <p className="text-body-muted/50 text-xs font-mono mt-0.5">
                      {entry.model.split("-").slice(0, 2).join("-")} · {entry.tokensUsed} tokens · {(entry.durationMs / 1000).toFixed(1)}s
                    </p>
                  </div>
                  <button onClick={() => setExpanded(null)}
                    className="text-body-muted/40 hover:text-body-muted transition-colors text-base font-mono">
                    ×
                  </button>
                </div>
                <pre className="px-5 py-4 text-success text-xs font-mono leading-relaxed whitespace-pre-wrap break-words max-h-52 overflow-y-auto">
                  {entry.prompt}
                </pre>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";

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
    <div className="mt-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-white/60 text-xs font-mono uppercase tracking-widest">
          Prompt History ({entries.length})
        </span>
        <button
          onClick={onClear}
          className="text-xs font-mono px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400/70 hover:bg-red-500/10 transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
        {entries.map((entry) => (
          <div key={entry.id} className="px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-xs font-semibold truncate">{entry.entity}</p>
                <p className="text-white/30 text-xs font-mono mt-0.5">
                  {new Date(entry.createdAt).toLocaleTimeString()} ·{" "}
                  {entry.model.split("-").slice(0, 2).join("-")} ·{" "}
                  {entry.tokensUsed} tokens · {(entry.durationMs / 1000).toFixed(1)}s
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                  className="text-xs font-mono px-2 py-1 rounded border border-white/10 text-white/40 hover:text-white/70 transition-colors"
                >
                  {expanded === entry.id ? "Hide" : "View"}
                </button>
                <button
                  onClick={() => onLoad(entry)}
                  className="text-xs font-mono px-2 py-1 rounded border border-green-400/30 text-green-400/70 hover:bg-green-400/10 transition-colors"
                >
                  Load
                </button>
              </div>
            </div>
            {expanded === entry.id && (
              <pre className="mt-3 text-green-400 text-xs font-mono leading-relaxed whitespace-pre-wrap bg-black/30 rounded-lg p-3 max-h-48 overflow-y-auto">
                {entry.prompt}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

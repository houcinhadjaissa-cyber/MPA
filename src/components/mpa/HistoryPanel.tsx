"use client";

import { useState } from "react";
import { Star, Trash2, Copy, Download, Check, Clock, FileText, Filter } from "lucide-react";

export interface PromptHistoryItem {
  id: string;
  title: string;
  content: string;
  model: string;
  score: number;
  scoreLabel: string;
  wordCount: number;
  createdAt: number;
  starred: boolean;
  sessionName: string;
  activeLayerCount: number;
}

interface HistoryPanelProps {
  history: PromptHistoryItem[];
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onLoad: (item: PromptHistoryItem) => void;
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (days > 0)  return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0)  return `${mins}m ago`;
  return "just now";
}

function getScoreColor(score: number): string {
  if (score >= 85) return "#00ff88";
  if (score >= 70) return "#06B6D4";
  if (score >= 50) return "#8B5CF6";
  if (score >= 30) return "#F59E0B";
  return "#6B7280";
}

export default function HistoryPanel({ history, onDelete, onToggleStar, onLoad }: HistoryPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [starsOnly, setStarsOnly] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  const filtered = history
    .filter((h) => !starsOnly || h.starred)
    .filter((h) => !searchQ || h.title.toLowerCase().includes(searchQ.toLowerCase()));

  const handleCopy = async (item: PromptHistoryItem) => {
    try { await navigator.clipboard.writeText(item.content); } catch {
      const el = document.createElement("textarea");
      el.value = item.content;
      el.style.cssText = "position:fixed;left:-9999px;opacity:0;";
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (item: PromptHistoryItem) => {
    const blob = new Blob([item.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mpa-${item.title.slice(0, 30).replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#0f0f0f] shrink-0">
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-400 font-semibold">
          Prompt History
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStarsOnly(!starsOnly)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
              starsOnly
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : "bg-[#1a1a1a] text-gray-600 border-white/6 hover:text-gray-300"
            }`}
          >
            <Star size={9} fill={starsOnly ? "currentColor" : "none"} />
            Starred
          </button>
          <span className="text-[10px] font-mono text-gray-600">{history.length}</span>
        </div>
      </div>

      {/* Search */}
      {history.length > 0 && (
        <div className="px-4 pt-3 pb-2 shrink-0">
          <div className="flex items-center gap-2 bg-[#141414] border border-white/8 rounded-xl px-3 py-2 focus-within:border-[#00ff88]/20">
            <Filter size={11} className="text-gray-600 shrink-0" />
            <input
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search history…"
              className="flex-1 bg-transparent text-white text-xs font-mono placeholder:text-gray-700 outline-none"
            />
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-[#141414] border border-white/6 flex items-center justify-center">
              <FileText size={18} className="text-gray-700" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-sm font-medium">
                {starsOnly ? "No starred prompts" : "No history yet"}
              </p>
              <p className="text-gray-700 text-xs font-mono">
                {starsOnly
                  ? "Star prompts from the output panel"
                  : "Generate prompts to build your history"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group bg-[#111] border border-white/6 rounded-xl p-3.5 hover:border-white/12 transition-all"
              >
                {/* Title row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <button
                    onClick={() => onLoad(item)}
                    className="flex-1 text-left text-sm text-white font-medium hover:text-[#00ff88] transition-colors leading-tight line-clamp-2"
                    title="Load this prompt to Output"
                  >
                    {item.title}
                  </button>
                  <button
                    onClick={() => onToggleStar(item.id)}
                    className={`shrink-0 p-1 rounded-lg transition-colors ${
                      item.starred
                        ? "text-amber-400"
                        : "text-gray-700 hover:text-amber-500 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Star size={12} fill={item.starred ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Score + meta */}
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-1 w-12 rounded-full"
                      style={{ background: `linear-gradient(to right, ${getScoreColor(item.score)}, ${getScoreColor(item.score)}80)` }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.score}%`, backgroundColor: getScoreColor(item.score) }}
                      />
                    </div>
                    <span className="text-[9px] font-mono font-bold" style={{ color: getScoreColor(item.score) }}>
                      {item.scoreLabel}
                    </span>
                  </div>
                  <span className="text-gray-700 text-[9px] font-mono">
                    {item.wordCount.toLocaleString()}w
                  </span>
                  <span className="text-gray-700 text-[9px] font-mono">
                    {item.model}
                  </span>
                  {item.activeLayerCount > 0 && (
                    <span className="text-gray-700 text-[9px] font-mono">
                      {item.activeLayerCount} layers
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-gray-700 text-[9px] font-mono">
                    <Clock size={8} />
                    {timeAgo(item.createdAt)}
                  </span>
                </div>

                {/* Session tag */}
                {item.sessionName && (
                  <p className="text-gray-700 text-[9px] font-mono mb-2 truncate">
                    From: {item.sessionName}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(item)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-mono border transition-all ${
                      copiedId === item.id
                        ? "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/25"
                        : "bg-[#1a1a1a] text-gray-500 border-white/5 hover:text-white"
                    }`}
                  >
                    {copiedId === item.id ? <Check size={9} /> : <Copy size={9} />}
                    {copiedId === item.id ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => handleDownload(item)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-mono bg-[#1a1a1a] text-gray-500 border border-white/5 hover:text-white transition-colors"
                  >
                    <Download size={9} /> .md
                  </button>
                  <button
                    onClick={() => onLoad(item)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-mono bg-[#00ff88]/8 text-[#00ff88] border border-[#00ff88]/20 hover:bg-[#00ff88]/15 transition-colors ml-auto"
                  >
                    Load →
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1 text-gray-700 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {history.length > 0 && (
        <div className="px-4 py-2.5 border-t border-white/5 shrink-0">
          <p className="text-center text-gray-700 text-[9px] font-mono">
            {history.length} prompt{history.length !== 1 ? "s" : ""} saved · Max 50
          </p>
        </div>
      )}
    </div>
  );
}

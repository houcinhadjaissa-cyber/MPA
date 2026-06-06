"use client";

import { useState } from "react";
import { Plus, Trash2, Clock, ChevronRight, Layers } from "lucide-react";

export interface Session {
  id: string;
  name: string;
  objective: string;
  messageCount: number;
  activeLayerCount: number;
  createdAt: number;
  lastUsed: number;
}

interface SessionsPanelProps {
  sessions: Session[];
  activeSessionId: string;
  onNewSession: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, name: string) => void;
  activeLayerCount: number;
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

export default function SessionsPanel({
  sessions,
  activeSessionId,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  activeLayerCount,
}: SessionsPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (s: Session) => {
    setEditingId(s.id);
    setEditValue(s.name);
  };

  const commitEdit = (id: string) => {
    if (editValue.trim()) onRenameSession(id, editValue.trim());
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#0f0f0f] shrink-0">
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-400 font-semibold">Sessions</p>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/25">
          {activeLayerCount} layers
        </span>
      </div>

      {/* New Session button */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#00ff88]/30 bg-[#00ff88]/8 text-[#00ff88] text-sm font-mono font-semibold hover:bg-[#00ff88]/15 transition-colors"
        >
          <Plus size={14} />
          New Session
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
            <Clock size={20} className="text-gray-700" />
            <p className="text-gray-600 text-xs font-mono">No sessions yet</p>
          </div>
        ) : (
          sessions.map((s) => {
            const isActive = s.id === activeSessionId;
            return (
              <div
                key={s.id}
                onClick={() => onSelectSession(s.id)}
                className={`relative p-3.5 rounded-xl border cursor-pointer transition-all group ${
                  isActive
                    ? "bg-[#00ff88]/8 border-[#00ff88]/30"
                    : "bg-[#111]/60 border-white/8 hover:border-white/15 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {editingId === s.id ? (
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => commitEdit(s.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit(s.id);
                          if (e.key === "Escape") setEditingId(null);
                          e.stopPropagation();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-transparent border-b border-[#00ff88]/40 text-white text-sm font-medium outline-none pb-0.5"
                      />
                    ) : (
                      <p
                        className={`text-sm font-medium truncate ${isActive ? "text-[#00ff88]" : "text-white"}`}
                        onDoubleClick={(e) => { e.stopPropagation(); startEdit(s); }}
                      >
                        {s.name}
                      </p>
                    )}
                    {s.objective && (
                      <p className="text-gray-500 text-[10px] font-mono mt-0.5 truncate leading-relaxed">
                        {s.objective}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-gray-600 text-[9px] font-mono">
                        <Clock size={9} /> {timeAgo(s.lastUsed)}
                      </span>
                      {s.activeLayerCount > 0 && (
                        <span className="flex items-center gap-1 text-gray-600 text-[9px] font-mono">
                          <Layers size={9} /> {s.activeLayerCount} layers
                        </span>
                      )}
                      {s.messageCount > 0 && (
                        <span className="text-gray-700 text-[9px] font-mono">
                          {s.messageCount} msg{s.messageCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteSession(s.id); }}
                      className="p-1.5 text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5"
                    >
                      <Trash2 size={11} />
                    </button>
                    {isActive && <ChevronRight size={12} className="text-[#00ff88]" />}
                  </div>
                </div>

                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#00ff88] rounded-r-full" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/5 shrink-0">
        <p className="text-center text-gray-700 text-[9px] font-mono">
          MPA Terminal v2.0 · Secure · Private
        </p>
      </div>
    </div>
  );
}

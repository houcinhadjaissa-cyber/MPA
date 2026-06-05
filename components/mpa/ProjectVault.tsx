"use client";

import { useState } from "react";
import { Save, FolderOpen, Trash2 } from "lucide-react";

export interface SavedProject {
  id: string;
  label: string;
  entity: string;
  context: string;
  masterObjective: string;
  protocol: string;
  createdAt: number;
}

interface ProjectVaultProps {
  projects: SavedProject[];
  onSave: (label: string) => void;
  onLoad: (project: SavedProject) => void;
  onDelete: (id: string) => void;
  currentEntity: string;
}

export default function ProjectVault({ projects, onSave, onLoad, onDelete, currentEntity }: ProjectVaultProps) {
  const [label, setLabel] = useState("");

  const handleSave = () => {
    onSave(label.trim() || currentEntity);
    setLabel("");
  };

  return (
    <div className="space-y-3">
      <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">Project Vault</p>

      <div className="bg-[#111] rounded-xl border border-white/5 p-3 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            placeholder="Project name (optional)"
            className="flex-1 bg-[#0a0a0a] border border-white/10 text-white placeholder:text-gray-600 focus:border-emerald-500/40 outline-none rounded-lg px-3 py-2 text-xs font-mono"
          />
          <button
            onClick={handleSave}
            disabled={!currentEntity.trim()}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5 hover:border-white/20 transition-all text-xs font-mono disabled:opacity-40"
          >
            <Save size={11} /> Save
          </button>
        </div>

        {projects.length > 0 ? (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors"
              >
                <button
                  onClick={() => onLoad(p)}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="text-white text-xs font-medium truncate hover:text-emerald-400 transition-colors">
                    {p.label}
                  </p>
                  <p className="text-gray-600 text-[10px] font-mono">
                    {new Date(p.createdAt).toLocaleDateString()} · {p.protocol}
                  </p>
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors shrink-0 p-1"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 text-[10px] font-mono text-center py-2">
            No saved projects yet
          </p>
        )}
      </div>
    </div>
  );
}

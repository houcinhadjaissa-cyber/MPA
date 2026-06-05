"use client";

import { MessageSquare, Layers, FileOutput, Settings } from "lucide-react";

export type MobileTab = "chat" | "layers" | "output" | "settings";

interface MobileNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  hasOutput: boolean;
}

export default function MobileNav({ activeTab, onTabChange, hasOutput }: MobileNavProps) {
  const tabs: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
    { id: "chat",     label: "Chat",     icon: <MessageSquare size={18} /> },
    { id: "layers",   label: "Layers",   icon: <Layers size={18} /> },
    { id: "output",   label: "Output",   icon: <FileOutput size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex items-center justify-around bg-[#111] border-t border-white/10 px-2 py-1 shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all relative ${
            activeTab === tab.id ? "text-emerald-400" : "text-gray-600 hover:text-gray-400"
          }`}
        >
          {tab.icon}
          <span className="text-[9px] font-mono">{tab.label}</span>
          {tab.id === "output" && hasOutput && (
            <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
          {activeTab === tab.id && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-emerald-400" />
          )}
        </button>
      ))}
    </div>
  );
}

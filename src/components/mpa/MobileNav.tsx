"use client";

import { MessageSquare, Layers, FileOutput, Clock, Settings } from "lucide-react";

export type MobileTab = "chat" | "layers" | "output" | "sessions" | "config";

interface MobileNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  hasOutput: boolean;
  activeLayerCount?: number;
}

const TABS: { id: MobileTab; label: string; Icon: React.ElementType }[] = [
  { id: "chat",     label: "Chat",     Icon: MessageSquare },
  { id: "layers",   label: "Layers",   Icon: Layers        },
  { id: "output",   label: "Output",   Icon: FileOutput    },
  { id: "sessions", label: "Sessions", Icon: Clock         },
  { id: "config",   label: "Config",   Icon: Settings      },
];

export default function MobileNav({ activeTab, onTabChange, hasOutput, activeLayerCount }: MobileNavProps) {
  return (
    <div className="flex items-center justify-around bg-[#0f0f0f] border-t border-white/8 px-1 py-1.5 shrink-0 safe-area-bottom">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl transition-all duration-200 relative min-w-[52px] ${
              isActive
                ? "text-[#00ff88]"
                : "text-gray-600 hover:text-gray-400 active:text-gray-300"
            }`}
          >
            <div className="relative">
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
              {id === "output" && hasOutput && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00ff88] border border-[#0f0f0f]" />
              )}
              {id === "layers" && !!activeLayerCount && activeLayerCount > 0 && (
                <span className="absolute -top-1.5 -right-2 text-[9px] font-mono text-[#00ff88] font-bold">
                  {activeLayerCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-mono tracking-wide ${isActive ? "font-semibold" : ""}`}>
              {label}
            </span>
            {isActive && (
              <span className="absolute -top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[#00ff88] opacity-80" />
            )}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { LAYER_CONFIGS, LAYER_GROUPS, type LayerState, type LayerKey } from "@/lib/mpa/layers";
import { recommendNextLayers, getLayerSynergies } from "@/lib/mpa/nextWaveCore";
import { Zap } from "lucide-react";

interface LayerPanelProps {
  layers: LayerState;
  onToggle: (key: LayerKey) => void;
  compact?: boolean;
}

export default function LayerPanel({ layers, onToggle, compact = false }: LayerPanelProps) {
  const activeCount = Object.values(layers).filter(Boolean).length;
  const total = LAYER_CONFIGS.length;
  const synergies = getLayerSynergies(layers);
  const recommended = recommendNextLayers(layers);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-white/8">
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-400 font-semibold">
          Intelligence Layers
        </p>
        <span
          className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
            activeCount > 0
              ? "text-[#00ff88] border-[#00ff88]/40 bg-[#00ff88]/10"
              : "text-gray-600 border-white/10 bg-white/5"
          }`}
        >
          {activeCount}/{total} Active
        </span>
      </div>

      {/* Synergy banner */}
      {synergies.length > 0 && (
        <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-[#00ff88]/8 border border-[#00ff88]/20 shrink-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={10} className="text-[#00ff88]" />
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#00ff88]">Synergy Active</span>
          </div>
          {synergies.map((s, i) => (
            <p key={i} className="text-[10px] text-gray-400 font-mono leading-relaxed">{s}</p>
          ))}
        </div>
      )}

      {/* Layer groups */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {LAYER_GROUPS.map((group) => {
          const groupLayers = group.keys
            .map((k) => LAYER_CONFIGS.find((l) => l.key === k)!)
            .filter(Boolean);
          if (!groupLayers.length) return null;

          const groupActive = groupLayers.filter((l) => layers[l.key as LayerKey]).length;

          return (
            <div key={group.key}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-gray-600 font-semibold">
                  {group.label}
                </p>
                {groupActive > 0 && (
                  <span className="text-[9px] font-mono text-[#00ff88] opacity-70">
                    {groupActive} on
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {groupLayers.map((cfg) => {
                  const isActive = layers[cfg.key as LayerKey];
                  const isRecommended = recommended.includes(cfg.key as LayerKey);

                  return (
                    <div
                      key={cfg.key}
                      onClick={() => onToggle(cfg.key as LayerKey)}
                      className={`flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isActive
                          ? "bg-[#00ff88]/8 border-[#00ff88]/25"
                          : isRecommended
                          ? "bg-white/[0.02] border-white/10 hover:bg-white/[0.04] border-dashed"
                          : "bg-[#111]/60 border-white/6 hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p
                            className="text-[13px] font-medium tracking-wide transition-colors leading-tight"
                            style={{ color: isActive ? "#00ff88" : "#e5e7eb" }}
                          >
                            {cfg.label}
                          </p>
                          {isRecommended && !isActive && (
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 shrink-0">
                              recommended
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cfg.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                                isActive
                                  ? "bg-[#00ff88]/10 text-[#00ff88]/70"
                                  : "bg-white/5 text-gray-600"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={isActive}
                        className="relative w-10 h-5.5 rounded-full shrink-0 transition-all duration-250 focus:outline-none"
                        style={{
                          backgroundColor: isActive ? "#00ff88" : "#2a2a2a",
                          width: "38px",
                          height: "22px",
                        }}
                        onClick={(e) => { e.stopPropagation(); onToggle(cfg.key as LayerKey); }}
                      >
                        <div
                          className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200"
                          style={{
                            left: isActive ? "calc(100% - 19px)" : "3px",
                          }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Footer padding */}
        <div className="h-4" />
      </div>
    </div>
  );
}

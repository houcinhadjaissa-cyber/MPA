"use client";

import { LAYER_CONFIGS, type LayerState, type LayerKey } from "@/lib/mpa/layers";

interface LayerPanelProps {
  layers: LayerState;
  onToggle: (key: LayerKey) => void;
}

const GROUPS = [
  { label: "Math Foundation",         keys: ["mathDominance", "singularityIntelligence"] },
  { label: "Strategy Architecture",   keys: ["monteCarlo", "zkVerification"] },
  { label: "Competitive Intelligence",keys: ["fractalEconomy", "regenerativeSovereignty", "omniNode", "mediaOracle", "reverseEngineering"] },
  { label: "Foundational Security",   keys: ["apexDefense"] },
  { label: "Supreme Architecture",    keys: ["omegaTopology", "omegaSecurity", "omegaAbsolute", "ergodicSync"] },
  { label: "Singularity Engine",      keys: ["singularityEngine", "retractor", "sinEater"] },
];

export default function LayerPanel({ layers, onToggle }: LayerPanelProps) {
  const activeCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">Intelligence Layers</p>
        {activeCount > 0 && (
          <span className="text-xs font-mono px-2 py-0.5 rounded-full text-emerald-400 border border-emerald-500/30 bg-emerald-500/10">
            {activeCount}/{LAYER_CONFIGS.length} active
          </span>
        )}
      </div>

      {GROUPS.map((group) => {
        const groupLayers = group.keys
          .map((k) => LAYER_CONFIGS.find((l) => l.key === k)!)
          .filter(Boolean);
        if (!groupLayers.length) return null;

        return (
          <div key={group.label} className="bg-[#111] rounded-xl border border-white/5 overflow-hidden">
            <p className="text-gray-600 text-[10px] font-mono uppercase tracking-widest px-4 pt-4 pb-1">
              {group.label}
            </p>
            {groupLayers.map((cfg) => (
              <div
                key={cfg.key}
                className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 last:border-b-0 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => onToggle(cfg.key as LayerKey)}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium tracking-wide transition-colors"
                    style={{ color: layers[cfg.key as LayerKey] ? cfg.color : "#9CA3AF" }}
                  >
                    {cfg.label}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed font-mono truncate">
                    {cfg.sublabel}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={layers[cfg.key as LayerKey]}
                  className="relative w-9 h-5 rounded-full shrink-0 transition-colors duration-200"
                  style={{ backgroundColor: layers[cfg.key as LayerKey] ? cfg.color : "#39393D" }}
                  onClick={(e) => { e.stopPropagation(); onToggle(cfg.key as LayerKey); }}
                >
                  <div
                    className="absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200"
                    style={{ transform: layers[cfg.key as LayerKey] ? "translateX(16px)" : "translateX(0)" }}
                  />
                </button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

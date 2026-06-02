"use client";

import { useState, useEffect, useCallback, useReducer, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PayloadViewer from "@/components/PayloadViewer";
import PromptHistory, { HistoryEntry } from "@/components/PromptHistory";
import {
  generatePayload,
  GenerateOptions,
  LayerConfig,
  GROQ_MODELS,
  INDUSTRY_TEMPLATES,
  DOMINANCE_PROTOCOLS,
  LAYER_CONFIGS,
} from "@/lib/payloadGenerator";

// ── localStorage keys ─────────────────────────────────────────────────────────
const LS_APIKEY     = "mpa_groq_api_key";
const LS_OBJECTIVE  = "mpa_master_objective";
const LS_DIRECTIVES = "mpa_custom_directives";
const LS_HISTORY    = "mpa_prompt_history";
const LS_PROJECTS   = "mpa_projects";
const MAX_HISTORY   = 20;

// Guards: all localStorage reads ONLY happen inside useEffect (client-side only)
function lsGet(key: string, fallback = ""): string {
  if (typeof window === "undefined") return fallback;
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function lsSet(key: string, value: string) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, value); } catch {}
}
function lsRemove(key: string) {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(key); } catch {}
}
function lsGetJSON<T>(key: string, fallback: T): T {
  try { return JSON.parse(lsGet(key, "null")) ?? fallback; } catch { return fallback; }
}

interface SavedProject {
  id: string; label: string; entity: string; context: string;
  masterObjective: string; protocol: string; createdAt: number;
}

function maskKey(key: string): string {
  if (!key || key.length < 8) return key;
  return key.slice(0, 7) + "·".repeat(10);
}

// ── Layer Reducer (real Reducer pattern — replaces individual useState booleans) ──
type LayerKey = LayerConfig["key"];
type LayerState = Record<LayerKey, boolean>;
type LayerAction =
  | { type: "TOGGLE"; key: LayerKey }
  | { type: "SET";    key: LayerKey; value: boolean }
  | { type: "RESET" };

const INITIAL_LAYERS: LayerState = {
  mathDominance: false, singularityIntelligence: false, monteCarlo: false,
  zkVerification: false, fractalEconomy: false, regenerativeSovereignty: false,
  omniNode: false, mediaOracle: false, reverseEngineering: false, apexDefense: false,
};

function layerReducer(state: LayerState, action: LayerAction): LayerState {
  switch (action.type) {
    case "TOGGLE": return { ...state, [action.key]: !state[action.key] };
    case "SET":    return { ...state, [action.key]: action.value };
    case "RESET":  return { ...INITIAL_LAYERS };
    default: return state;
  }
}

// ── Island mode ───────────────────────────────────────────────────────────────
type IslandMode = "idle" | "generating" | "success" | "error" | "keyTesting" | "keyValid" | "keyInvalid";

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG_CARD  = "bg-[#2C2C2E]";
const BORDER   = "border border-white/5";
const INPUT_CLASS =
  "w-full bg-[#0A0A0A] border border-white/10 text-white placeholder:text-gray-500 " +
  "focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF] outline-none " +
  "transition-all rounded-xl px-4 py-3 text-sm";

// ── Dynamic Island ────────────────────────────────────────────────────────────
function DynamicIsland({ mode, errorMsg }: { mode: IslandMode; errorMsg?: string }) {
  const isExpanded = mode !== "idle";
  const isErr = mode === "error" || mode === "keyInvalid";
  const isOk  = mode === "success" || mode === "keyValid";

  return (
    <div className="flex justify-center mb-8">
      <motion.div layout transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className={[
          "flex items-center justify-center gap-2 overflow-hidden rounded-full shadow-2xl",
          isExpanded ? "px-5 py-2.5" : "px-6 py-1.5",
          isErr ? "bg-black border border-red-500/40"
            : isOk ? "bg-black border border-[#30D158]/40"
            : "bg-black border border-white/10",
        ].join(" ")}
      >
        <AnimatePresence mode="wait">
          {mode === "idle" && (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[11px] font-mono text-gray-500 tracking-[0.2em] uppercase select-none">
              MPA Terminal
            </motion.span>
          )}
          {mode === "generating" && (
            <motion.span key="gen" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs font-mono text-[#2997FF]">
              <span className="w-2 h-2 rounded-full bg-[#2997FF] animate-pulse shrink-0" />
              Streaming…
            </motion.span>
          )}
          {mode === "success" && (
            <motion.span key="ok" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="text-xs font-mono text-[#30D158]">✓ Prompt Ready</motion.span>
          )}
          {mode === "error" && (
            <motion.span key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-xs font-mono text-red-400 max-w-xs truncate">⚠ {errorMsg ?? "Error"}</motion.span>
          )}
          {mode === "keyTesting" && (
            <motion.span key="kt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span className="w-3 h-3 border-2 border-white/20 border-t-white/60 rounded-full animate-spin shrink-0" />
              Testing key…
            </motion.span>
          )}
          {mode === "keyValid" && (
            <motion.span key="kv" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="text-xs font-mono text-[#30D158]">✓ API key valid</motion.span>
          )}
          {mode === "keyInvalid" && (
            <motion.span key="ki" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="text-xs font-mono text-red-400">✕ API key invalid</motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ── IosToggle — CSS transition, bg-[#39393D] off state ───────────────────────
function IosToggle({ active, onChange, color }: {
  active: boolean; onChange: (v: boolean) => void; color: string;
}) {
  return (
    <button type="button" role="switch" aria-checked={active}
      onClick={() => onChange(!active)}
      style={{ backgroundColor: active ? color : "#39393D" }}
      className="relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200 ease-in-out focus:outline-none">
      <div className={[
        "absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-white shadow-md",
        "transition-transform duration-200 ease-in-out",
        active ? "translate-x-5" : "translate-x-0",
      ].join(" ")} />
    </button>
  );
}

// ── Card + Layer Row ──────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${BG_CARD} rounded-2xl ${BORDER} ${className}`}>{children}</div>;
}

function LayerRow({ active, onChange, label, sublabel, color }: {
  active: boolean; onChange: (v: boolean) => void;
  label: string; sublabel: string; color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-white/5 last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium tracking-wide transition-colors"
          style={active ? { color } : { color: "#9CA3AF" }}>
          {label}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed font-mono">{sublabel}</p>
      </div>
      <IosToggle active={active} onChange={onChange} color={color} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  // ── Non-layer inputs
  const [masterObjective,  setMasterObjective]  = useState("");
  const [targetEntity,     setTargetEntity]     = useState("");
  const [targetContext,    setTargetContext]     = useState("");
  const [protocol,         setProtocol]         = useState(DOMINANCE_PROTOCOLS[0].id);
  const [customDirectives, setCustomDirectives] = useState("");
  const [apiKey,  setApiKey]  = useState("");
  const [showKey, setShowKey] = useState(false);
  const [model,       setModel]       = useState(GROQ_MODELS[0].id);
  const [temperature, setTemperature] = useState(0.7);

  // ── Layer state via Reducer (TOGGLE action dispatched per interaction)
  const [layers, dispatchLayer] = useReducer(layerReducer, INITIAL_LAYERS);

  // ── Output
  const [payload,      setPayload]      = useState("");
  const [tokensUsed,   setTokensUsed]   = useState(0);
  const [durationMs,   setDurationMs]   = useState(0);
  const [activeModel,  setActiveModel]  = useState("");
  const [adaptWarning, setAdaptWarning] = useState<string | null>(null);

  // ── UX
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [islandMode, setIslandMode] = useState<IslandMode>("idle");

  // ── Persistence
  const [history,      setHistory]      = useState<HistoryEntry[]>([]);
  const [projects,     setProjects]     = useState<SavedProject[]>([]);
  const [projectLabel, setProjectLabel] = useState("");

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleReset = useCallback((ms: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIslandMode("idle"), ms);
  }, []);

  // ── Hydration: ALL localStorage reads happen ONLY inside useEffect ──────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    setApiKey(lsGet(LS_APIKEY));
    setMasterObjective(lsGet(LS_OBJECTIVE));
    setCustomDirectives(lsGet(LS_DIRECTIVES));
    setHistory(lsGetJSON<HistoryEntry[]>(LS_HISTORY, []));
    setProjects(lsGetJSON<SavedProject[]>(LS_PROJECTS, []));
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => { lsSet(LS_APIKEY,     apiKey); },           [apiKey]);
  useEffect(() => { lsSet(LS_OBJECTIVE,  masterObjective); },  [masterObjective]);
  useEffect(() => { lsSet(LS_DIRECTIVES, customDirectives); }, [customDirectives]);

  // ── Test API key ─────────────────────────────────────────────────────────────
  const testKey = useCallback(async () => {
    if (!apiKey.trim()) return;
    setIslandMode("keyTesting");
    try {
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      setIslandMode(res.ok ? "keyValid" : "keyInvalid");
      scheduleReset(3000);
    } catch { setIslandMode("keyInvalid"); scheduleReset(3000); }
  }, [apiKey, scheduleReset]);

  const applyTemplate = (i: number) => {
    setTargetEntity(INDUSTRY_TEMPLATES[i].entity);
    setTargetContext(INDUSTRY_TEMPLATES[i].context);
  };

  // ── Project Vault ─────────────────────────────────────────────────────────────
  const saveProject = () => {
    if (!targetEntity.trim()) return;
    const entry: SavedProject = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      label: projectLabel.trim() || targetEntity, entity: targetEntity,
      context: targetContext, masterObjective, protocol, createdAt: Date.now(),
    };
    const updated = [entry, ...projects].slice(0, 20);
    setProjects(updated); lsSet(LS_PROJECTS, JSON.stringify(updated));
    setProjectLabel("");
  };
  const loadProject  = (p: SavedProject) => {
    setTargetEntity(p.entity); setTargetContext(p.context);
    setMasterObjective(p.masterObjective); setProtocol(p.protocol);
  };
  const deleteProject = (id: string) => {
    const u = projects.filter(p => p.id !== id);
    setProjects(u); lsSet(LS_PROJECTS, JSON.stringify(u));
  };
  const resetApiKey = () => { setApiKey(""); lsRemove(LS_APIKEY); };

  // ── Generate ──────────────────────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    setError(null); setPayload(""); setAdaptWarning(null);
    setLoading(true); setIslandMode("generating");
    try {
      const opts: GenerateOptions = {
        targetEntity, targetContext, masterObjective, customDirectives,
        protocol, ...layers, apiKey, model, temperature,
      };
      const result = await generatePayload(opts);
      setPayload(result.prompt);
      setTokensUsed(result.tokensUsed);
      setDurationMs(result.durationMs);
      setActiveModel(result.model);
      if (result.adapted && result.warning) setAdaptWarning(result.warning);
      setIslandMode("success"); scheduleReset(2500);

      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        entity: targetEntity, model: result.model,
        tokensUsed: result.tokensUsed, durationMs: result.durationMs,
        prompt: result.prompt, createdAt: Date.now(),
      };
      const updated = [entry, ...history].slice(0, MAX_HISTORY);
      setHistory(updated); lsSet(LS_HISTORY, JSON.stringify(updated));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error.";
      setError(msg); setIslandMode("error"); scheduleReset(6000);
    } finally { setLoading(false); }
  }, [
    targetEntity, targetContext, masterObjective, customDirectives,
    protocol, layers, apiKey, model, temperature, history, scheduleReset,
  ]);

  const handleLoadHistory = (e: HistoryEntry) => {
    setPayload(e.prompt); setTokensUsed(e.tokensUsed);
    setDurationMs(e.durationMs); setActiveModel(e.model);
  };
  const handleClearHistory = () => { setHistory([]); lsRemove(LS_HISTORY); };

  // ── Derived values ────────────────────────────────────────────────────────────
  const activeLayers  = Object.values(layers).filter(Boolean).length;
  const canGenerate   = !loading && !!targetEntity.trim() && !!targetContext.trim() && !!apiKey.trim();
  const buttonLabel   = layers.monteCarlo ? "Generate Strategy Matrix" : "Generate MACH Enterprise Prompt";
  const estTokens     = Math.round((masterObjective.length + targetEntity.length + targetContext.length + customDirectives.length) / 4);
  const selectedProto = DOMINANCE_PROTOCOLS.find(p => p.id === protocol);

  const mathLayers         = LAYER_CONFIGS.filter(l => l.group === "math");
  const strategyLayers     = LAYER_CONFIGS.filter(l => l.group === "strategy");
  const intelligenceLayers = LAYER_CONFIGS.filter(l => l.group === "intelligence");
  const apexLayer          = LAYER_CONFIGS.find(l => l.group === "apex")!;

  // ════════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10 space-y-4">

        <DynamicIsland mode={islandMode} errorMsg={error ?? undefined} />

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#30D158] text-[11px] font-mono uppercase tracking-[0.25em] mb-2">Master Plan Architect</p>
          <h1 className="text-white text-4xl font-semibold tracking-tight"
            style={{ fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif" }}>
            MPA Terminal
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            MACH · Sovereign · Monte Carlo · ZK · Fractal · Media Oracle · APEX-DEFENSE
          </p>
        </div>

        {/* Model Selector */}
        <Card className="p-1 flex gap-1">
          {GROQ_MODELS.map(m => (
            <button key={m.id} onClick={() => setModel(m.id)}
              className={`flex-1 text-xs font-mono px-3 py-2 rounded-xl transition-all ${
                model === m.id ? "bg-[#3A3A3C] text-white" : "text-gray-400 hover:text-white"
              }`}>
              {m.label}
              <span className={`ml-1 text-[10px] ${model === m.id ? "text-gray-400" : "opacity-40"}`}>{m.speed}</span>
            </button>
          ))}
        </Card>

        {/* Quick Templates */}
        <div>
          <p className="text-gray-400 text-[11px] font-mono uppercase tracking-widest mb-3">Quick Templates</p>
          <div className="flex gap-2 flex-wrap">
            {INDUSTRY_TEMPLATES.map((t, i) => (
              <button key={t.label} onClick={() => applyTemplate(i)}
                className="text-xs font-mono px-3 py-1.5 rounded-full bg-[#2C2C2E] text-gray-400 hover:text-white hover:bg-[#3A3A3C] transition-colors border border-white/5">
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white text-sm font-medium tracking-wide">Groq API Key</p>
            <div className="flex gap-2">
              {apiKey && (
                <button onClick={testKey}
                  className="text-xs font-mono px-3 py-1 rounded-full bg-[#1C1C1E] text-[#2997FF] hover:bg-[#3A3A3C] transition-colors border border-[#2997FF]/30">
                  Test Key
                </button>
              )}
              {apiKey && (
                <button onClick={resetApiKey}
                  className="text-xs font-mono px-3 py-1 rounded-full bg-[#1C1C1E] text-red-400 hover:bg-[#3A3A3C] transition-colors border border-red-500/20">
                  Reset
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            <input type={showKey ? "text" : "password"} value={apiKey}
              onChange={e => setApiKey(e.target.value)} placeholder="gsk_..."
              className={INPUT_CLASS + " pr-24 font-mono"} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {apiKey && !showKey && <span className="text-gray-600 text-[11px] font-mono hidden sm:inline">{maskKey(apiKey)}</span>}
              <button onClick={() => setShowKey(v => !v)} className="text-xs text-gray-400 hover:text-white transition-colors font-mono">
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-2 font-mono">Stored in localStorage only · transmitted exclusively to api.groq.com</p>
        </Card>

        {/* Master Objective */}
        <Card className="p-6">
          <p className="text-white text-sm font-medium tracking-wide mb-3">Master Objective</p>
          <textarea value={masterObjective} onChange={e => setMasterObjective(e.target.value)}
            placeholder="e.g., 'I am building MPD, a private AI website builder. MPD's core function is to automatically wrap all user requests in MACH Enterprise Architecture…'"
            rows={3} className={INPUT_CLASS + " resize-y leading-relaxed"} />
        </Card>

        {/* Target Entity + Context */}
        <Card className="p-6 space-y-4">
          <div>
            <p className="text-white text-sm font-medium tracking-wide mb-3">Target Entity</p>
            <input type="text" value={targetEntity} onChange={e => setTargetEntity(e.target.value)}
              placeholder="e.g., Fleet Management E-commerce" className={INPUT_CLASS} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-white text-sm font-medium tracking-wide">Target Context / URL</p>
              <span className="text-gray-500 text-xs font-mono">~{estTokens} tokens</span>
            </div>
            <textarea value={targetContext} onChange={e => setTargetContext(e.target.value)}
              placeholder="Describe the target architecture or paste a URL…"
              rows={4} className={INPUT_CLASS + " resize-y leading-relaxed"} />
          </div>
        </Card>

        {/* Protocol + Directives + Temperature + Generate */}
        <Card className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-white text-sm font-medium tracking-wide mb-3">Dominance Protocol</p>
              <select value={protocol} onChange={e => setProtocol(e.target.value)}
                className={INPUT_CLASS + " appearance-none cursor-pointer font-mono text-[#2997FF]"}>
                {DOMINANCE_PROTOCOLS.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#1C1C1E]">{p.label}</option>
                ))}
              </select>
              {selectedProto && <p className="text-gray-500 text-xs mt-1.5 font-mono">{selectedProto.description}</p>}
            </div>
            <div>
              <p className="text-white text-sm font-medium tracking-wide mb-3">
                Custom Directives <span className="text-gray-500 font-normal">(optional)</span>
              </p>
              <textarea value={customDirectives} onChange={e => setCustomDirectives(e.target.value)}
                placeholder="e.g., 'Use Tailwind v4', 'Avoid Redux'."
                rows={3} className={INPUT_CLASS + " resize-y text-xs leading-relaxed"} />
            </div>
          </div>

          {/* Creativity slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-white text-sm font-medium tracking-wide">Creativity</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs font-mono">{temperature.toFixed(1)}</span>
                <span className="text-gray-600 text-xs font-mono">→ API temp {(temperature * 1.2).toFixed(2)}</span>
              </div>
            </div>
            <input type="range" min={0.1} max={1.0} step={0.1} value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
              className="w-full h-1 accent-[#2997FF]" />
            <div className="flex justify-between mt-1.5">
              <span className="text-gray-600 text-xs font-mono">Precise</span>
              <span className="text-gray-600 text-xs font-mono">Creative</span>
            </div>
          </div>

          {/* Adaptation warning */}
          <AnimatePresence>
            {adaptWarning && (
              <motion.p key="adapt-warn"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="text-xs font-mono text-amber-400/80 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-2">
                ⚡ {adaptWarning}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Generate button */}
          <motion.button onClick={handleGenerate} disabled={!canGenerate}
            whileTap={{ scale: canGenerate ? 0.98 : 1 }}
            className={`w-full font-semibold text-sm py-3.5 rounded-xl transition-opacity text-white ${
              layers.apexDefense ? "bg-[#30D158] hover:opacity-90" :
              layers.monteCarlo  ? "bg-[#06B6D4] hover:opacity-90" :
              "bg-[#2997FF] hover:opacity-90"
            } disabled:opacity-40 disabled:cursor-not-allowed`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Streaming…
              </span>
            ) : buttonLabel}
          </motion.button>
        </Card>

        {/* Intelligence Layers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-gray-400 text-[11px] font-mono uppercase tracking-widest">Intelligence Layers</p>
            {activeLayers > 0 && (
              <span className="text-xs font-mono px-2.5 py-1 rounded-full text-[#30D158] border border-[#30D158]/30 bg-[#30D158]/10">
                {activeLayers}/{LAYER_CONFIGS.length} active
              </span>
            )}
          </div>

          <Card className="px-6 pb-1">
            <p className="text-gray-600 text-[10px] font-mono uppercase tracking-widest pt-5 pb-1">Math Foundation</p>
            {mathLayers.map(cfg => (
              <LayerRow key={cfg.key} active={layers[cfg.key]}
                onChange={(_v) => dispatchLayer({ type: "TOGGLE", key: cfg.key })}
                label={cfg.label} sublabel={cfg.sublabel} color={cfg.color} />
            ))}
          </Card>

          <Card className="px-6 pb-1">
            <p className="text-gray-600 text-[10px] font-mono uppercase tracking-widest pt-5 pb-1">Strategy Architecture</p>
            {strategyLayers.map(cfg => (
              <LayerRow key={cfg.key} active={layers[cfg.key]}
                onChange={(_v) => dispatchLayer({ type: "TOGGLE", key: cfg.key })}
                label={cfg.label} sublabel={cfg.sublabel} color={cfg.color} />
            ))}
          </Card>

          <Card className="px-6 pb-1">
            <p className="text-gray-600 text-[10px] font-mono uppercase tracking-widest pt-5 pb-1">Competitive Intelligence</p>
            {intelligenceLayers.map(cfg => (
              <LayerRow key={cfg.key} active={layers[cfg.key]}
                onChange={(_v) => dispatchLayer({ type: "TOGGLE", key: cfg.key })}
                label={cfg.label} sublabel={cfg.sublabel} color={cfg.color} />
            ))}
          </Card>

          {/* APEX-DEFENSE — pulsing green glow card */}
          <motion.div
            animate={{
              boxShadow: layers.apexDefense
                ? ["0 0 0 0 rgba(48,209,88,0.3)", "0 0 16px 3px rgba(48,209,88,0.15)", "0 0 0 0 rgba(48,209,88,0.3)"]
                : "0 0 0 0 rgba(48,209,88,0)",
            }}
            transition={layers.apexDefense ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
            className={`rounded-2xl border px-6 pb-1 ${BG_CARD} ${layers.apexDefense ? "border-[#30D158]/40" : "border-white/5"}`}
          >
            <div className="flex items-center gap-2 pt-5 pb-1">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#30D158]/60">Foundational Security Layer</p>
              {layers.apexDefense && (
                <span className="text-[10px] font-mono text-[#30D158] border border-[#30D158]/30 rounded-full px-2 py-0.5">ACTIVE</span>
              )}
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold tracking-wide"
                  style={{ color: layers.apexDefense ? "#30D158" : "#9CA3AF" }}>
                  {apexLayer.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed font-mono">{apexLayer.sublabel}</p>
              </div>
              <IosToggle active={layers.apexDefense}
                onChange={(_v) => dispatchLayer({ type: "TOGGLE", key: "apexDefense" })}
                color="#30D158" />
            </div>
          </motion.div>
        </div>

        {/* Payload Output */}
        <AnimatePresence>
          {payload && (
            <motion.div key="payload-viewer"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: "easeOut" }}>
              <PayloadViewer payload={payload} tokensUsed={tokensUsed} durationMs={durationMs} model={activeModel} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Vault */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <p className="text-white text-sm font-medium tracking-wide">
              Project Vault
              {projects.length > 0 && <span className="text-gray-500 ml-2 font-normal">({projects.length})</span>}
            </p>
          </div>
          <div className="p-6">
            <div className="flex gap-2">
              <input type="text" value={projectLabel} onChange={e => setProjectLabel(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveProject(); }}
                placeholder="Project name (optional)"
                className="flex-1 bg-[#0A0A0A] border border-white/10 text-white placeholder:text-gray-500 focus:border-[#2997FF] outline-none transition-all rounded-xl px-4 py-2.5 text-xs font-mono" />
              <button onClick={saveProject} disabled={!targetEntity.trim()}
                className="text-xs font-mono px-4 py-2.5 rounded-xl bg-[#3A3A3C] text-white hover:bg-[#48484A] transition-colors disabled:opacity-40 whitespace-nowrap">
                Save Context
              </button>
            </div>
            {projects.length > 0 ? (
              <div className="mt-4 space-y-2 max-h-52 overflow-y-auto">
                {projects.map(p => (
                  <div key={p.id} className="flex items-center gap-3 bg-[#1C1C1E] rounded-xl px-4 py-3 border border-white/5">
                    <button onClick={() => loadProject(p)} className="flex-1 text-left min-w-0">
                      <p className="text-white text-xs font-medium truncate hover:text-[#2997FF] transition-colors">{p.label}</p>
                      <p className="text-gray-500 text-xs font-mono mt-0.5">{new Date(p.createdAt).toLocaleDateString()} · {p.protocol}</p>
                    </button>
                    <button onClick={() => deleteProject(p.id)} className="text-gray-600 hover:text-red-400 transition-colors text-base font-mono shrink-0">×</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-600 text-xs font-mono text-center py-4">
                No saved projects. Fill the fields above and click &quot;Save Context&quot;.
              </p>
            )}
          </div>
        </Card>

        {/* Prompt History */}
        <PromptHistory entries={history} onLoad={handleLoadHistory} onClear={handleClearHistory} />

        {/* Immutable footer — no re-render; static string, no state dependency */}
        <p className="text-center text-gray-600 text-[11px] font-mono pb-2 select-none">
          Protected by Adversarial Audit &amp; Temporal Anchoring.
        </p>

      </div>
    </div>
  );
}

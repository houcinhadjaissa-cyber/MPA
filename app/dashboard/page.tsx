"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PayloadViewer from "@/components/PayloadViewer";
import PromptHistory, { HistoryEntry } from "@/components/PromptHistory";
import {
  generatePayload,
  GenerateOptions,
  GROQ_MODELS,
  INDUSTRY_TEMPLATES,
  DOMINANCE_PROTOCOLS,
  LAYER_CONFIGS,
} from "@/lib/payloadGenerator";

// ── localStorage keys ─────────────────────────────────────────────────────────
const LS_APIKEY    = "mpa_groq_api_key";
const LS_OBJECTIVE = "mpa_master_objective";
const LS_DIRECTIVES= "mpa_custom_directives";
const LS_HISTORY   = "mpa_prompt_history";
const LS_PROJECTS  = "mpa_projects";
const MAX_HISTORY  = 20;

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
  if (!key) return "";
  return key.slice(0, 7) + "*".repeat(Math.min(key.length - 7, 34));
}

// ── Island mode ───────────────────────────────────────────────────────────────
type IslandMode = "idle" | "generating" | "success" | "error" | "keyTesting" | "keyValid" | "keyInvalid";

// ── Dynamic Island ────────────────────────────────────────────────────────────
function DynamicIsland({ mode, errorMsg }: { mode: IslandMode; errorMsg?: string }) {
  const isExpanded = mode !== "idle";
  const isErr      = mode === "error" || mode === "keyInvalid";
  const isOk       = mode === "success" || mode === "keyValid";

  return (
    <div className="flex justify-center mb-8">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className={[
          "flex items-center justify-center gap-2 rounded-full shadow-2xl overflow-hidden",
          isExpanded ? "px-5 py-2.5" : "px-6 py-1.5",
          isErr ? "bg-error/10 border border-error/40"
            : isOk ? "bg-success/10 border border-success/30"
            : "bg-surface-tile-1 border border-white/5",
        ].join(" ")}
      >
        <AnimatePresence mode="wait">
          {mode === "idle" && (
            <motion.span key="idle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[11px] font-mono text-body-muted tracking-[0.2em] uppercase select-none">
              MPA Terminal
            </motion.span>
          )}
          {mode === "generating" && (
            <motion.span key="gen"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs font-mono text-primary-on-dark">
              <span className="w-2 h-2 rounded-full bg-primary-on-dark animate-pulse shrink-0" />
              Generating Strategy Matrix…
            </motion.span>
          )}
          {mode === "success" && (
            <motion.span key="ok"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs font-mono text-success">
              <span>✓</span> Prompt Ready
            </motion.span>
          )}
          {mode === "error" && (
            <motion.span key="err"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-xs font-mono text-error max-w-xs truncate">
              ⚠ {errorMsg ?? "Generation failed"}
            </motion.span>
          )}
          {mode === "keyTesting" && (
            <motion.span key="keyTest"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs font-mono text-body-muted">
              <span className="w-3 h-3 border-2 border-white/20 border-t-white/60 rounded-full animate-spin shrink-0" />
              Validating API key…
            </motion.span>
          )}
          {mode === "keyValid" && (
            <motion.span key="keyOk"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs font-mono text-success">
              ✓ API key valid
            </motion.span>
          )}
          {mode === "keyInvalid" && (
            <motion.span key="keyBad"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs font-mono text-error">
              ✕ API key invalid
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ── iOS Toggle ────────────────────────────────────────────────────────────────
const ACCENT_BG: Record<string, string> = {
  violet: "bg-violet-500", amber: "bg-amber-500", cyan: "bg-cyan-500",
  rose: "bg-rose-500", emerald: "bg-emerald-500", green: "bg-green-500",
  blue: "bg-blue-500", indigo: "bg-indigo-500", pink: "bg-pink-500",
};

function IOSToggle({ active, onChange, accent }: { active: boolean; onChange: (v: boolean) => void; accent: string }) {
  const bg = ACCENT_BG[accent] ?? "bg-primary-on-dark";
  return (
    <button type="button" role="switch" aria-checked={active}
      onClick={() => onChange(!active)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${active ? bg : "bg-surface-tile-3"}`}>
      <motion.div
        animate={{ x: active ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-[2px] left-0 w-5 h-5 rounded-full bg-white shadow-md"
      />
    </button>
  );
}

// ── Layer Row ─────────────────────────────────────────────────────────────────
const ACCENT_TEXT: Record<string, string> = {
  violet: "text-violet-400", amber: "text-amber-400", cyan: "text-cyan-400",
  rose: "text-rose-400", emerald: "text-emerald-400", green: "text-green-400",
  blue: "text-blue-400", indigo: "text-indigo-400", pink: "text-pink-400",
};

function LayerRow({ active, onChange, label, sublabel, accent }: {
  active: boolean; onChange: (v: boolean) => void;
  label: string; sublabel: string; accent: string;
}) {
  const t = ACCENT_TEXT[accent] ?? "text-primary-on-dark";
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-white/5 last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium transition-colors ${active ? t : "text-body-muted"}`}>{label}</p>
        <p className="text-xs text-body-muted/50 mt-0.5 leading-relaxed font-mono">{sublabel}</p>
      </div>
      <IOSToggle active={active} onChange={onChange} accent={accent} />
    </div>
  );
}

// ── Apple Card ────────────────────────────────────────────────────────────────
function AppleCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface-tile-1 rounded-2xl border border-white/5 ${className}`}>
      {children}
    </div>
  );
}

// ── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-body-muted text-[11px] font-mono uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  // ── Core inputs
  const [masterObjective,  setMasterObjective]  = useState("");
  const [targetEntity,     setTargetEntity]     = useState("");
  const [targetContext,    setTargetContext]     = useState("");
  const [protocol,         setProtocol]         = useState(DOMINANCE_PROTOCOLS[0].id);
  const [customDirectives, setCustomDirectives] = useState("");

  // ── Layer toggles
  const [mathDominance,           setMathDominance]           = useState(false);
  const [singularityIntelligence, setSingularityIntelligence] = useState(false);
  const [monteCarlo,              setMonteCarlo]              = useState(false);
  const [zkVerification,          setZkVerification]          = useState(false);
  const [fractalEconomy,          setFractalEconomy]          = useState(false);
  const [regenerativeSovereignty, setRegenerativeSovereignty] = useState(false);
  const [omniNode,                setOmniNode]                = useState(false);
  const [mediaOracle,             setMediaOracle]             = useState(false);
  const [reverseEngineering,      setReverseEngineering]      = useState(false);

  const layerSetters: Record<string, (v: boolean) => void> = {
    mathDominance: setMathDominance, singularityIntelligence: setSingularityIntelligence,
    monteCarlo: setMonteCarlo, zkVerification: setZkVerification,
    fractalEconomy: setFractalEconomy, regenerativeSovereignty: setRegenerativeSovereignty,
    omniNode: setOmniNode, mediaOracle: setMediaOracle, reverseEngineering: setReverseEngineering,
  };
  const layerValues: Record<string, boolean> = {
    mathDominance, singularityIntelligence, monteCarlo, zkVerification,
    fractalEconomy, regenerativeSovereignty, omniNode, mediaOracle, reverseEngineering,
  };

  // ── API key
  const [apiKey,  setApiKey]  = useState("");
  const [showKey, setShowKey] = useState(false);

  // ── Model / tuning
  const [model,       setModel]       = useState(GROQ_MODELS[0].id);
  const [temperature, setTemperature] = useState(0.7);

  // ── Output
  const [payload,     setPayload]     = useState("");
  const [tokensUsed,  setTokensUsed]  = useState(0);
  const [durationMs,  setDurationMs]  = useState(0);
  const [activeModel, setActiveModel] = useState("");

  // ── UX
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [islandMode,  setIslandMode]  = useState<IslandMode>("idle");

  // ── Persistence
  const [history,      setHistory]      = useState<HistoryEntry[]>([]);
  const [projects,     setProjects]     = useState<SavedProject[]>([]);
  const [projectLabel, setProjectLabel] = useState("");

  // ── Timers cleanup
  const islandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleIslandReset = useCallback((delay: number) => {
    if (islandTimerRef.current) clearTimeout(islandTimerRef.current);
    islandTimerRef.current = setTimeout(() => setIslandMode("idle"), delay);
  }, []);

  // ── Hydrate from localStorage
  useEffect(() => {
    setApiKey(lsGet(LS_APIKEY));
    setMasterObjective(lsGet(LS_OBJECTIVE));
    setCustomDirectives(lsGet(LS_DIRECTIVES));
    setHistory(lsGetJSON<HistoryEntry[]>(LS_HISTORY, []));
    setProjects(lsGetJSON<SavedProject[]>(LS_PROJECTS, []));
    return () => { if (islandTimerRef.current) clearTimeout(islandTimerRef.current); };
  }, []);

  useEffect(() => { lsSet(LS_APIKEY,    apiKey); },           [apiKey]);
  useEffect(() => { lsSet(LS_OBJECTIVE, masterObjective); },  [masterObjective]);
  useEffect(() => { lsSet(LS_DIRECTIVES,customDirectives); }, [customDirectives]);

  // ── Test API key
  const testKey = useCallback(async () => {
    if (!apiKey.trim()) return;
    setIslandMode("keyTesting");
    try {
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      setIslandMode(res.ok ? "keyValid" : "keyInvalid");
      scheduleIslandReset(3000);
    } catch {
      setIslandMode("keyInvalid");
      scheduleIslandReset(3000);
    }
  }, [apiKey, scheduleIslandReset]);

  // ── Templates
  const applyTemplate = (idx: number) => {
    const t = INDUSTRY_TEMPLATES[idx];
    setTargetEntity(t.entity);
    setTargetContext(t.context);
  };

  // ── Vault
  const saveProject = () => {
    if (!targetEntity.trim()) return;
    const entry: SavedProject = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      label: projectLabel.trim() || targetEntity,
      entity: targetEntity, context: targetContext,
      masterObjective, protocol, createdAt: Date.now(),
    };
    const updated = [entry, ...projects].slice(0, 20);
    setProjects(updated);
    lsSet(LS_PROJECTS, JSON.stringify(updated));
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

  // ── Generate
  const handleGenerate = useCallback(async () => {
    setError(null); setPayload(""); setLoading(true);
    setIslandMode("generating");
    try {
      const opts: GenerateOptions = {
        targetEntity, targetContext, masterObjective, customDirectives, protocol,
        mathDominance, singularityIntelligence, monteCarlo, zkVerification,
        fractalEconomy, regenerativeSovereignty, omniNode, mediaOracle, reverseEngineering,
        apiKey, model, temperature,
      };
      const result = await generatePayload(opts);
      setPayload(result.prompt);
      setTokensUsed(result.tokensUsed);
      setDurationMs(result.durationMs);
      setActiveModel(result.model);
      setIslandMode("success");
      scheduleIslandReset(2500);

      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        entity: targetEntity, model: result.model,
        tokensUsed: result.tokensUsed, durationMs: result.durationMs,
        prompt: result.prompt, createdAt: Date.now(),
      };
      const updated = [entry, ...history].slice(0, MAX_HISTORY);
      setHistory(updated);
      lsSet(LS_HISTORY, JSON.stringify(updated));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error occurred.";
      setError(msg);
      setIslandMode("error");
      scheduleIslandReset(5000);
    } finally {
      setLoading(false);
    }
  }, [
    targetEntity, targetContext, masterObjective, customDirectives, protocol,
    mathDominance, singularityIntelligence, monteCarlo, zkVerification,
    fractalEconomy, regenerativeSovereignty, omniNode, mediaOracle, reverseEngineering,
    apiKey, model, temperature, history, scheduleIslandReset,
  ]);

  const handleLoadHistory = (e: HistoryEntry) => {
    setPayload(e.prompt); setTokensUsed(e.tokensUsed);
    setDurationMs(e.durationMs); setActiveModel(e.model);
  };
  const handleClearHistory = () => { setHistory([]); lsRemove(LS_HISTORY); };

  // ── Derived
  const activeLayers  = Object.values(layerValues).filter(Boolean).length;
  const canGenerate   = !loading && !!targetEntity.trim() && !!targetContext.trim() && !!apiKey.trim();
  const buttonLabel   = monteCarlo ? "Generate Strategy Matrix" : "Generate MACH Enterprise Prompt";
  const selectedProto = DOMINANCE_PROTOCOLS.find(p => p.id === protocol);
  const estTokens     = Math.round((masterObjective.length + targetEntity.length + targetContext.length + customDirectives.length) / 4);

  const mathLayers        = LAYER_CONFIGS.filter(l => l.group === "math");
  const strategyLayers    = LAYER_CONFIGS.filter(l => l.group === "strategy");
  const intelligenceLayers= LAYER_CONFIGS.filter(l => l.group === "intelligence");

  const INPUT_CLASS = "w-full bg-surface-black border border-white/10 rounded-xl px-4 py-3 text-body-on-dark placeholder:text-body-muted/40 focus:outline-none focus:ring-1 focus:ring-primary-on-dark transition-all text-sm";

  // ════════════════════════════════════════════════════════════════════════════════
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-surface-black text-body-on-dark font-body"
      >
        <div className="max-w-3xl mx-auto px-5 py-10 space-y-4">

          {/* ── Dynamic Island ─────────────────────────────────────────────── */}
          <DynamicIsland mode={islandMode} errorMsg={error ?? undefined} />

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="text-center mb-6">
            <p className="text-success text-[11px] font-mono uppercase tracking-[0.2em] mb-2">
              Master Plan Architect
            </p>
            <h1 className="font-display text-4xl font-semibold text-body-on-dark tracking-tight">
              MPA Terminal
            </h1>
            <p className="text-body-muted text-sm mt-2">
              MACH · Sovereign · Monte Carlo · ZK · Fractal · Media Oracle · Mesh
            </p>
          </div>

          {/* ── Model Selector ──────────────────────────────────────────────── */}
          <AppleCard className="p-1 flex gap-1">
            {GROQ_MODELS.map(m => (
              <button key={m.id} onClick={() => setModel(m.id)}
                className={`flex-1 text-xs font-mono px-3 py-2 rounded-xl transition-all ${
                  model === m.id
                    ? "bg-surface-tile-3 text-body-on-dark shadow-sm"
                    : "text-body-muted hover:text-body-on-dark"
                }`}>
                {m.label}
                <span className={`ml-1 text-[10px] ${model === m.id ? "text-body-muted" : "opacity-40"}`}>
                  {m.speed}
                </span>
              </button>
            ))}
          </AppleCard>

          {/* ── Quick Templates ─────────────────────────────────────────────── */}
          <div>
            <SectionLabel>Quick Templates</SectionLabel>
            <div className="flex gap-2 flex-wrap">
              {INDUSTRY_TEMPLATES.map((t, i) => (
                <button key={t.label} onClick={() => applyTemplate(i)}
                  className="text-xs font-mono px-3 py-1.5 rounded-full bg-surface-tile-2 text-body-muted hover:bg-surface-tile-3 hover:text-body-on-dark transition-colors">
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── API Key ─────────────────────────────────────────────────────── */}
          <AppleCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-body-on-dark text-sm font-medium">Groq API Key</p>
              <div className="flex items-center gap-2">
                {apiKey && (
                  <button onClick={testKey}
                    className="text-xs font-mono px-3 py-1 rounded-full bg-surface-tile-2 text-primary-on-dark hover:bg-surface-tile-3 transition-colors border border-primary-on-dark/20">
                    Test Key
                  </button>
                )}
                {apiKey && (
                  <button onClick={resetApiKey}
                    className="text-xs font-mono px-3 py-1 rounded-full bg-error/10 text-error hover:bg-error/20 transition-colors border border-error/20">
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
                {apiKey && !showKey && (
                  <span className="text-body-muted/40 text-[11px] font-mono hidden sm:inline">{maskKey(apiKey)}</span>
                )}
                <button onClick={() => setShowKey(v => !v)}
                  className="text-xs text-body-muted hover:text-body-on-dark transition-colors font-mono">
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <p className="text-body-muted/40 text-xs mt-2 font-mono">Persisted to localStorage only. Never sent to any server other than api.groq.com.</p>
          </AppleCard>

          {/* ── Master Objective ────────────────────────────────────────────── */}
          <AppleCard className="p-5">
            <p className="text-body-on-dark text-sm font-medium mb-3">Master Objective</p>
            <textarea value={masterObjective} onChange={e => setMasterObjective(e.target.value)}
              placeholder="e.g., 'I am building MPD, a private AI website builder. MPD's core function is to automatically wrap all user requests in MACH Enterprise Architecture…'"
              rows={3}
              className={INPUT_CLASS + " resize-y leading-relaxed"} />
          </AppleCard>

          {/* ── Target Entity + Context ─────────────────────────────────────── */}
          <AppleCard className="p-5 space-y-4">
            <div>
              <p className="text-body-on-dark text-sm font-medium mb-3">Target Entity</p>
              <input type="text" value={targetEntity} onChange={e => setTargetEntity(e.target.value)}
                placeholder="e.g., Fleet Management E-commerce"
                className={INPUT_CLASS} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-body-on-dark text-sm font-medium">Target Context / URL</p>
                <span className="text-body-muted/50 text-xs font-mono">~{estTokens} tokens</span>
              </div>
              <textarea value={targetContext} onChange={e => setTargetContext(e.target.value)}
                placeholder="Describe the target architecture or paste a URL…"
                rows={4}
                className={INPUT_CLASS + " resize-y leading-relaxed"} />
            </div>
          </AppleCard>

          {/* ── Protocol + Directives ───────────────────────────────────────── */}
          <AppleCard className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-body-on-dark text-sm font-medium mb-3">Dominance Protocol</p>
                <select value={protocol} onChange={e => setProtocol(e.target.value)}
                  className={INPUT_CLASS + " appearance-none cursor-pointer font-mono text-primary-on-dark"}>
                  {DOMINANCE_PROTOCOLS.map(p => (
                    <option key={p.id} value={p.id} className="bg-surface-tile-1">{p.label}</option>
                  ))}
                </select>
                {selectedProto && (
                  <p className="text-body-muted/50 text-xs mt-1.5 font-mono">{selectedProto.description}</p>
                )}
              </div>
              <div>
                <p className="text-body-on-dark text-sm font-medium mb-3">
                  Custom Directives <span className="text-body-muted/50 font-normal">(Optional)</span>
                </p>
                <textarea value={customDirectives} onChange={e => setCustomDirectives(e.target.value)}
                  placeholder="e.g., 'Use Tailwind v4', 'Avoid Redux'."
                  rows={3}
                  className={INPUT_CLASS + " resize-y text-xs leading-relaxed"} />
              </div>
            </div>

            {/* Temperature */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-body-on-dark text-sm font-medium">Creativity</p>
                <span className="text-body-muted text-xs font-mono">{temperature.toFixed(1)}</span>
              </div>
              <input type="range" min={0.1} max={1.0} step={0.1} value={temperature}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-primary-on-dark h-1" />
              <div className="flex justify-between mt-1">
                <span className="text-body-muted/40 text-xs font-mono">Precise</span>
                <span className="text-body-muted/40 text-xs font-mono">Creative</span>
              </div>
            </div>

            {/* Generate button */}
            <motion.button
              onClick={handleGenerate}
              disabled={!canGenerate}
              whileTap={{ scale: canGenerate ? 0.98 : 1 }}
              className={`w-full font-semibold text-sm py-3.5 rounded-xl transition-opacity ${
                monteCarlo
                  ? "bg-cyan-500 text-white hover:opacity-90 disabled:opacity-40"
                  : "bg-primary-on-dark text-white hover:opacity-90 disabled:opacity-40"
              } disabled:cursor-not-allowed`}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating…
                </span>
              ) : buttonLabel}
            </motion.button>
          </AppleCard>

          {/* ── Intelligence Layers ─────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>Intelligence Layers</SectionLabel>
              {activeLayers > 0 && (
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20">
                  {activeLayers}/{LAYER_CONFIGS.length} active
                </span>
              )}
            </div>

            <AppleCard className="px-5 mb-3">
              <p className="text-body-muted/50 text-[10px] font-mono uppercase tracking-widest pt-4 pb-2">Math Foundation</p>
              {mathLayers.map(cfg => (
                <LayerRow key={cfg.key} active={layerValues[cfg.key]}
                  onChange={v => layerSetters[cfg.key](v)}
                  label={cfg.label} sublabel={cfg.sublabel} accent={cfg.accent} />
              ))}
              <div className="pb-1" />
            </AppleCard>

            <AppleCard className="px-5 mb-3">
              <p className="text-body-muted/50 text-[10px] font-mono uppercase tracking-widest pt-4 pb-2">Strategy Architecture</p>
              {strategyLayers.map(cfg => (
                <LayerRow key={cfg.key} active={layerValues[cfg.key]}
                  onChange={v => layerSetters[cfg.key](v)}
                  label={cfg.label} sublabel={cfg.sublabel} accent={cfg.accent} />
              ))}
              <div className="pb-1" />
            </AppleCard>

            <AppleCard className="px-5">
              <p className="text-body-muted/50 text-[10px] font-mono uppercase tracking-widest pt-4 pb-2">Competitive Intelligence</p>
              {intelligenceLayers.map(cfg => (
                <LayerRow key={cfg.key} active={layerValues[cfg.key]}
                  onChange={v => layerSetters[cfg.key](v)}
                  label={cfg.label} sublabel={cfg.sublabel} accent={cfg.accent} />
              ))}
              <div className="pb-1" />
            </AppleCard>
          </div>

          {/* ── Payload Output ──────────────────────────────────────────────── */}
          <AnimatePresence>
            {payload && (
              <motion.div
                key="payload-viewer"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}>
                <PayloadViewer payload={payload} tokensUsed={tokensUsed} durationMs={durationMs} model={activeModel} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Project Vault ───────────────────────────────────────────────── */}
          <AppleCard className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <p className="text-body-on-dark text-sm font-medium">
                Project Vault
                {projects.length > 0 && <span className="text-body-muted ml-2 font-normal">({projects.length})</span>}
              </p>
            </div>
            <div className="p-5">
              <div className="flex gap-2">
                <input type="text" value={projectLabel} onChange={e => setProjectLabel(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveProject(); }}
                  placeholder="Project name (optional)"
                  className="flex-1 bg-surface-black border border-white/10 rounded-xl px-4 py-2.5 text-body-on-dark placeholder:text-body-muted/40 focus:outline-none focus:ring-1 focus:ring-primary-on-dark transition-all text-xs font-mono" />
                <button onClick={saveProject} disabled={!targetEntity.trim()}
                  className="text-xs font-mono px-4 py-2.5 rounded-xl bg-surface-tile-3 text-body-on-dark hover:bg-white/10 transition-colors disabled:opacity-40 whitespace-nowrap">
                  Save Context
                </button>
              </div>
              {projects.length > 0 ? (
                <div className="mt-4 space-y-2 max-h-52 overflow-y-auto">
                  {projects.map(p => (
                    <div key={p.id} className="flex items-center gap-3 bg-surface-black/50 rounded-xl px-4 py-3 border border-white/5">
                      <button onClick={() => loadProject(p)} className="flex-1 text-left min-w-0">
                        <p className="text-body-on-dark text-xs font-medium truncate hover:text-primary-on-dark transition-colors">{p.label}</p>
                        <p className="text-body-muted/50 text-xs font-mono mt-0.5">{new Date(p.createdAt).toLocaleDateString()} · {p.protocol}</p>
                      </button>
                      <button onClick={() => deleteProject(p.id)}
                        className="text-body-muted/30 hover:text-error transition-colors text-base font-mono shrink-0">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-body-muted/30 text-xs font-mono text-center py-4">
                  No saved projects. Fill the fields above and click &quot;Save Context&quot;.
                </p>
              )}
            </div>
          </AppleCard>

          {/* ── Prompt History ──────────────────────────────────────────────── */}
          <PromptHistory entries={history} onLoad={handleLoadHistory} onClear={handleClearHistory} />

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

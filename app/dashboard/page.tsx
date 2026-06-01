"use client";

import { useState, useEffect, useCallback } from "react";
import PayloadViewer from "@/components/PayloadViewer";
import PromptHistory, { HistoryEntry } from "@/components/PromptHistory";
import {
  generatePayload,
  GROQ_MODELS,
  INDUSTRY_TEMPLATES,
  DOMINANCE_PROTOCOLS,
} from "@/lib/payloadGenerator";

// ── localStorage keys ─────────────────────────────────────────────────────────
const LS_APIKEY    = "mpa_groq_api_key";
const LS_OBJECTIVE = "mpa_master_objective";
const LS_DIRECTIVES= "mpa_custom_directives";
const LS_HISTORY   = "mpa_prompt_history";
const LS_PROJECTS  = "mpa_projects";
const MAX_HISTORY  = 20;

// ── Safe localStorage helpers ─────────────────────────────────────────────────
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

// ── Types ─────────────────────────────────────────────────────────────────────
interface SavedProject {
  id: string;
  label: string;
  entity: string;
  context: string;
  masterObjective: string;
  protocol: string;
  createdAt: number;
}

function maskKey(key: string): string {
  if (!key) return "";
  if (key.length <= 8) return key.slice(0, 4) + "****";
  return key.slice(0, 7) + "*".repeat(Math.min(key.length - 7, 36));
}

// ── Toggle chip component ─────────────────────────────────────────────────────
function ToggleChip({
  active,
  onChange,
  label,
  sublabel,
  accent = "green",
}: {
  active: boolean;
  onChange: (v: boolean) => void;
  label: string;
  sublabel: string;
  accent?: "green" | "violet" | "amber";
}) {
  const colors = {
    green:  { on: "border-green-400/70 bg-green-400/10 text-green-400",  off: "border-white/10 text-white/30" },
    violet: { on: "border-violet-400/70 bg-violet-400/10 text-violet-300", off: "border-white/10 text-white/30" },
    amber:  { on: "border-amber-400/70 bg-amber-400/10 text-amber-300",   off: "border-white/10 text-white/30" },
  };
  const c = colors[accent];
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      className={`flex items-start gap-3 w-full text-left rounded-xl border px-4 py-3 transition-all ${active ? c.on : c.off} hover:border-white/20`}
    >
      <span className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
        active
          ? accent === "green"  ? "border-green-400 bg-green-400"
          : accent === "violet" ? "border-violet-400 bg-violet-400"
          : "border-amber-400 bg-amber-400"
          : "border-white/20"
      }`}>
        {active && <span className="text-black text-[10px] font-bold leading-none">✓</span>}
      </span>
      <span>
        <span className="block text-xs font-bold font-mono">{label}</span>
        <span className="block text-xs text-white/30 font-mono mt-0.5">{sublabel}</span>
      </span>
    </button>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  // ── Core inputs
  const [masterObjective,  setMasterObjective]  = useState("");
  const [targetEntity,     setTargetEntity]     = useState("");
  const [targetContext,    setTargetContext]     = useState("");
  const [protocol,         setProtocol]         = useState(DOMINANCE_PROTOCOLS[0].id);
  const [customDirectives, setCustomDirectives] = useState("");

  // ── Enhancement toggles
  const [mathDominance,        setMathDominance]        = useState(false);
  const [singularityIntelligence, setSingularityIntelligence] = useState(false);

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
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // ── Persistence
  const [history,      setHistory]      = useState<HistoryEntry[]>([]);
  const [projects,     setProjects]     = useState<SavedProject[]>([]);
  const [projectLabel, setProjectLabel] = useState("");

  // ── Hydrate from localStorage
  useEffect(() => {
    setApiKey(lsGet(LS_APIKEY));
    setMasterObjective(lsGet(LS_OBJECTIVE));
    setCustomDirectives(lsGet(LS_DIRECTIVES));
    setHistory(lsGetJSON<HistoryEntry[]>(LS_HISTORY, []));
    setProjects(lsGetJSON<SavedProject[]>(LS_PROJECTS, []));
  }, []);

  // ── Persist on change
  useEffect(() => { lsSet(LS_APIKEY,    apiKey); },           [apiKey]);
  useEffect(() => { lsSet(LS_OBJECTIVE, masterObjective); },  [masterObjective]);
  useEffect(() => { lsSet(LS_DIRECTIVES,customDirectives); }, [customDirectives]);

  // ── Quick templates
  const applyTemplate = (idx: number) => {
    const t = INDUSTRY_TEMPLATES[idx];
    setTargetEntity(t.entity);
    setTargetContext(t.context);
  };

  // ── Project vault
  const saveProject = () => {
    if (!targetEntity.trim()) return;
    const entry: SavedProject = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      label: projectLabel.trim() || targetEntity,
      entity: targetEntity,
      context: targetContext,
      masterObjective,
      protocol,
      createdAt: Date.now(),
    };
    const updated = [entry, ...projects].slice(0, 20);
    setProjects(updated);
    lsSet(LS_PROJECTS, JSON.stringify(updated));
    setProjectLabel("");
  };

  const loadProject = (p: SavedProject) => {
    setTargetEntity(p.entity);
    setTargetContext(p.context);
    setMasterObjective(p.masterObjective);
    setProtocol(p.protocol);
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    lsSet(LS_PROJECTS, JSON.stringify(updated));
  };

  // ── Reset API key
  const resetApiKey = () => { setApiKey(""); lsRemove(LS_APIKEY); };

  // ── Active layers count for badge
  const activeLayers = [mathDominance, singularityIntelligence].filter(Boolean).length;

  // ── Generate
  const handleGenerate = useCallback(async () => {
    setError(null);
    setPayload("");
    setLoading(true);
    try {
      const result = await generatePayload({
        targetEntity,
        targetContext,
        masterObjective,
        customDirectives,
        protocol,
        mathDominance,
        singularityIntelligence,
        apiKey,
        model,
        temperature,
      });
      setPayload(result.prompt);
      setTokensUsed(result.tokensUsed);
      setDurationMs(result.durationMs);
      setActiveModel(result.model);

      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        entity: targetEntity,
        model: result.model,
        tokensUsed: result.tokensUsed,
        durationMs: result.durationMs,
        prompt: result.prompt,
        createdAt: Date.now(),
      };
      const updated = [entry, ...history].slice(0, MAX_HISTORY);
      setHistory(updated);
      lsSet(LS_HISTORY, JSON.stringify(updated));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, [
    targetEntity, targetContext, masterObjective, customDirectives,
    protocol, mathDominance, singularityIntelligence,
    apiKey, model, temperature, history,
  ]);

  const handleLoadHistory = (entry: HistoryEntry) => {
    setPayload(entry.prompt);
    setTokensUsed(entry.tokensUsed);
    setDurationMs(entry.durationMs);
    setActiveModel(entry.model);
  };
  const handleClearHistory = () => { setHistory([]); lsRemove(LS_HISTORY); };

  // ── Derived
  const totalInputLen = masterObjective.length + targetEntity.length + targetContext.length + customDirectives.length;
  const estTokens     = Math.round(totalInputLen / 4);
  const canGenerate   = !loading && targetEntity.trim() && targetContext.trim() && apiKey.trim();
  const selectedProto = DOMINANCE_PROTOCOLS.find((p) => p.id === protocol);

  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-black px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-green-400 text-xs font-mono uppercase tracking-widest mb-1">
              Master Plan Architect
            </p>
            <h1 className="text-white text-3xl font-bold tracking-tight">MPA Terminal</h1>
            <p className="text-white/30 text-sm mt-1">
              MACH · Sovereign · State Machine · Edge-CRDT · Nobel-Grade Math · Groq
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {GROQ_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                  model === m.id
                    ? "border-green-400/70 bg-green-400/10 text-green-400"
                    : "border-white/10 text-white/30 hover:text-white/60"
                }`}
              >
                {m.label}
                <span className="ml-1 text-[10px] opacity-50">{m.speed}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Quick Templates ─────────────────────────────────────────────────── */}
        <div>
          <p className="text-white/25 text-xs font-mono uppercase tracking-wider mb-2">Quick Templates</p>
          <div className="flex gap-2 flex-wrap">
            {INDUSTRY_TEMPLATES.map((t, i) => (
              <button
                key={t.label}
                onClick={() => applyTemplate(i)}
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 text-white/30 hover:text-green-400 hover:border-green-400/40 transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Intelligence Layer Toggles ──────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-white/25 text-xs font-mono uppercase tracking-wider">
              Intelligence Layers
            </p>
            {activeLayers > 0 && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-green-400/20 text-green-400 border border-green-400/30">
                {activeLayers} active
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ToggleChip
              active={mathDominance}
              onChange={setMathDominance}
              accent="violet"
              label="Singularity-Edge Math"
              sublabel="CRDTs · Vickrey Auctions · Design by Contract · Web Workers"
            />
            <ToggleChip
              active={singularityIntelligence}
              onChange={setSingularityIntelligence}
              accent="amber"
              label="Singularity Intelligence Layer"
              sublabel="Kelly / Myerson / Pearl Causality / ZKP / TDA / Rough Paths / HJB"
            />
          </div>
        </div>

        {/* ── Control Panel / Vault ────────────────────────────────────────────── */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-5">

          {/* Master Objective */}
          <div>
            <label className="block text-white/50 text-xs font-mono uppercase tracking-wider mb-2">
              Master Objective / Current Project Context
            </label>
            <textarea
              value={masterObjective}
              onChange={(e) => setMasterObjective(e.target.value)}
              placeholder="e.g., 'I am building MPD, a private AI website builder. MPD's core function is to automatically wrap all user requests in MACH Enterprise Architecture...'"
              rows={3}
              className="w-full bg-black border border-white/20 text-white/80 text-sm rounded-lg px-4 py-3 placeholder-white/15 focus:outline-none focus:border-green-400/50 transition-colors resize-y font-mono leading-relaxed"
            />
          </div>

          {/* Target Entity */}
          <div>
            <label className="block text-white/50 text-xs font-mono uppercase tracking-wider mb-2">
              Target Entity
            </label>
            <input
              type="text"
              value={targetEntity}
              onChange={(e) => setTargetEntity(e.target.value)}
              placeholder="e.g., Fleet Management E-commerce"
              className="w-full bg-black border border-white/20 text-white text-sm rounded-lg px-4 py-3 placeholder-white/20 focus:outline-none focus:border-green-400/60 transition-colors"
            />
          </div>

          {/* Target Context / URL */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-white/50 text-xs font-mono uppercase tracking-wider">
                Target Context / URL
              </label>
              <span className="text-white/20 text-xs font-mono">~{estTokens} tokens input</span>
            </div>
            <textarea
              value={targetContext}
              onChange={(e) => setTargetContext(e.target.value)}
              placeholder="Describe the target architecture (e.g., 'Next.js Shopify storefront with custom checkout: https://example.com')."
              rows={4}
              className="w-full bg-black border border-white/20 text-white text-sm rounded-lg px-4 py-3 placeholder-white/20 focus:outline-none focus:border-green-400/60 transition-colors resize-y font-mono leading-relaxed"
            />
          </div>

          {/* Protocol + Custom Directives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-xs font-mono uppercase tracking-wider mb-2">
                Dominance Protocol
              </label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                className="w-full bg-black border border-white/20 text-green-400 text-sm font-mono rounded-lg px-4 py-3 focus:outline-none focus:border-green-400/60 appearance-none cursor-pointer transition-colors"
              >
                {DOMINANCE_PROTOCOLS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-black">{p.label}</option>
                ))}
              </select>
              {selectedProto && (
                <p className="mt-1.5 text-white/20 text-xs font-mono">{selectedProto.description}</p>
              )}
            </div>
            <div>
              <label className="block text-white/50 text-xs font-mono uppercase tracking-wider mb-2">
                Custom Directives{" "}
                <span className="text-white/20 normal-case">(Optional)</span>
              </label>
              <textarea
                value={customDirectives}
                onChange={(e) => setCustomDirectives(e.target.value)}
                placeholder="e.g., 'Use Tailwind v4', 'Avoid Redux'."
                rows={3}
                className="w-full bg-black border border-white/20 text-white/70 text-xs rounded-lg px-4 py-3 placeholder-white/15 focus:outline-none focus:border-green-400/50 transition-colors resize-y font-mono leading-relaxed"
              />
            </div>
          </div>

          {/* API Key */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-white/50 text-xs font-mono uppercase tracking-wider">
                Groq API Key{" "}
                <span className="text-white/20 normal-case">(persisted to localStorage)</span>
              </label>
              {apiKey && (
                <button
                  type="button"
                  onClick={resetApiKey}
                  className="text-xs font-mono text-red-400/60 hover:text-red-400 border border-red-500/20 hover:border-red-500/50 px-2 py-0.5 rounded transition-colors"
                >
                  Delete / Reset Key
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full bg-black border border-white/20 text-white text-sm rounded-lg px-4 py-3 pr-28 placeholder-white/20 focus:outline-none focus:border-green-400/60 transition-colors font-mono"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {apiKey && !showKey && (
                  <span className="text-white/20 text-xs font-mono hidden sm:inline">
                    {maskKey(apiKey)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="text-xs font-mono text-white/30 hover:text-white/60 transition-colors"
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          {/* Temperature + Generate */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-1">
            <div className="flex-1 w-full">
              <div className="flex justify-between mb-2">
                <label className="text-white/50 text-xs font-mono uppercase tracking-wider">Creativity</label>
                <span className="text-white/40 text-xs font-mono">{temperature.toFixed(1)}</span>
              </div>
              <input
                type="range" min={0.1} max={1.0} step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-green-400"
              />
              <div className="flex justify-between mt-1">
                <span className="text-white/20 text-xs font-mono">Precise</span>
                <span className="text-white/20 text-xs font-mono">Creative</span>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full sm:w-auto bg-green-400 text-black font-bold text-sm px-7 py-3 rounded-lg hover:bg-green-300 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                "Generate MACH Enterprise Prompt"
              )}
            </button>
          </div>

          {/* Active layers summary */}
          <div className="pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                ["CORE", "MACH + Sovereign + AMM", true],
                ["CRDT", "Edge Math + Vickrey", mathDominance],
                ["ZKP", "Nobel Intelligence Layer", singularityIntelligence],
                ["AOP", "Cross-Cutting Always On", true],
              ].map(([code, label, on]) => (
                <div key={String(code)} className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${on ? "bg-green-400/70" : "bg-white/10"}`} />
                  <span className={`text-xs font-mono ${on ? "text-white/30" : "text-white/10"}`}>
                    {String(code)}: {String(label)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Error ────────────────────────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <p className="text-red-400 text-xs font-mono whitespace-pre-wrap">{error}</p>
          </div>
        )}

        {/* ── Output ───────────────────────────────────────────────────────────── */}
        <PayloadViewer payload={payload} tokensUsed={tokensUsed} durationMs={durationMs} model={activeModel} />

        {/* ── Project Vault ─────────────────────────────────────────────────────── */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-white/50 text-xs font-mono uppercase tracking-widest">
              Project Vault {projects.length > 0 && `(${projects.length})`}
            </p>
          </div>
          <div className="p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={projectLabel}
                onChange={(e) => setProjectLabel(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveProject(); }}
                placeholder="Project name (optional)"
                className="flex-1 bg-black border border-white/15 text-white text-xs rounded-lg px-3 py-2 placeholder-white/15 focus:outline-none focus:border-green-400/40 transition-colors font-mono"
              />
              <button
                onClick={saveProject}
                disabled={!targetEntity.trim()}
                className="text-xs font-mono px-4 py-2 rounded-lg bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20 transition-colors disabled:opacity-40 whitespace-nowrap"
              >
                Save Context
              </button>
            </div>
            {projects.length > 0 ? (
              <div className="mt-3 space-y-1.5 max-h-52 overflow-y-auto">
                {projects.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 bg-black/30 rounded-lg px-3 py-2 border border-white/5">
                    <button onClick={() => loadProject(p)} className="flex-1 text-left min-w-0">
                      <p className="text-white/70 text-xs font-semibold truncate hover:text-green-400 transition-colors">{p.label}</p>
                      <p className="text-white/25 text-xs font-mono mt-0.5">
                        {new Date(p.createdAt).toLocaleDateString()} · {p.protocol}
                      </p>
                    </button>
                    <button onClick={() => deleteProject(p.id)} className="text-white/20 hover:text-red-400 text-sm font-mono transition-colors shrink-0">×</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-white/15 text-xs font-mono text-center py-4">
                No saved projects. Fill the fields above and click &quot;Save Context&quot;.
              </p>
            )}
          </div>
        </div>

        {/* ── Prompt History ────────────────────────────────────────────────────── */}
        <PromptHistory entries={history} onLoad={handleLoadHistory} onClear={handleClearHistory} />

      </div>
    </div>
  );
}

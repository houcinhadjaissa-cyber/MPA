"use client";

import { useState, useEffect, useCallback } from "react";
import PayloadViewer from "@/components/PayloadViewer";
import PromptHistory, { HistoryEntry } from "@/components/PromptHistory";
import {
  generatePayload,
  GROQ_MODELS,
  INDUSTRY_TEMPLATES,
} from "@/lib/payloadGenerator";

const HISTORY_KEY = "mpa_prompt_history";
const APIKEY_KEY = "mpa_groq_api_key";
const MAX_HISTORY = 20;

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
}

export default function Dashboard() {
  const [targetEntity, setTargetEntity] = useState("");
  const [targetContext, setTargetContext] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState(GROQ_MODELS[0].id);
  const [temperature, setTemperature] = useState(0.7);

  const [payload, setPayload] = useState("");
  const [tokensUsed, setTokensUsed] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [activeModel, setActiveModel] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
    const saved = localStorage.getItem(APIKEY_KEY) ?? "";
    if (saved) setApiKey(saved);
  }, []);

  useEffect(() => {
    if (apiKey) localStorage.setItem(APIKEY_KEY, apiKey);
  }, [apiKey]);

  const applyTemplate = (idx: number) => {
    const t = INDUSTRY_TEMPLATES[idx];
    setTargetEntity(t.entity);
    setTargetContext(t.context);
  };

  const handleGenerate = useCallback(async () => {
    setError(null);
    setPayload("");
    setLoading(true);
    try {
      const result = await generatePayload({
        targetEntity,
        targetContext,
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
      saveHistory(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [targetEntity, targetContext, apiKey, model, temperature, history]);

  const handleLoadHistory = (entry: HistoryEntry) => {
    setPayload(entry.prompt);
    setTokensUsed(entry.tokensUsed);
    setDurationMs(entry.durationMs);
    setActiveModel(entry.model);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const entityLen = targetEntity.length;
  const contextLen = targetContext.length;
  const estTokens = Math.round((entityLen + contextLen) / 4);
  const canGenerate = !loading && targetEntity.trim() && targetContext.trim() && apiKey.trim();

  return (
    <div className="min-h-screen bg-black px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-green-400 text-xs font-mono uppercase tracking-widest mb-1">
              Master Plan Architect
            </p>
            <h1 className="text-white text-3xl font-bold tracking-tight">
              MPA Terminal
            </h1>
            <p className="text-white/40 text-sm mt-1">
              MACH-Compliant Asset Lifecycle Module prompt generator · Powered by Groq
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {GROQ_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                  model === m.id
                    ? "border-green-400/70 bg-green-400/10 text-green-400"
                    : "border-white/10 text-white/30 hover:text-white/60 hover:border-white/20"
                }`}
              >
                {m.label}
                <span className="ml-1 text-[10px] opacity-60">{m.speed}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Industry Template Presets ── */}
        <div className="mb-4">
          <p className="text-white/30 text-xs font-mono uppercase tracking-wider mb-2">
            Quick Templates
          </p>
          <div className="flex gap-2 flex-wrap">
            {INDUSTRY_TEMPLATES.map((t, i) => (
              <button
                key={t.label}
                onClick={() => applyTemplate(i)}
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-green-400 hover:border-green-400/40 transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Control Panel ── */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-5">

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
              <span className="text-white/20 text-xs font-mono">
                {contextLen} chars · ~{estTokens} tokens input
              </span>
            </div>
            <textarea
              value={targetContext}
              onChange={(e) => setTargetContext(e.target.value)}
              placeholder="Describe the target architecture (e.g., 'Next.js Shopify storefront with custom checkout: https://example.com')."
              rows={5}
              className="w-full bg-black border border-white/20 text-white text-sm rounded-lg px-4 py-3 placeholder-white/20 focus:outline-none focus:border-green-400/60 transition-colors resize-y font-mono leading-relaxed"
            />
          </div>

          {/* Groq API Key */}
          <div>
            <label className="block text-white/50 text-xs font-mono uppercase tracking-wider mb-2">
              Groq API Key
              <span className="ml-2 text-white/20 normal-case">(saved to localStorage)</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full bg-black border border-white/20 text-white text-sm rounded-lg px-4 py-3 pr-20 placeholder-white/20 focus:outline-none focus:border-green-400/60 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-white/30 hover:text-white/60 transition-colors"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Temperature + Generate */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-1">
            <div className="flex-1 w-full">
              <div className="flex justify-between mb-2">
                <label className="text-white/50 text-xs font-mono uppercase tracking-wider">
                  Creativity
                </label>
                <span className="text-white/40 text-xs font-mono">{temperature.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.1}
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

          {/* MACH Pillars Legend */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              ["P1", "Predictive Maintenance"],
              ["P2", "Dynamic RTB Engine"],
              ["P3", "Forward Lifecycle SLAs"],
              ["P4", "Tokenized Ledger"],
              ["P5", "Federated Learning Telemetry"],
              ["P6", "CLV Maximization"],
            ].map(([code, label]) => (
              <div key={code} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 shrink-0" />
                <span className="text-white/25 text-xs font-mono">
                  {code}: {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <p className="text-red-400 text-xs font-mono">{error}</p>
          </div>
        )}

        {/* ── Payload Output ── */}
        <PayloadViewer
          payload={payload}
          tokensUsed={tokensUsed}
          durationMs={durationMs}
          model={activeModel}
        />

        {/* ── Prompt History ── */}
        <PromptHistory
          entries={history}
          onLoad={handleLoadHistory}
          onClear={handleClearHistory}
        />

      </div>
    </div>
  );
}

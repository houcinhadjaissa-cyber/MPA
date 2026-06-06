"use client";

import { useState } from "react";
import { Eye, EyeOff, Key, ChevronDown, ChevronUp } from "lucide-react";
import { INDUSTRY_TEMPLATES, DOMINANCE_PROTOCOLS, AI_MODELS, type IndustryTemplate } from "@/lib/mpa/templates";

interface ConfigPanelProps {
  apiKey: string;
  setApiKey: (v: string) => void;
  apiProvider: "groq" | "openai";
  setApiProvider: (v: "groq" | "openai") => void;
  model: string;
  setModel: (v: string) => void;
  masterObjective: string;
  setMasterObjective: (v: string) => void;
  targetEntity: string;
  setTargetEntity: (v: string) => void;
  targetContext: string;
  setTargetContext: (v: string) => void;
  protocol: string;
  setProtocol: (v: string) => void;
  customDirectives: string;
  setCustomDirectives: (v: string) => void;
  temperature: number;
  setTemperature: (v: number) => void;
  onTemplateSelect: (t: IndustryTemplate) => void;
  onGenerate: () => void;
  isLoading: boolean;
  canGenerate: boolean;
}

const FIELD = "w-full bg-[#0a0a0a] border border-white/8 text-white placeholder:text-gray-700 focus:border-[#00ff88]/30 outline-none transition-all rounded-xl px-3 py-2.5 text-xs font-mono";

export default function ConfigPanel({
  apiKey, setApiKey, apiProvider, setApiProvider, model, setModel,
  masterObjective, setMasterObjective, targetEntity, setTargetEntity,
  targetContext, setTargetContext, protocol, setProtocol,
  customDirectives, setCustomDirectives, temperature, setTemperature,
  onTemplateSelect, onGenerate, isLoading, canGenerate,
}: ConfigPanelProps) {
  const [showKey, setShowKey] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filteredModels = AI_MODELS.filter((m) => m.provider === apiProvider);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#0f0f0f] shrink-0">
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-400 font-semibold">Configuration</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">

        {/* Quick Templates */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2.5">Quick Templates</p>
          <div className="flex flex-wrap gap-1.5">
            {INDUSTRY_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => onTemplateSelect(t)}
                className="text-[10px] font-mono px-2.5 py-1.5 rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#222] transition-colors border border-white/6 active:scale-95"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Provider */}
        <div className="bg-[#111] rounded-xl border border-white/8 p-4 space-y-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">AI Provider</p>

          {/* Provider toggle */}
          <div className="flex gap-1 p-1 bg-[#0a0a0a] rounded-xl border border-white/6">
            <button
              onClick={() => { setApiProvider("groq"); setModel("llama-3.3-70b-versatile"); }}
              className={`flex-1 text-xs font-mono px-3 py-2 rounded-lg transition-all ${
                apiProvider === "groq"
                  ? "bg-[#00ff88] text-black font-bold"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Built-in AI
            </button>
            <button
              onClick={() => { setApiProvider("openai"); setModel("gpt-4o-mini"); }}
              className={`flex-1 text-xs font-mono px-3 py-2 rounded-lg transition-all ${
                apiProvider === "openai"
                  ? "bg-[#00ff88] text-black font-bold"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              OpenAI
            </button>
          </div>

          {apiProvider === "groq" && (
            <p className="text-[10px] font-mono text-gray-600">Powered by Groq · Llama 3.3 70B</p>
          )}

          {/* Model selection */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-600 mb-2">Model</p>
            <div className="space-y-1.5">
              {filteredModels.map((m) => {
                const isSelected = model === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-[#00ff88]/8 border-[#00ff88]/30"
                        : "bg-[#0a0a0a] border-white/6 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-[#00ff88]" : "bg-gray-700"}`} />
                      <span className={`text-sm font-medium font-mono ${isSelected ? "text-[#00ff88]" : "text-gray-300"}`}>
                        {m.label}
                      </span>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-[#00ff88]/20 text-[#00ff88]"
                        : "bg-white/5 text-gray-600"
                    }`}>
                      {m.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* API Key — only shown for groq if user wants custom key */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-600">
                {apiProvider === "groq" ? "Custom Groq Key" : "OpenAI API Key"} <span className="text-gray-700">(optional)</span>
              </p>
              <button onClick={() => setShowKey(!showKey)} className="text-gray-600 hover:text-white transition-colors">
                {showKey ? <EyeOff size={11} /> : <Eye size={11} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={apiProvider === "groq" ? "gsk_... (uses env var if empty)" : "sk-..."}
                className={FIELD + " pr-8"}
              />
              <Key size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700" />
            </div>
            <p className="text-gray-700 text-[9px] mt-1 font-mono">
              {apiProvider === "groq"
                ? "Leave empty to use server GROQ_API_KEY · Free key at console.groq.com"
                : "Set OPENAI_API_KEY in environment or enter here"}
            </p>
          </div>
        </div>

        {/* Project Config */}
        <div className="bg-[#111] rounded-xl border border-white/8 p-4 space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">⚡ Project Config</p>

          <div>
            <p className="text-[10px] font-mono text-gray-600 mb-1.5">Master Objective</p>
            <textarea
              value={masterObjective}
              onChange={(e) => setMasterObjective(e.target.value)}
              placeholder="High-level goal for the system you want to build..."
              className={FIELD}
              rows={3}
              style={{ resize: "none" }}
            />
            <p className="text-right text-gray-700 text-[9px] font-mono mt-0.5">{masterObjective.length}/2000</p>
          </div>

          <div>
            <p className="text-[10px] font-mono text-gray-600 mb-1.5">Target Entity <span className="text-red-500">*</span></p>
            <input
              type="text"
              value={targetEntity}
              onChange={(e) => setTargetEntity(e.target.value)}
              placeholder="e.g. Fleet Management E-commerce"
              className={FIELD}
            />
          </div>

          <div>
            <p className="text-[10px] font-mono text-gray-600 mb-1.5">Target Context / URL <span className="text-red-500">*</span></p>
            <textarea
              value={targetContext}
              onChange={(e) => setTargetContext(e.target.value)}
              placeholder="e.g. A Next.js + Shopify storefront selling commercial vehicle parts..."
              className={FIELD}
              rows={2}
              style={{ resize: "none" }}
            />
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#111] border border-white/6 text-gray-500 text-[10px] font-mono hover:text-gray-300 transition-colors"
        >
          <span>Advanced Settings</span>
          {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {showAdvanced && (
          <div className="bg-[#111] rounded-xl border border-white/8 p-4 space-y-4">
            {/* Custom Directives */}
            <div>
              <p className="text-[10px] font-mono text-gray-600 mb-1.5">Custom Directives</p>
              <textarea
                value={customDirectives}
                onChange={(e) => setCustomDirectives(e.target.value)}
                placeholder="Additional instructions for the AI architect..."
                className={FIELD}
                rows={2}
                style={{ resize: "none" }}
              />
            </div>

            {/* Protocol */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-600 mb-2">Dominance Protocol</p>
              <div className="flex flex-wrap gap-1.5">
                {DOMINANCE_PROTOCOLS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProtocol(p.id)}
                    className={`text-[10px] font-mono px-2.5 py-1.5 rounded-lg transition-all border ${
                      protocol === p.id
                        ? "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30"
                        : "bg-[#0a0a0a] text-gray-500 hover:text-white border-white/6"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-mono text-gray-600">Creativity</p>
                <span className="text-[#00ff88] text-[10px] font-mono font-bold">{temperature.toFixed(1)}</span>
              </div>
              <input
                type="range" min={0.1} max={1.0} step={0.1} value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1 rounded-full appearance-none bg-[#1a1a1a] accent-[#00ff88] cursor-pointer"
              />
              <div className="flex justify-between mt-1">
                <span className="text-gray-700 text-[9px] font-mono">Precise</span>
                <span className="text-gray-700 text-[9px] font-mono">Creative</span>
              </div>
            </div>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={onGenerate}
          disabled={!canGenerate || isLoading}
          className={`w-full py-4 rounded-xl font-bold text-sm font-mono transition-all ${
            canGenerate && !isLoading
              ? "bg-[#00ff88] text-black hover:bg-[#00e57a] active:scale-[0.98]"
              : "bg-[#1a1a1a] text-gray-600 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Generating…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>⚡</span> Generate Master Prompt
            </span>
          )}
        </button>

        {!canGenerate && !isLoading && (
          <p className="text-center text-gray-700 text-[10px] font-mono -mt-2">
            Fill in Target Entity and Target Context above
          </p>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}

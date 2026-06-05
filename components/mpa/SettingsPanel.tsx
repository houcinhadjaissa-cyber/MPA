"use client";

import { Eye, EyeOff, Key, Zap, Thermometer } from "lucide-react";
import { DOMINANCE_PROTOCOLS, AI_MODELS } from "@/lib/mpa/templates";

interface SettingsPanelProps {
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
  showKey: boolean;
  setShowKey: (v: boolean) => void;
  onGenerate: () => void;
  isLoading: boolean;
  canGenerate: boolean;
}

const INPUT =
  "w-full bg-[#0a0a0a] border border-white/10 text-white placeholder:text-gray-600 focus:border-emerald-500/40 outline-none transition-all rounded-xl px-3 py-2.5 text-xs font-mono";

export default function SettingsPanel({
  apiKey, setApiKey, apiProvider, setApiProvider, model, setModel,
  masterObjective, setMasterObjective, targetEntity, setTargetEntity,
  targetContext, setTargetContext, protocol, setProtocol,
  customDirectives, setCustomDirectives, temperature, setTemperature,
  showKey, setShowKey, onGenerate, isLoading, canGenerate,
}: SettingsPanelProps) {
  const filteredModels = AI_MODELS.filter((m) => m.provider === apiProvider);
  const selectedProto = DOMINANCE_PROTOCOLS.find((p) => p.id === protocol);

  return (
    <div className="space-y-4">

      {/* AI Provider */}
      <div className="bg-[#111] rounded-xl border border-white/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-emerald-400" />
          <p className="text-white text-xs font-medium">AI Provider</p>
        </div>

        <div className="flex gap-1 p-1 bg-[#0a0a0a] rounded-lg">
          <button
            onClick={() => { setApiProvider("groq"); setModel("llama3-70b-8192"); }}
            className={`flex-1 text-xs font-mono px-3 py-2 rounded-lg transition-all ${
              apiProvider === "groq"
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-gray-500 hover:text-white"
            }`}
          >
            Groq (Free)
          </button>
          <button
            onClick={() => { setApiProvider("openai"); setModel("gpt-4o-mini"); }}
            className={`flex-1 text-xs font-mono px-3 py-2 rounded-lg transition-all ${
              apiProvider === "openai"
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-gray-500 hover:text-white"
            }`}
          >
            OpenAI
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-gray-400 text-[10px] font-mono uppercase tracking-widest">
              {apiProvider === "groq" ? "Groq API Key" : "OpenAI API Key"}
            </p>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={apiProvider === "groq" ? "gsk_..." : "sk-..."}
              className={INPUT + " pr-10"}
            />
            <Key size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" />
          </div>
          <p className="text-gray-700 text-[10px] mt-1 font-mono">
            {apiProvider === "groq"
              ? "Free key at console.groq.com — also reads GROQ_API_KEY env var"
              : "Set OPENAI_API_KEY in Vercel env vars"}
          </p>
        </div>
      </div>

      {/* Model */}
      <div className="bg-[#111] rounded-xl border border-white/5 p-4">
        <p className="text-gray-400 text-[10px] font-mono uppercase tracking-widest mb-2">Model</p>
        <div className="flex gap-1 flex-wrap">
          {filteredModels.map((m) => (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              className={`text-[10px] font-mono px-2.5 py-1.5 rounded-lg transition-all ${
                model === m.id
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-[#0a0a0a] text-gray-500 hover:text-white border border-white/5"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target Config */}
      <div className="bg-[#111] rounded-xl border border-white/5 p-4 space-y-3">
        <p className="text-gray-400 text-[10px] font-mono uppercase tracking-widest">Target Configuration</p>

        <div>
          <p className="text-gray-500 text-[10px] font-mono mb-1.5">Master Objective</p>
          <textarea
            value={masterObjective}
            onChange={(e) => setMasterObjective(e.target.value)}
            placeholder="High-level goal for the system you want to build..."
            className={INPUT}
            rows={2}
            style={{ resize: "none" }}
          />
        </div>

        <div>
          <p className="text-gray-500 text-[10px] font-mono mb-1.5">
            Target Entity <span className="text-red-400">*</span>
          </p>
          <input
            type="text"
            value={targetEntity}
            onChange={(e) => setTargetEntity(e.target.value)}
            placeholder="e.g. Fleet Management E-commerce"
            className={INPUT}
          />
        </div>

        <div>
          <p className="text-gray-500 text-[10px] font-mono mb-1.5">
            Target Context / URL <span className="text-red-400">*</span>
          </p>
          <textarea
            value={targetContext}
            onChange={(e) => setTargetContext(e.target.value)}
            placeholder="e.g. A Next.js + Shopify storefront selling commercial vehicle parts..."
            className={INPUT}
            rows={2}
            style={{ resize: "none" }}
          />
        </div>

        <div>
          <p className="text-gray-500 text-[10px] font-mono mb-1.5">Custom Directives</p>
          <textarea
            value={customDirectives}
            onChange={(e) => setCustomDirectives(e.target.value)}
            placeholder="Additional instructions for the AI..."
            className={INPUT}
            rows={2}
            style={{ resize: "none" }}
          />
        </div>
      </div>

      {/* Protocol */}
      <div className="bg-[#111] rounded-xl border border-white/5 p-4">
        <p className="text-gray-400 text-[10px] font-mono uppercase tracking-widest mb-2">
          Dominance Protocol
        </p>
        <div className="flex gap-1 flex-wrap mb-2">
          {DOMINANCE_PROTOCOLS.map((p) => (
            <button
              key={p.id}
              onClick={() => setProtocol(p.id)}
              className={`text-[10px] font-mono px-2.5 py-1.5 rounded-lg transition-all ${
                protocol === p.id
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-[#0a0a0a] text-gray-500 hover:text-white border border-white/5"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {selectedProto && (
          <p className="text-gray-700 text-[10px] font-mono">{selectedProto.description}</p>
        )}
      </div>

      {/* Creativity */}
      <div className="bg-[#111] rounded-xl border border-white/5 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Thermometer size={12} className="text-gray-400" />
            <p className="text-white text-xs font-medium">Creativity</p>
          </div>
          <span className="text-gray-400 text-xs font-mono">{temperature.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min={0.1}
          max={1.0}
          step={0.1}
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full h-1 accent-emerald-500"
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-gray-600 text-[10px] font-mono">Precise</span>
          <span className="text-gray-600 text-[10px] font-mono">Creative</span>
        </div>
      </div>

      {/* Generate */}
      <button
        onClick={onGenerate}
        disabled={!canGenerate}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm font-mono transition-all ${
          canGenerate
            ? "bg-emerald-500 text-black hover:bg-emerald-400"
            : "bg-[#1a1a1a] text-gray-600 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            Generating…
          </span>
        ) : (
          "Generate MACH Enterprise Prompt"
        )}
      </button>

      {!apiKey && (
        <p className="text-center text-gray-600 text-xs font-mono">
          ↑ Add your API key above to enable generation
        </p>
      )}
    </div>
  );
}

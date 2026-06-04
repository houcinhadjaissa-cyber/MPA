"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PayloadViewerProps {
  payload: string;
  tokensUsed?: number;
  durationMs?: number;
  model?: string;
  isStreaming?: boolean;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function scorePrompt(text: string): { score: number; label: string; color: string } {
  let score = 0;
  const sections = ["ROLE", "ARCHITECTURE", "STACK", "API", "DATABASE", "COMPONENT", "DEPLOY", "TEST", "SECURITY", "ERROR"];
  for (const s of sections) {
    if (text.toUpperCase().includes(s)) score += 10;
  }
  if (text.length > 5000) score += 10;
  if (text.length > 12000) score += 10;
  const capped = Math.min(score, 100);
  let label = "Developing";
  let color = "#F59E0B";
  if (capped >= 80) { label = "Enterprise-Grade"; color = "#30D158"; }
  else if (capped >= 60) { label = "Production-Ready"; color = "#2997FF"; }
  else if (capped >= 40) { label = "Functional"; color = "#F59E0B"; }
  return { score: capped, label, color };
}

export default function PayloadViewer({ payload, tokensUsed, durationMs, model, isStreaming }: PayloadViewerProps) {
  const [copied, setCopied] = useState(false);
  const [rawMode, setRawMode] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      const el = document.createElement("textarea");
      el.value = payload;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([payload], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mpa-prompt-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([payload], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mpa-prompt-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!payload && !isStreaming) return null;

  const words = countWords(payload);
  const chars = payload.length;
  const quality = payload.length > 100 ? scorePrompt(payload) : null;

  return (
    <div className="bg-[#2C2C2E] rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/5 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[#30D158] text-xs font-mono uppercase tracking-widest flex items-center gap-2">
            Enterprise Prompt
            {isStreaming && (
              <span className="w-2 h-2 rounded-full bg-[#2997FF] animate-pulse inline-block" />
            )}
          </span>
          {(tokensUsed ?? 0) > 0 && (
            <span className="text-gray-500 text-xs font-mono">
              {tokensUsed?.toLocaleString()} tokens
              {durationMs !== undefined && ` · ${(durationMs / 1000).toFixed(1)}s`}
              {model && ` · ${model.split("-").slice(0, 2).join("-")}`}
            </span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setRawMode(v => !v)}
            className="text-xs font-mono px-3 py-1.5 rounded-full bg-[#3A3A3C] text-gray-400 hover:text-white transition-colors border border-white/5"
          >
            {rawMode ? "Raw" : "Wrap"}
          </button>
          <button
            onClick={handleDownloadTxt}
            className="text-xs font-mono px-3 py-1.5 rounded-full bg-[#3A3A3C] text-gray-400 hover:text-white transition-colors border border-white/5"
          >
            .txt
          </button>
          <button
            onClick={handleDownloadMd}
            className="text-xs font-mono px-3 py-1.5 rounded-full bg-[#3A3A3C] text-gray-400 hover:text-white transition-colors border border-white/5"
          >
            .md
          </button>
          <button
            onClick={handleCopy}
            className="text-xs font-mono px-4 py-1.5 rounded-full bg-[#30D158]/10 text-[#30D158] hover:bg-[#30D158]/20 transition-colors border border-[#30D158]/20 font-semibold"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.1 }}
              >
                {copied ? "✓ Copied!" : "Copy Prompt"}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-5 pt-3 pb-0 flex items-center gap-4 flex-wrap">
        {chars > 0 && (
          <>
            <span className="text-gray-600 text-xs font-mono">{chars.toLocaleString()} chars</span>
            <span className="text-gray-700 text-xs font-mono">·</span>
            <span className="text-gray-600 text-xs font-mono">{words.toLocaleString()} words</span>
          </>
        )}
        {quality && (
          <>
            <span className="text-gray-700 text-xs font-mono">·</span>
            <span className="text-xs font-mono flex items-center gap-1.5">
              <span className="text-gray-500">Quality:</span>
              <span style={{ color: quality.color }} className="font-semibold">
                {quality.label}
              </span>
              <span className="text-gray-600">({quality.score}/100)</span>
            </span>
          </>
        )}
      </div>

      {/* Content */}
      <div className="overflow-auto max-h-[600px] mt-3">
        <pre
          className={`bg-[#0A0A0A] mx-4 mb-4 rounded-xl px-5 py-4 text-[#30D158] text-xs font-mono leading-relaxed ${
            rawMode ? "whitespace-pre overflow-x-auto" : "whitespace-pre-wrap break-words"
          }`}
        >
          <code>{payload}</code>
          {isStreaming && !payload && (
            <span className="text-[#2997FF] animate-pulse">▋</span>
          )}
        </pre>
      </div>

      {/* Footer hint */}
      {payload && !isStreaming && (
        <div className="px-5 pb-4">
          <p className="text-gray-700 text-[10px] font-mono text-center">
            Paste this prompt in Replit, Cursor, or any AI coding tool to build the described application.
          </p>
        </div>
      )}
    </div>
  );
}

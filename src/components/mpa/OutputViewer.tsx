"use client";

import { useState } from "react";
import { Copy, Download, Check, FileText } from "lucide-react";

interface OutputViewerProps {
  payload: string;
  tokensUsed?: number;
  durationMs?: number;
  model?: string;
  isStreaming?: boolean;
}

function scorePrompt(text: string): { score: number; label: string; color: string } {
  let score = 0;
  const sections = ["ROLE", "ARCHITECTURE", "STACK", "API", "DATABASE", "COMPONENT", "DEPLOY", "TEST", "SECURITY", "ERROR"];
  for (const s of sections) {
    if (text.toUpperCase().includes(s)) score += 10;
  }
  if (text.length > 5000)  score += 10;
  if (text.length > 12000) score += 10;
  const capped = Math.min(score, 100);
  let label = "Developing";
  let color = "#F59E0B";
  if (capped >= 80) { label = "Enterprise-Grade"; color = "#10B981"; }
  else if (capped >= 60) { label = "Production-Ready"; color = "#06B6D4"; }
  else if (capped >= 40) { label = "Functional"; color = "#F59E0B"; }
  return { score: capped, label, color };
}

export default function OutputViewer({ payload, tokensUsed, durationMs, model, isStreaming }: OutputViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(payload); } catch {
      const el = document.createElement("textarea");
      el.value = payload;
      el.style.cssText = "position:fixed;left:-9999px;opacity:0;";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (ext: string) => {
    const type = ext === "md" ? "text/markdown" : "text/plain";
    const blob = new Blob([payload], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mpa-prompt-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!payload && !isStreaming) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-3 p-8">
        <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center">
          <FileText size={20} className="text-gray-600" />
        </div>
        <p className="text-gray-600 text-sm font-mono">No output yet</p>
        <p className="text-gray-700 text-xs">Click Generate or send a message to create a prompt</p>
      </div>
    );
  }

  const { score, label, color } = payload ? scorePrompt(payload) : { score: 0, label: "", color: "#F59E0B" };
  const wordCount = payload.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#111] shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          {payload && (
            <>
              <span className="text-xs font-mono font-bold" style={{ color }}>{label}</span>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-20 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: color }} />
                </div>
                <span className="text-gray-600 text-[10px] font-mono">{score}%</span>
              </div>
            </>
          )}
          {isStreaming && (
            <span className="text-cyan-400 text-xs font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Streaming…
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!payload}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              copied
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5 hover:border-white/20"
            } disabled:opacity-30`}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={() => downloadFile("md")}
            disabled={!payload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5 hover:border-white/20 transition-all disabled:opacity-30"
          >
            <Download size={11} /> .md
          </button>
        </div>
      </div>

      {payload && (
        <div className="flex items-center gap-4 px-4 py-2 border-b border-white/5 bg-[#0d0d0d] shrink-0 flex-wrap">
          <span className="text-gray-600 text-[10px] font-mono">{wordCount.toLocaleString()} words</span>
          {tokensUsed && <span className="text-gray-600 text-[10px] font-mono">~{tokensUsed.toLocaleString()} tokens</span>}
          {durationMs && <span className="text-gray-600 text-[10px] font-mono">{(durationMs / 1000).toFixed(1)}s</span>}
          {model && <span className="text-gray-700 text-[10px] font-mono">{model}</span>}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <pre className="text-gray-300 text-xs font-mono leading-relaxed whitespace-pre-wrap break-words select-text">
          {payload}
          {isStreaming && <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-0.5 animate-pulse align-middle" />}
        </pre>
      </div>
    </div>
  );
}

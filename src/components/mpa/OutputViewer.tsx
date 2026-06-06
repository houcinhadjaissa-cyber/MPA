"use client";

import { useState } from "react";
import { Copy, Download, Check, Code2, Sparkles } from "lucide-react";
import { scoreOutput, formatTokenCount, getModelDisplayName } from "@/lib/mpa/payloadGenerator";

interface OutputViewerProps {
  payload: string;
  tokensUsed?: number;
  durationMs?: number;
  model?: string;
  isStreaming?: boolean;
  onGenerateNow?: () => void;
}

export default function OutputViewer({ payload, tokensUsed, durationMs, model, isStreaming, onGenerateNow }: OutputViewerProps) {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"raw" | "preview">("raw");

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(payload); } catch {
      const el = document.createElement("textarea");
      el.value = payload;
      el.style.cssText = "position:fixed;left:-9999px;opacity:0;";
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (ext: string) => {
    const type = ext === "md" ? "text/markdown" : "text/plain";
    const blob = new Blob([payload], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `mpa-prompt-${Date.now()}.${ext}`; a.click();
    URL.revokeObjectURL(url);
  };

  if (!payload && !isStreaming) {
    return (
      <div className="flex flex-col h-full bg-[#0a0a0a]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#0f0f0f] shrink-0">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500 font-semibold">Output Console</p>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-5 px-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#141414] border border-white/8 flex items-center justify-center">
            <Code2 size={22} className="text-gray-600" />
          </div>
          <div className="space-y-1.5">
            <p className="text-white text-base font-medium">Output Console</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Set your objective in the sidebar,<br />then hit <span className="text-[#00ff88] font-semibold">GENERATE</span> in the chat panel.
            </p>
          </div>
          {onGenerateNow && (
            <button
              onClick={onGenerateNow}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00ff88] text-black text-sm font-bold font-mono hover:bg-[#00e57a] transition-colors"
            >
              <Sparkles size={14} />
              GENERATE NOW
            </button>
          )}
        </div>
      </div>
    );
  }

  const { score, label, color, wordCount } = payload
    ? scoreOutput(payload)
    : { score: 0, label: "", color: "#6B7280", wordCount: 0 };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#0f0f0f] shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500 font-semibold">Output Console</p>
          {payload && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold" style={{ color }}>{label}</span>
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-16 bg-[#1f1f1f] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: color }} />
                </div>
                <span className="text-gray-600 text-[9px] font-mono">{score}%</span>
              </div>
            </div>
          )}
          {isStreaming && (
            <span className="text-[#00ff88] text-[10px] font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
              Generating…
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            disabled={!payload}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition-all ${
              copied
                ? "bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/6"
            } disabled:opacity-30`}
          >
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={() => downloadFile("md")}
            disabled={!payload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/6 transition-all disabled:opacity-30"
          >
            <Download size={10} /> .md
          </button>
          <button
            onClick={() => downloadFile("txt")}
            disabled={!payload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/6 transition-all disabled:opacity-30"
          >
            <Download size={10} /> .txt
          </button>
        </div>
      </div>

      {/* Stats bar */}
      {payload && (
        <div className="flex items-center gap-4 px-4 py-2 border-b border-white/5 bg-[#0d0d0d] shrink-0 flex-wrap">
          <span className="text-gray-600 text-[9px] font-mono">{wordCount.toLocaleString()} words</span>
          {tokensUsed && <span className="text-gray-600 text-[9px] font-mono">~{formatTokenCount(tokensUsed)} tokens</span>}
          {durationMs && <span className="text-gray-600 text-[9px] font-mono">{(durationMs / 1000).toFixed(1)}s</span>}
          {model && <span className="text-gray-700 text-[9px] font-mono">{getModelDisplayName(model)}</span>}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <pre className="text-gray-300 text-xs font-mono leading-relaxed whitespace-pre-wrap break-words select-text">
          {payload}
          {isStreaming && <span className="inline-block w-1.5 h-3.5 bg-[#00ff88] ml-0.5 animate-pulse align-middle" />}
        </pre>
      </div>
    </div>
  );
}

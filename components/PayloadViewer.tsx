"use client";

import { useState } from "react";

interface PayloadViewerProps {
  payload: string;
  tokensUsed?: number;
  durationMs?: number;
  model?: string;
}

export default function PayloadViewer({
  payload,
  tokensUsed,
  durationMs,
  model,
}: PayloadViewerProps) {
  const [copied, setCopied] = useState(false);

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

  const handleDownload = () => {
    const blob = new Blob([payload], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mpa-prompt-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!payload) return null;

  return (
    <div className="mt-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-green-400 text-xs font-mono uppercase tracking-widest">
            MACH Enterprise Prompt
          </span>
          {tokensUsed !== undefined && tokensUsed > 0 && (
            <span className="text-white/30 text-xs font-mono">
              {tokensUsed} tokens · {durationMs !== undefined ? (durationMs / 1000).toFixed(1) + "s" : ""} ·{" "}
              {model?.split("-").slice(0, 2).join("-")}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-white/20 text-white/50 hover:bg-white/5 transition-colors"
          >
            Download .txt
          </button>
          <button
            onClick={handleCopy}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-green-400/40 text-green-400 hover:bg-green-400/10 transition-colors"
          >
            {copied ? "✓ Copied" : "Copy to Clipboard"}
          </button>
        </div>
      </div>
      <div className="overflow-auto max-h-[60vh]">
        <pre className="p-4 text-green-400 text-xs font-mono leading-relaxed whitespace-pre-wrap">
          <code>{payload}</code>
        </pre>
      </div>
    </div>
  );
}

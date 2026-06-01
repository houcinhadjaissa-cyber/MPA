"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PayloadViewerProps {
  payload: string;
  tokensUsed?: number;
  durationMs?: number;
  model?: string;
}

export default function PayloadViewer({ payload, tokensUsed, durationMs, model }: PayloadViewerProps) {
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
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `mpa-prompt-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!payload) return null;

  return (
    <div className="bg-surface-tile-1 rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/5 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-success text-xs font-mono uppercase tracking-widest">
            Enterprise Prompt
          </span>
          {(tokensUsed ?? 0) > 0 && (
            <span className="text-body-muted/50 text-xs font-mono">
              {tokensUsed} tokens
              {durationMs !== undefined && ` · ${(durationMs / 1000).toFixed(1)}s`}
              {model && ` · ${model.split("-").slice(0, 2).join("-")}`}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={handleDownload}
            className="text-xs font-mono px-3 py-1.5 rounded-full bg-surface-tile-2 text-body-muted hover:bg-surface-tile-3 hover:text-body-on-dark transition-colors border border-white/5">
            Download .txt
          </button>
          <button onClick={handleCopy}
            className="text-xs font-mono px-3 py-1.5 rounded-full bg-success/10 text-success hover:bg-success/20 transition-colors border border-success/20">
            <AnimatePresence mode="wait">
              <motion.span key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}>
                {copied ? "✓ Copied!" : "Copy Prompt"}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Size info */}
      <div className="px-5 pt-3 pb-1">
        <span className="text-body-muted/40 text-xs font-mono">
          {payload.length.toLocaleString()} chars
        </span>
      </div>

      {/* Content */}
      <div className="overflow-auto max-h-[500px]">
        <pre className="px-5 pb-5 pt-2 text-success text-xs font-mono leading-relaxed whitespace-pre-wrap break-words">
          <code>{payload}</code>
        </pre>
      </div>
    </div>
  );
}

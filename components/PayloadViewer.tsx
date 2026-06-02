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
    a.href = url; a.download = `mpa-prompt-${Date.now()}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  if (!payload) return null;

  return (
    <div className="bg-[#2C2C2E] rounded-2xl border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/5 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[#30D158] text-xs font-mono uppercase tracking-widest">Enterprise Prompt</span>
          {(tokensUsed ?? 0) > 0 && (
            <span className="text-gray-500 text-xs font-mono">
              {tokensUsed} tokens
              {durationMs !== undefined && ` · ${(durationMs / 1000).toFixed(1)}s`}
              {model && ` · ${model.split("-").slice(0, 2).join("-")}`}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={handleDownload}
            className="text-xs font-mono px-3 py-1.5 rounded-full bg-[#3A3A3C] text-gray-400 hover:text-white transition-colors border border-white/5">
            Download .txt
          </button>
          <button onClick={handleCopy}
            className="text-xs font-mono px-3 py-1.5 rounded-full bg-[#30D158]/10 text-[#30D158] hover:bg-[#30D158]/20 transition-colors border border-[#30D158]/20">
            <AnimatePresence mode="wait">
              <motion.span key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.1 }}>
                {copied ? "✓ Copied!" : "Copy Prompt"}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="px-5 pt-3 pb-1">
        <span className="text-gray-600 text-xs font-mono">{payload.length.toLocaleString()} chars</span>
      </div>

      <div className="overflow-auto max-h-[500px]">
        <pre className="bg-[#0A0A0A] mx-4 mb-4 mt-2 rounded-xl px-5 py-4 text-[#30D158] text-xs font-mono leading-relaxed whitespace-pre-wrap break-words">
          <code>{payload}</code>
        </pre>
      </div>
    </div>
  );
}

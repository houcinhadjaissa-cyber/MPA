"use client";

import { useState } from "react";

interface PayloadViewerProps {
  payload: string;
}

export default function PayloadViewer({ payload }: PayloadViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = payload;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!payload) return null;

  return (
    <div className="mt-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-green-400 text-xs font-mono uppercase tracking-widest">
          Surgical Payload
        </span>
        <button
          onClick={handleCopy}
          className="text-xs font-mono px-3 py-1.5 rounded-lg border border-green-400/40 text-green-400 hover:bg-green-400/10 transition-colors"
        >
          {copied ? "✓ Copied" : "Copy Syringe to Clipboard"}
        </button>
      </div>
      <div className="overflow-auto max-h-[60vh]">
        <pre className="p-4 text-green-400 text-xs font-mono leading-relaxed whitespace-pre">
          <code>{payload}</code>
        </pre>
      </div>
    </div>
  );
}

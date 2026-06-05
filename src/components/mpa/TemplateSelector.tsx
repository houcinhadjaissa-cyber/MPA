"use client";

import { INDUSTRY_TEMPLATES, type IndustryTemplate } from "@/lib/mpa/templates";

interface TemplateSelectorProps {
  onSelect: (template: IndustryTemplate) => void;
}

export default function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">Quick Templates</p>
      <div className="flex gap-1.5 flex-wrap">
        {INDUSTRY_TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="text-[10px] font-mono px-2.5 py-1.5 rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#222] transition-colors border border-white/5"
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

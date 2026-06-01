"use client";

import { useState } from "react";
import PayloadViewer from "@/components/PayloadViewer";
import { generatePayload } from "@/lib/payloadGenerator";

const INDUSTRIES = ["Automotive", "Grocery", "Bio-Medical", "Real Estate"] as const;
type Industry = (typeof INDUSTRIES)[number];

export default function Dashboard() {
  const [industry, setIndustry] = useState<Industry>("Automotive");
  const [payload, setPayload] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setPayload("");
    setTimeout(() => {
      const result = generatePayload(industry);
      setPayload(result);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-black px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-green-400 text-xs font-mono uppercase tracking-widest mb-1">
            Master Plan Architect
          </p>
          <h1 className="text-white text-3xl font-bold tracking-tight">
            MPA Terminal
          </h1>
          <p className="text-white/40 text-sm mt-2">
            Select your industry vertical. Generate a surgical payload.
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            {/* Dropdown */}
            <div className="flex-1 w-full">
              <label className="block text-white/50 text-xs font-mono uppercase tracking-wider mb-2">
                Industry Vertical
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as Industry)}
                className="w-full bg-black border border-white/20 text-green-400 font-mono text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-green-400/60 appearance-none cursor-pointer"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind} className="bg-black text-green-400">
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full sm:w-auto bg-green-400 text-black font-bold text-sm px-6 py-3 rounded-lg hover:bg-green-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? "Generating..." : "Generate Surgical Payload"}
            </button>
          </div>

          {/* Pillar Legend */}
          <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              "Precision Signal",
              "Price Certainty",
              "Dynamic Load",
              "Liability Surface",
              "Velocity Index",
              "Decay Monitor",
            ].map((pillar, i) => (
              <div key={pillar} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 shrink-0" />
                <span className="text-white/30 text-xs font-mono">
                  P{i + 1}: {pillar}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payload Output */}
        <PayloadViewer payload={payload} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: "> Initializing MPA Terminal v2.0…", delay: 0, color: "#9CA3AF" },
  { text: "> Loading Core Matrix………………… ", delay: 280, color: "#9CA3AF", suffix: "OK", suffixColor: "#30D158" },
  { text: "> Mounting Intelligence Layers……… ", delay: 560, color: "#9CA3AF", suffix: "17 LOADED", suffixColor: "#30D158" },
  { text: "> Sovereign Protocol handshake……… ", delay: 840, color: "#9CA3AF", suffix: "COMPLETE", suffixColor: "#30D158" },
  { text: "> Verifying Groq endpoint…………… ", delay: 1120, color: "#9CA3AF", suffix: "CONNECTED", suffixColor: "#30D158" },
  { text: "> APEX-DEFENSE fortress……………… ", delay: 1400, color: "#9CA3AF", suffix: "ACTIVE", suffixColor: "#30D158" },
  { text: "> Restoring session state…………… ", delay: 1680, color: "#9CA3AF", suffix: "OK", suffixColor: "#30D158" },
  { text: "", delay: 1900, color: "#9CA3AF" },
  { text: "> MPA TERMINAL READY.", delay: 2100, color: "#30D158" },
  { text: "> Welcome, Architect.", delay: 2400, color: "#30D158" },
];

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
      }, line.delay));
    });

    timers.push(setTimeout(() => {
      setDone(true);
      setTimeout(onComplete, 400);
    }, 2900));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 bg-[#0A0A0A] flex items-center justify-center"
        >
          <div className="w-full max-w-lg px-8">
            <div className="mb-8 text-center">
              <p className="text-[#30D158] text-[10px] font-mono uppercase tracking-[0.3em] mb-1">
                MASTER PLAN ARCHITECT
              </p>
              <p className="text-white text-xs font-mono opacity-40">
                MACH · Sovereign · Monte Carlo · ZK · Fractal · Media Oracle · APEX-DEFENSE
              </p>
            </div>

            <div className="font-mono text-xs leading-6 space-y-0">
              {BOOT_LINES.map((line, i) => (
                <AnimatePresence key={i}>
                  {visibleLines.includes(i) && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-1"
                    >
                      {line.text && (
                        <span style={{ color: line.color }}>{line.text}</span>
                      )}
                      {line.suffix && (
                        <span style={{ color: line.suffixColor }} className="font-semibold">
                          {line.suffix}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}

              {visibleLines.length > 0 && visibleLines.length < BOOT_LINES.length && (
                <span className="text-[#30D158] animate-pulse">▋</span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

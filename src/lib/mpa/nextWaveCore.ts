// MPA Next-Wave Core — Next-generation layer processing & streaming engine

import type { LayerState } from "./layers";

export interface WaveConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  streamingEnabled: boolean;
  retryPolicy: RetryPolicy;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffMs: number;
  backoffMultiplier: number;
  jitterMs: number;
}

export const DEFAULT_WAVE_CONFIG: WaveConfig = {
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
  maxTokens: 8000,
  streamingEnabled: false,
  retryPolicy: {
    maxAttempts: 3,
    backoffMs: 1000,
    backoffMultiplier: 2,
    jitterMs: 200,
  },
};

export interface WaveResult {
  content: string;
  tokensUsed: number;
  durationMs: number;
  model: string;
  attempts: number;
  success: boolean;
  errorCode?: string;
}

export type LayerCategory = "math" | "strategy" | "intelligence" | "execution" | "meta";

export interface LayerWeight {
  key: keyof LayerState;
  category: LayerCategory;
  weight: number;
  amplifies?: Array<keyof LayerState>;
}

const LAYER_WEIGHTS: LayerWeight[] = [
  { key: "mathDominance",          category: "math",          weight: 1.4, amplifies: ["singularityIntelligence", "monteCarlo"] },
  { key: "singularityIntelligence",category: "math",          weight: 1.5, amplifies: ["zkVerification"] },
  { key: "monteCarlo",             category: "strategy",      weight: 1.3, amplifies: ["fractalEconomy"] },
  { key: "zkVerification",         category: "strategy",      weight: 1.2 },
  { key: "fractalEconomy",         category: "intelligence",  weight: 1.1 },
  { key: "regenerativeSovereignty",category: "intelligence",  weight: 1.0 },
  { key: "omniNode",               category: "intelligence",  weight: 1.1 },
  { key: "mediaOracle",            category: "intelligence",  weight: 1.0 },
  { key: "reverseEngineering",     category: "intelligence",  weight: 1.2 },
  { key: "apexDefense",            category: "execution",     weight: 1.6, amplifies: ["omegaTopology", "ergodicSync"] },
  { key: "omegaTopology",          category: "execution",     weight: 1.3 },
  { key: "ergodicSync",            category: "execution",     weight: 1.2 },
  { key: "omegaAbsolute",          category: "execution",     weight: 1.4 },
  { key: "singularityEngine",      category: "meta",          weight: 1.7, amplifies: ["retractor", "omegaSecurity", "sinEater"] },
  { key: "retractor",              category: "meta",          weight: 1.3 },
  { key: "omegaSecurity",          category: "meta",          weight: 1.5 },
  { key: "sinEater",               category: "meta",          weight: 1.4 },
];

export function computeWaveScore(layers: LayerState): number {
  let score = 1.0;
  for (const lw of LAYER_WEIGHTS) {
    if (layers[lw.key]) {
      score *= lw.weight;
      if (lw.amplifies) {
        for (const amp of lw.amplifies) {
          if (layers[amp]) score *= 1.05;
        }
      }
    }
  }
  return Math.round(score * 100) / 100;
}

export function recommendNextLayers(layers: LayerState): Array<keyof LayerState> {
  const inactive = LAYER_WEIGHTS.filter((lw) => !layers[lw.key]);
  const active = LAYER_WEIGHTS.filter((lw) => layers[lw.key]);

  const amplifiedByActive = new Set<keyof LayerState>();
  for (const lw of active) {
    lw.amplifies?.forEach((k) => amplifiedByActive.add(k));
  }

  return inactive
    .filter((lw) => amplifiedByActive.has(lw.key))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((lw) => lw.key);
}

export function getLayerSynergies(layers: LayerState): string[] {
  const synergies: string[] = [];
  if (layers.mathDominance && layers.singularityIntelligence)
    synergies.push("Math Foundation amplified: Kelly + Myerson + TDA compound active");
  if (layers.monteCarlo && layers.fractalEconomy)
    synergies.push("Strategy cascade: MCTS paths pre-computed via fractal yield");
  if (layers.apexDefense && layers.omegaTopology)
    synergies.push("Defense-Resonance fusion: WASM sandbox + ART vigilance unified");
  if (layers.singularityEngine && layers.sinEater)
    synergies.push("Meta convergence: Reflexive architecture + emergence swarm locked");
  return synergies;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  policy: RetryPolicy = DEFAULT_WAVE_CONFIG.retryPolicy
): Promise<{ result: T; attempts: number }> {
  let lastError: unknown;
  let delay = policy.backoffMs;

  for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
    try {
      const result = await fn();
      return { result, attempts: attempt };
    } catch (err) {
      lastError = err;
      if (attempt < policy.maxAttempts) {
        const jitter = Math.random() * policy.jitterMs;
        await new Promise((r) => setTimeout(r, delay + jitter));
        delay *= policy.backoffMultiplier;
      }
    }
  }

  throw lastError;
}

export function buildWaveHeaders(apiKey?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-MPA-Version": "2.0.0",
    "X-MPA-Client": "web",
  };
  if (apiKey) headers["X-MPA-Key-Present"] = "true";
  return headers;
}

export function parseModelCapabilities(modelId: string): {
  contextWindow: number;
  streamable: boolean;
  reasoningEnabled: boolean;
} {
  const base = { streamable: true, reasoningEnabled: false };
  if (modelId.includes("70b") || modelId.includes("versatile"))
    return { ...base, contextWindow: 128_000, reasoningEnabled: true };
  if (modelId.includes("8b"))
    return { ...base, contextWindow: 8_192 };
  if (modelId.includes("mixtral"))
    return { ...base, contextWindow: 32_768 };
  return { ...base, contextWindow: 8_192 };
}

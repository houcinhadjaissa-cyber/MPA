// MPA Payload Generator — Advanced prompt payload construction engine

import type { LayerState } from "./layers";
import { buildSystemPrompt } from "./layers";
import { computeWaveScore, getLayerSynergies } from "./nextWaveCore";
import { getActiveDirectives, composeDirectiveStack, estimateTokenBudget } from "./omegaCore";
import { generateSyncId } from "./crypto";

export interface GenerationConfig {
  masterObjective: string;
  targetEntity: string;
  targetContext: string;
  protocol: string;
  customDirectives: string;
  layers: LayerState;
  model: string;
  temperature: number;
}

export interface GeneratedPayload {
  id: string;
  systemPrompt: string;
  userMessage: string;
  waveScore: number;
  estimatedTokens: number;
  synergies: string[];
  activeLayerCount: number;
  createdAt: number;
  fingerprint: string;
}

export function buildUserMessage(cfg: GenerationConfig): string {
  const parts: string[] = [];

  parts.push(`Generate a comprehensive, production-ready MACH Enterprise System Prompt for:`);
  parts.push(`\nENTITY: ${cfg.targetEntity || "a new software system"}`);

  if (cfg.targetContext) {
    parts.push(`CONTEXT: ${cfg.targetContext}`);
  }

  if (cfg.masterObjective) {
    parts.push(`MASTER OBJECTIVE: ${cfg.masterObjective}`);
  }

  parts.push(`DOMINANCE PROTOCOL: ${cfg.protocol.toUpperCase()}`);

  if (cfg.customDirectives) {
    parts.push(`CUSTOM DIRECTIVES: ${cfg.customDirectives}`);
  }

  const activeLayerCount = Object.values(cfg.layers).filter(Boolean).length;
  if (activeLayerCount > 0) {
    parts.push(`\nACTIVE INTELLIGENCE LAYERS: ${activeLayerCount} layers loaded — weave all active layer directives into the final architecture.`);
  }

  parts.push(`\nREQUIREMENTS:
- Minimum 2,500 words. Target 4,000+.
- Must be paste-ready into Replit Agent, Cursor, or Claude.
- Include: Role Definition, Project Architecture, Tech Stack (with versions), File Structure, Database Schema, API Specification, UI Component Tree, Implementation Order, Security Architecture, Testing Strategy, Deployment Guide, Error Handling, Performance Targets.
- Zero ambiguity. An AI must be able to build the ENTIRE system from this prompt alone.`);

  return parts.join("\n");
}

export function buildFollowUpMessage(question: string, context: GenerationConfig): string {
  const hasLayers = Object.values(context.layers).filter(Boolean).length > 0;
  const ctx = hasLayers
    ? `[Context: ${context.targetEntity} · ${Object.values(context.layers).filter(Boolean).length} layers active]`
    : `[Context: ${context.targetEntity}]`;
  return `${ctx}\n\n${question}`;
}

export function assemblePayload(cfg: GenerationConfig): GeneratedPayload {
  const activeDirectives = getActiveDirectives({
    layers: cfg.layers,
    objective: cfg.masterObjective,
    entity: cfg.targetEntity,
    protocol: cfg.protocol,
    temperature: cfg.temperature,
  });

  const systemPrompt = buildSystemPrompt(cfg);
  const omegaBlock = composeDirectiveStack(activeDirectives);
  const fullSystemPrompt = omegaBlock ? `${omegaBlock}\n\n${systemPrompt}` : systemPrompt;

  const waveScore = computeWaveScore(cfg.layers);
  const activeLayerCount = Object.values(cfg.layers).filter(Boolean).length;
  const estimatedTokens = estimateTokenBudget(activeLayerCount);
  const synergies = getLayerSynergies(cfg.layers);
  const id = generateSyncId();
  const fingerprint = `mpa-${Date.now().toString(36)}-${id.slice(0, 8)}`;

  return {
    id,
    systemPrompt: fullSystemPrompt,
    userMessage: buildUserMessage(cfg),
    waveScore,
    estimatedTokens,
    synergies,
    activeLayerCount,
    createdAt: Date.now(),
    fingerprint,
  };
}

export function scoreOutput(text: string): { score: number; label: string; color: string; wordCount: number } {
  let score = 0;
  const checks = [
    { term: "ROLE",         pts: 8  },
    { term: "ARCHITECTURE", pts: 10 },
    { term: "STACK",        pts: 8  },
    { term: "API",          pts: 8  },
    { term: "DATABASE",     pts: 8  },
    { term: "COMPONENT",    pts: 6  },
    { term: "DEPLOY",       pts: 8  },
    { term: "TEST",         pts: 8  },
    { term: "SECURITY",     pts: 10 },
    { term: "ERROR",        pts: 6  },
    { term: "PERFORMANCE",  pts: 6  },
    { term: "SCHEMA",       pts: 6  },
    { term: "IMPLEMENT",    pts: 6  },
    { term: "ENDPOINT",     pts: 6  },
  ];

  const upper = text.toUpperCase();
  for (const c of checks) {
    if (upper.includes(c.term)) score += c.pts;
  }

  if (text.length > 5_000)  score += 5;
  if (text.length > 10_000) score += 5;
  if (text.length > 15_000) score += 5;

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount > 2000) score += 5;
  if (wordCount > 4000) score += 5;

  const capped = Math.min(score, 100);

  let label = "Developing";
  let color = "#F59E0B";

  if (capped >= 85) { label = "Enterprise-Grade"; color = "#10B981"; }
  else if (capped >= 70) { label = "Production-Ready"; color = "#06B6D4"; }
  else if (capped >= 50) { label = "Functional";       color = "#8B5CF6"; }
  else if (capped >= 30) { label = "Developing";       color = "#F59E0B"; }
  else                   { label = "Draft";            color = "#6B7280"; }

  return { score: capped, label, color, wordCount };
}

export function formatTokenCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function getModelDisplayName(modelId: string): string {
  const map: Record<string, string> = {
    "llama-3.3-70b-versatile": "GLM-4 Flash",
    "llama3-70b-8192":         "GLM-4 Plus",
    "llama3-8b-8192":          "LLaMA 3 8B",
    "mixtral-8x7b-32768":      "Mixtral 8x7B",
    "gemma2-9b-it":            "Gemma 2 9B",
    "gpt-4o-mini":             "GPT-4o Mini",
    "gpt-4o":                  "GPT-4o",
  };
  return map[modelId] ?? modelId;
}

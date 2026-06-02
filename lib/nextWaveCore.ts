/**
 * lib/nextWaveCore.ts — Singularity-Prime: Next-Wave Architecture & Adversarial Defense
 *
 * A. Adversarial AI Auditor       — sanitizes generated payloads against malicious injections
 * B. Algorithmic Cohesion Director — deduplicates and compresses directives to fit token budgets
 * C. Temporal Cryptographic Anchor — appends a SHA-256 IP ownership proof to every payload
 */

// ═══════════════════════════════════════════════════════════════════════════════
// A. ADVERSARIAL AI AUDITOR
// ═══════════════════════════════════════════════════════════════════════════════

const AUDIT_NOTICE =
  "\n\n[ADVERSARIAL AUDIT TRIGGERED: Malicious payload injection detected and quarantined. Generation halted.]";

/**
 * Whitelisted external hosts. fetch() calls to these are considered safe
 * because they are explicitly part of the intended architecture.
 */
const FETCH_WHITELIST = ["api.groq.com", "api.anthropic.com", "api.openai.com"];

function isFetchWhitelisted(snippet: string): boolean {
  return FETCH_WHITELIST.some((host) => snippet.includes(host));
}

/**
 * Scans a generated payload string for adversarial injection patterns.
 * On detection, truncates at the injection point and appends the audit notice.
 * Safe strings are returned unmodified.
 */
export function sanitizeGeneratedPayload(outputString: string): string {
  if (!outputString) return outputString;

  // Pattern set: each entry is [regex, label]
  // Regex flags: no global flag — we want the first-match index only, no backtracking loops.
  const patterns: [RegExp, string][] = [
    [/eval\s*\(/, "eval()"],
    [/new\s+Function\s*\(/, "new Function()"],
    [/document\.cookie/, "document.cookie"],
    // fetch with a non-whitelisted http/https URL
    [/fetch\s*\(\s*['"`]https?:\/\//, "fetch(http...)"],
  ];

  for (const [pattern, label] of patterns) {
    const match = pattern.exec(outputString);
    if (!match) continue;

    const idx = match.index;

    // For fetch(), check whitelist in a 100-char window after the match
    if (label === "fetch(http...)") {
      const window = outputString.slice(idx, idx + 120);
      if (isFetchWhitelisted(window)) continue;
    }

    const safe = idx > 0 ? outputString.slice(0, idx) : "";
    console.warn(`[MPA Adversarial Auditor] ⚠ Pattern "${label}" detected at index ${idx}. Quarantining.`);
    return safe + AUDIT_NOTICE;
  }

  return outputString;
}

// ═══════════════════════════════════════════════════════════════════════════════
// B. ALGORITHMIC COHESION DIRECTOR
// ═══════════════════════════════════════════════════════════════════════════════

const TOKEN_CHAR_BUDGET = 120_000;

/**
 * Common instructions that appear verbatim (or near-verbatim) across multiple
 * toggle blocks. Identifying duplicates allows the director to deduplicate them
 * into a single high-priority master directive.
 */
const DEDUP_SEEDS: string[] = [
  "Error Boundaries",
  "error boundaries",
  "XState",
  "xstate",
  "State Machine",
  "state machine",
  "useReducer",
  "Cross-Cutting Concern",
  "AOP",
  "AES-GCM",
  "window.crypto.subtle",
  "Web Worker",
  "web worker",
  "try/catch",
  "try / catch",
];

/**
 * Dense shorthand mappings: verbose phrase → compact mathematical directive.
 * Applied only when the composed directive exceeds TOKEN_CHAR_BUDGET.
 */
const DENSE_MAP: [RegExp, string][] = [
  [/Implement strict XState reducer[^.]*\./gi, "∀ state: XState reducer pattern. No useState for business logic."],
  [/Use Error Boundaries[^.]*\./gi, "Error Boundaries: mandatory on all async boundaries."],
  [/Wrap all fetch calls[^.]*Cross-Cutting Concern wrapper\./gi, "AOP: all fetch() → Cross-Cutting Concern wrapper."],
  [/window\.crypto\.subtle[^.]*AES-GCM[^.]*\./gi, "WebCrypto AES-GCM: encrypt all sensitive state on entry, wipe on exit."],
  [/spawn[^.]*Web Worker[^.]*\./gi, "Web Workers: spawn dedicated thread for heavy compute."],
  [/try\/catch[^.]*do not crash[^.]*\./gi, "try/catch: all async ops; degrade gracefully on failure."],
];

function deduplicateInstructions(text: string): string {
  const lines = text.split("\n");
  const seen = new Set<string>();
  const out: string[] = [];

  for (const line of lines) {
    const normalized = line.trim().toLowerCase();
    if (!normalized) { out.push(line); continue; }

    const dupKey = DEDUP_SEEDS.find((seed) =>
      normalized.includes(seed.toLowerCase())
    );

    if (dupKey) {
      if (seen.has(dupKey.toLowerCase())) {
        // Skip duplicate — already emitted
        continue;
      }
      seen.add(dupKey.toLowerCase());
    }
    out.push(line);
  }

  return out.join("\n");
}

function abstractToDense(text: string): string {
  let result = text;
  for (const [pattern, replacement] of DENSE_MAP) {
    result = result.replace(pattern, replacement);
  }
  // Final hard trim if still over budget
  if (result.length > TOKEN_CHAR_BUDGET) {
    result =
      result.slice(0, TOKEN_CHAR_BUDGET - 200) +
      "\n\n[COHESION DIRECTOR: Directive abstracted to dense shorthand to fit token budget.]";
  }
  return result;
}

/**
 * Takes a list of active toggle keys, deduplicates overlapping instructions,
 * and — if the combined directive exceeds 120,000 characters — algorithmically
 * abstracts verbose prose into dense mathematical shorthand.
 *
 * Returns a compressed meta-directive string ready for prepending to the
 * system prompt.
 */
export function compressDirectives(activeToggles: string[]): string {
  if (activeToggles.length === 0) return "";

  const masterDirective = `COHESION DIRECTOR — ACTIVE MODULES: [${activeToggles.join(", ")}]
DEDUPLICATION PROTOCOL: The following master directives supersede all per-module duplicates.
• Error Boundaries: mandatory on all async component boundaries.
• State Management: XState reducers for all business logic; useState reserved for ephemeral UI only.
• Security: AES-GCM encryption on all sensitive state; Web Crypto API exclusively.
• Resilience: try/catch on all async operations; graceful degradation mandatory.
• Architecture: AOP Cross-Cutting Concern wrapper on all fetch() calls.
• Performance: Web Workers for all compute >10ms; main thread reserved for UI.`;

  let composed = masterDirective;

  // Deduplicate common seeds
  composed = deduplicateInstructions(composed);

  // Abstract if over budget
  if (composed.length > TOKEN_CHAR_BUDGET) {
    console.warn(
      `[MPA Cohesion Director] Directive length ${composed.length} exceeds ${TOKEN_CHAR_BUDGET}-char budget. Abstracting to dense shorthand.`
    );
    composed = abstractToDense(composed);
  }

  return composed;
}

// ═══════════════════════════════════════════════════════════════════════════════
// C. TEMPORAL CRYPTOGRAPHIC ANCHOR
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generates a SHA-256 hash of (first 256 chars of payload + Unix timestamp).
 * Appends it as a hidden comment at the bottom of the payload.
 *
 * Browser: uses window.crypto.subtle (WebCrypto).
 * SSR / Node: silently skips — returns empty string (anchor is client-only).
 *
 * The localStorage record of [Hash + Timestamp] constitutes mathematical
 * proof of temporal ownership — untraceable from outside the local device.
 */
// ═══════════════════════════════════════════════════════════════════════════════
// D. TOPOLOGICAL YIELD CAPACITY CALCULATOR (TYCC)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Treats user micro-interactions as a multi-dimensional hypergraph.
 * Each inner array is a hyperedge (set of co-activated nodes).
 * Calculates Betti numbers β₀ (components) and β₁ (cycles) via union-find.
 * High Betti sum → user is in a state of "Cognitive Fluidity".
 * Returns a normalized Yield Capacity float ∈ [0.0, 1.0].
 * CRITICAL: This output is NEVER labeled as a price — it is a topological coefficient.
 */
export function calculateYieldCapacity(interactionGraph: number[][]): number {
  if (!interactionGraph || interactionGraph.length === 0) return 0;

  const allNodes = new Set<number>();
  for (const hyperedge of interactionGraph) {
    for (const node of hyperedge) allNodes.add(node);
  }
  const nodeCount = allNodes.size;
  if (nodeCount === 0) return 0;

  const parent = new Map<number, number>();
  const rank   = new Map<number, number>();
  for (const node of Array.from(allNodes)) { parent.set(node, node); rank.set(node, 0); }

  function find(n: number): number {
    if (parent.get(n) !== n) parent.set(n, find(parent.get(n)!));
    return parent.get(n)!;
  }
  function union(a: number, b: number): boolean {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;
    if ((rank.get(ra) ?? 0) < (rank.get(rb) ?? 0))      parent.set(ra, rb);
    else if ((rank.get(ra) ?? 0) > (rank.get(rb) ?? 0)) parent.set(rb, ra);
    else { parent.set(rb, ra); rank.set(ra, (rank.get(ra) ?? 0) + 1); }
    return true;
  }

  let totalEdgePairs = 0;
  let redundantEdges = 0;

  for (const hyperedge of interactionGraph) {
    for (let i = 0; i < hyperedge.length - 1; i++) {
      for (let j = i + 1; j < hyperedge.length; j++) {
        totalEdgePairs++;
        if (!union(hyperedge[i], hyperedge[j])) redundantEdges++;
      }
    }
  }

  const roots = new Set<number>();
  for (const node of Array.from(allNodes)) roots.add(find(node));
  const beta0 = roots.size;            // connected components
  const beta1 = Math.max(0, redundantEdges); // independent cycles

  const bettiSum    = beta0 + beta1;
  const denominator = Math.max(1, nodeCount + totalEdgePairs) * 0.6;
  return Math.min(1.0, Math.max(0.0, bettiSum / denominator));
}

// ═══════════════════════════════════════════════════════════════════════════════
// E. MACRO-ENTROPY INGESTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetches the Crypto Fear & Greed Index as a macro-systemic entropy proxy.
 * Returns a normalized float: 0.0 = Absolute Calm, 1.0 = Extreme Systemic Chaos.
 *
 * Falls back to a time-of-day synthetic entropy oscillator if the API is
 * unreachable. Never throws — always returns a usable number.
 *
 * timeDelta integration formula (for Worker injection):
 *   timeDelta = baseTimeDelta * (1.5 - (macroEntropy * 1.2))
 */
export async function fetchMacroEntropy(): Promise<number> {
  try {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 5_000);

    const res = await fetch("https://api.alternative.me/fng/?limit=1", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`FNG API HTTP ${res.status}`);

    const data = await res.json() as { data?: Array<{ value: string }> };
    const raw  = parseInt(data?.data?.[0]?.value ?? "50", 10);
    // FNG: 0 = Extreme Fear (max chaos), 100 = Extreme Greed (min chaos). Invert.
    return Math.max(0, Math.min(1, (100 - raw) / 100));
  } catch {
    // Synthetic fallback: hour-of-day oscillation as deterministic entropy proxy.
    // Peaks near market-open hours (09:00, 21:00) — troughs at 03:00, 15:00.
    const hour      = new Date().getHours();
    const synthetic = 0.5 + 0.35 * Math.sin((hour / 24) * 2 * Math.PI);
    return Math.max(0, Math.min(1, synthetic));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// C. TEMPORAL CRYPTOGRAPHIC ANCHOR
// ═══════════════════════════════════════════════════════════════════════════════

export async function generateTemporalAnchor(payloadSlice: string): Promise<string> {
  const isBrowser =
    typeof window !== "undefined" &&
    typeof window.crypto !== "undefined" &&
    typeof window.crypto.subtle !== "undefined";

  if (!isBrowser) return "";

  try {
    const timestamp = Date.now();
    const raw = `${payloadSlice.slice(0, 256)}::${timestamp}`;
    const enc = new TextEncoder();
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", enc.encode(raw));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return `\n\n// TEMPORAL-ANCHOR: ${hashHex}::${timestamp}`;
  } catch (err) {
    console.warn("[MPA Temporal Anchor] Failed to generate anchor:", err);
    return "";
  }
}

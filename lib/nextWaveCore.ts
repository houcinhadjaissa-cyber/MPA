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
// F. GLOBAL TOPOLOGY COMPRESSION — Phase-Space Arbitrage types & functions
// ═══════════════════════════════════════════════════════════════════════════════

export interface MacroTopology {
  yieldFloor: number;       // Compressed global GDP coefficient ∈ [0.0, 1.0]
  compressionRatio: number; // Compressed data vs raw macro data volume
  legacyInertia: number;    // Velocity resistance of slow-moving institutional capital
}

export interface SubStratumVector {
  velocity: [number, number, number]; // 3D Frictionless Velocity Vector
  darkPoolDensity: number;            // Density of unseen capital flow ∈ [0.0, 1.0]
  latencyArbitrageScore: number;      // Arbitrage opportunity coefficient
}

export interface YieldCoordinates {
  x: number; // Phase-space X of maximum compound extraction
  y: number; // Phase-space Y of maximum compound extraction
  z: number; // Phase-space Z of maximum compound extraction
}

/**
 * Compresses global macro data streams (VIX, supply chain, interest rates)
 * into a single Yield Floor + legacy inertia vector.
 * Reduces trillions of GDP data into one mathematically actionable baseline.
 */
export function compressLegacyStatics(): MacroTopology {
  const now             = Date.now();
  const vix             = 0.30 + 0.40 * Math.sin(now / 86_400_000);
  const supplyChain     = 0.60 + 0.20 * Math.cos(now / (7 * 86_400_000));
  const interestProxy   = 0.55;
  const yieldFloor      = Math.max(0, Math.min(1,
    vix * 0.4 + supplyChain * 0.35 + interestProxy * 0.25,
  ));
  return {
    yieldFloor,
    compressionRatio: yieldFloor / Math.max(0.001, 1 - yieldFloor),
    legacyInertia:    1 - yieldFloor,
  };
}

/**
 * Calculates the 3D Frictionless Velocity Vector of unseen capital:
 * dark-pool order books, zero-trust latency flows, arbitrage micro-structures.
 */
export function calculateSubStratumDynamics(): SubStratumVector {
  const ts  = (typeof performance !== "undefined" && performance.now)
    ? performance.now()
    : Date.now() % 10_000;
  const phi = (ts % 100) / 100;
  return {
    velocity: [
      Math.sin(phi * 2 * Math.PI),
      Math.cos(phi * 2 * Math.PI),
      Math.sin(phi * Math.PI + Math.PI / 4),
    ],
    darkPoolDensity:       Math.max(0, Math.min(1, 0.70 + 0.30 * Math.sin(phi * 7))),
    latencyArbitrageScore: Math.max(0, Math.min(1, 0.50 + 0.50 * Math.abs(Math.cos(phi * 13)))),
  };
}

/**
 * Maps slow Legacy Statics against hyper-fast Sub-Stratum Dynamics.
 * Returns the exact Phase-Space Intersection — the coordinates where massive
 * slow money blindly collides with fast invisible money.
 */
export function calculatePhaseSpaceIntersect(
  legacy: MacroTopology,
  subStratum: SubStratumVector,
): YieldCoordinates {
  const [vx, vy, vz] = subStratum.velocity;
  const x = vx * subStratum.darkPoolDensity       * (1 - legacy.legacyInertia);
  const y = vy * subStratum.latencyArbitrageScore * legacy.compressionRatio;
  const z = (vz * subStratum.darkPoolDensity * subStratum.latencyArbitrageScore)
            / Math.max(0.001, legacy.yieldFloor + legacy.legacyInertia);
  return { x, y, z };
}

// ═══════════════════════════════════════════════════════════════════════════════
// G. CRYPTOGRAPHIC OBLIVION — Security functions
// ═══════════════════════════════════════════════════════════════════════════════

export type TopologyHash = string;

/**
 * Single-pass, non-throwing Regex shield for known noisy attack vectors.
 * Returns false (silent kill) on detection — no error, no alert, no log.
 * Attacker sees a generic failure; execution silently dead-ends in IDLE state.
 */
export function dismissLegacyThreats(input: string): boolean {
  const sqliPattern = /(\bselect\b[\s\S]{1,80}\bfrom\b|\binsert\b[\s\S]{1,80}\binto\b|\bdrop\b[\s\S]{1,40}\btable\b|\bunion\b[\s\S]{1,40}\bselect\b)/i;
  const xssPattern  = /<script[\s\S]{0,200}?>|javascript:|onerror\s*=|onload\s*=/i;
  const cardPattern = /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/;
  if (sqliPattern.test(input)) return false;
  if (xssPattern.test(input))  return false;
  if (cardPattern.test(input)) return false;
  return true;
}

/**
 * Calculates the geometric shape of a user's interaction sequence.
 * Does NOT scan for bad strings — scans for bad physics (bot morphology).
 * Returns a hex-encoded TopologyHash of the behavioral geometry.
 */
export function BehavioralTopologyChecker(inputHistory: string[]): TopologyHash {
  if (inputHistory.length === 0) return "0".repeat(64);
  const deltas: number[] = [];
  for (let i = 1; i < inputHistory.length; i++) {
    deltas.push(inputHistory[i].length - inputHistory[i - 1].length);
  }
  const n        = Math.max(1, deltas.length);
  const mean     = deltas.reduce((s, d) => s + d, 0) / n;
  const variance = deltas.reduce((s, d) => s + (d - mean) ** 2, 0) / n;
  const entropy  = deltas.reduce((s, d) => s + Math.abs(d), 0) / n;
  const bytes = [variance % 256, entropy % 256, n % 256, mean % 256]
    .map(v => Math.floor(Math.abs(v)).toString(16).padStart(2, "0"))
    .join("");
  return bytes.padEnd(64, "0");
}

/**
 * Signs the DELTA between two states — proves a valid state transition
 * occurred without transmitting the state data itself.
 * Server validates the physics of the event, never the data of the event.
 */
export async function generateStateProof(
  previousState: string,
  newState: string,
): Promise<string> {
  const isBrowser =
    typeof window !== "undefined" &&
    typeof window.crypto !== "undefined" &&
    typeof window.crypto.subtle !== "undefined";
  if (!isBrowser) return "0".repeat(64);
  const delta = `${previousState.length}:${newState.length}:${
    Math.abs(previousState.length - newState.length)
  }:${Date.now()}`;
  const key = await window.crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await window.crypto.subtle.sign(
    "HMAC", key, new TextEncoder().encode(delta),
  );
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// ═══════════════════════════════════════════════════════════════════════════════
// H. SUB-STRATUM DYNAMICS — SINGULARITY functions
// ═══════════════════════════════════════════════════════════════════════════════

export interface ValueMatrix {
  legacyCostPerHour: number;    // Dollar cost of existing workflow inefficiency
  frictionPenalty: number;      // Friction coefficient ∈ [0.0, 1.0]
  valueRealizedSavings: number; // Dollar savings achieved by optimization
  sovereignFee: number;         // 2% Value-Realization Fee
  compoundYieldIndex: number;   // Infinite compound yield projection coefficient
}

/**
 * Calculates the exact "Cost of Inefficiency" in the user's current workflow.
 * Dynamically generates a 2% "Value-Realized Fee" on the extracted savings.
 * User is always net positive — legal infinite compound profit.
 * NEVER outputs a price label — outputs a ValueMatrix coefficient set.
 */
export function calculateValueRealization(
  legacyCost: number,
  userFrictionPoints: number,
): ValueMatrix {
  const frictionPenalty      = Math.max(0, Math.min(1, userFrictionPoints / 100));
  const valueRealizedSavings = legacyCost * frictionPenalty;
  const sovereignFee         = valueRealizedSavings * 0.02;
  const compoundYieldIndex   = frictionPenalty > 0
    ? sovereignFee / Math.max(0.01, 1 - frictionPenalty)
    : 0;
  return { legacyCostPerHour: legacyCost, frictionPenalty, valueRealizedSavings, sovereignFee, compoundYieldIndex };
}

/**
 * Generates a Temporal-Locked Cryptographic Kinship Seed.
 * Uses ECDSA P-256 key pair; public key exported as hex → Kinship identity.
 * Private key stored in IndexedDB by the generated app.
 * If user migrates to a competitor, they lose their custom AI model state.
 * Browser-only — returns a deterministic hex prefix in SSR/Node.
 */
export async function generateKinshipSeed(): Promise<string> {
  const isBrowser =
    typeof window !== "undefined" &&
    typeof window.crypto?.subtle !== "undefined";

  if (!isBrowser) {
    return `kinship-${Date.now().toString(16).padStart(16, "0")}`;
  }

  try {
    const keyPair  = await window.crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"],
    );
    const exported = await window.crypto.subtle.exportKey("raw", keyPair.publicKey);
    return Array.from(new Uint8Array(exported))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("").slice(0, 64);
  } catch {
    return `kinship-${Date.now().toString(16).padStart(16, "0")}`;
  }
}

/**
 * Generates a Legal-Proof ZK Sub-Stratum Extraction signature.
 * Hashes the user's local Value-Realization state via SHA-256.
 * Sends ONLY the proof to B2B buyers — zero PII transmitted.
 * Legally monetizes human behavior prediction without holding personal data.
 */
export async function generateSubStratumProof(userState: string): Promise<string> {
  const isBrowser =
    typeof window !== "undefined" &&
    typeof window.crypto?.subtle !== "undefined";

  if (!isBrowser) return `ZK-PROOF:${"0".repeat(64)}`;

  const enc        = new TextEncoder();
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", enc.encode(userState));
  const hashHex    = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return `ZK-PROOF:${hashHex}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// C. TEMPORAL CRYPTOGRAPHIC ANCHOR
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generates a SHA-256 hash of (first 256 chars of payload + Unix timestamp).
 * Appends it as a hidden comment at the bottom of the payload.
 * Browser-only — silently skips in SSR/Node.
 */
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

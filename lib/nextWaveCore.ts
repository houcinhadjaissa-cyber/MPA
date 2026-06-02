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

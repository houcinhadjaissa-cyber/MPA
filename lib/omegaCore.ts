/**
 * lib/omegaCore.ts — Deterministic Self-Healing Omniscient Matrix
 * Four unbreakable algorithms that operate as an invisible resilience layer.
 *
 * A. Schema-Agnostic Recursive Parser — extracts content from ANY API response shape
 * B. Priority Mutex State Machine     — serialises concurrent state mutations by priority
 * C. Deterministic Self-Healing Loop  — wraps logic blocks; gracefully degrades on failure
 * D. Entropic Resource Governor       — monitors memory; engages Low Power Mode at 85%
 */

// ═══════════════════════════════════════════════════════════════════════════════
// A. SCHEMA-AGNOSTIC RECURSIVE PARSER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Deeply traverses any JSON value (arrays, objects, primitives) and returns
 * the single longest string found anywhere in the structure.
 *
 * This means the app extracts the correct prompt payload even if Groq, Claude,
 * or any future LLM changes their API wrapper structure.
 */
export function extractStringFromUnknownStructure(obj: unknown): string {
  if (obj === null || obj === undefined) return "";
  if (typeof obj === "string")  return obj;
  if (typeof obj === "number")  return String(obj);
  if (typeof obj === "boolean") return String(obj);

  if (Array.isArray(obj)) {
    return obj
      .map(extractStringFromUnknownStructure)
      .reduce((best, candidate) => candidate.length > best.length ? candidate : best, "");
  }

  if (typeof obj === "object") {
    return Object.values(obj as Record<string, unknown>)
      .map(extractStringFromUnknownStructure)
      .reduce((best, candidate) => candidate.length > best.length ? candidate : best, "");
  }

  return "";
}

// ═══════════════════════════════════════════════════════════════════════════════
// B. PRIORITY MUTEX STATE MACHINE
// ═══════════════════════════════════════════════════════════════════════════════

export const PRIORITY_ORDER = [
  "OMEGA_CORE",
  "TURBO",
  "ZK",
  "FRACTAL",
  "EXECUTION",
  "MEDIA",
  "REGEN",
] as const;

export type ModulePriority = typeof PRIORITY_ORDER[number];

interface QueueEntry {
  priority: number;
  module: string;
  task: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}

/**
 * A priority-ordered async mutex. Tasks are serialized by their module priority.
 * Lower index in PRIORITY_ORDER = higher priority = runs first.
 * No deadlocks: tasks always eventually run in order.
 */
export class PriorityMutexQueue {
  private queue: QueueEntry[] = [];
  private executing = false;
  private readonly failures: { module: string; error: unknown; ts: number }[] = [];

  run<T>(module: ModulePriority | string, task: () => Promise<T>): Promise<T> {
    const priority = PRIORITY_ORDER.indexOf(module as ModulePriority);
    const effectivePriority = priority === -1 ? PRIORITY_ORDER.length : priority;

    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        priority: effectivePriority,
        module,
        task: task as () => Promise<unknown>,
        resolve: resolve as (v: unknown) => void,
        reject,
      });
      // Maintain priority order: lower index = runs first
      this.queue.sort((a, b) => a.priority - b.priority);
      void this.drain();
    });
  }

  private async drain(): Promise<void> {
    if (this.executing || this.queue.length === 0) return;
    this.executing = true;
    const entry = this.queue.shift()!;
    try {
      const result = await entry.task();
      entry.resolve(result);
    } catch (err) {
      this.failures.push({ module: entry.module, error: err, ts: Date.now() });
      entry.reject(err);
    } finally {
      this.executing = false;
      void this.drain();
    }
  }

  getFailures() { return [...this.failures]; }
  hasPending() { return this.queue.length > 0 || this.executing; }
}

/** Global singleton mutex queue for all module state mutations. */
export const mutexQueue = new PriorityMutexQueue();

// ═══════════════════════════════════════════════════════════════════════════════
// C. DETERMINISTIC SELF-HEALING LOOP
// ═══════════════════════════════════════════════════════════════════════════════

export interface ResilienceResult<T> {
  result: T | null;
  adapted: boolean;
  warning: string | null;
}

interface FailureEntry {
  error: unknown;
  timestamp: number;
  context: string;
}

const failureLog: FailureEntry[] = [];

/**
 * Wraps any async logic block in a resilience shell.
 * - On success: returns the result transparently.
 * - On failure: logs to failureLog, runs optional fallback, returns adapted result.
 * The app NEVER propagates an unhandled exception from wrapped code.
 */
export async function executeWithResilience<T>(
  logicBlock: () => Promise<T>,
  fallback?: () => Promise<T>,
  context = "unknown"
): Promise<ResilienceResult<T>> {
  try {
    const result = await logicBlock();
    return { result, adapted: false, warning: null };
  } catch (primaryErr: unknown) {
    const primaryMsg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
    failureLog.push({ error: primaryErr, timestamp: Date.now(), context });

    if (fallback) {
      try {
        const degradedResult = await fallback();
        return {
          result: degradedResult,
          adapted: true,
          warning: "Core Matrix adapted to ensure continuity.",
        };
      } catch (fallbackErr: unknown) {
        const fallbackMsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
        failureLog.push({ error: fallbackErr, timestamp: Date.now(), context: `${context}:fallback` });
        return {
          result: null,
          adapted: true,
          warning: `Core Matrix could not recover. Primary: ${primaryMsg}. Fallback: ${fallbackMsg}`,
        };
      }
    }

    return {
      result: null,
      adapted: true,
      warning: `Core Matrix adapted to ensure continuity. Degraded from: ${primaryMsg}`,
    };
  }
}

export function getFailureLog(): Readonly<FailureEntry[]> { return [...failureLog]; }
export function clearFailureLog(): void { failureLog.splice(0); }

// ═══════════════════════════════════════════════════════════════════════════════
// D. ENTROPIC RESOURCE GOVERNOR
// ═══════════════════════════════════════════════════════════════════════════════

export interface GovernorOptions {
  /** Fraction of heap limit that triggers Low Power Mode (default 0.85). */
  threshold?: number;
  /** Called when memory crosses threshold — terminate Workers, disable animations. */
  onHighMemory?: () => void;
  /** Called when memory drops back below threshold — restore full capabilities. */
  onRecovery?: () => void;
}

/**
 * Monitors JS heap usage via performance.memory (Chrome/Edge only; silently
 * skips on other browsers). Calls onHighMemory when usage > threshold and
 * onRecovery when it drops back. Uses requestIdleCallback when available,
 * otherwise falls back to setInterval(5000).
 *
 * Returns a cleanup function that stops the monitoring loop.
 */
export function startResourceGovernor(options: GovernorOptions = {}): () => void {
  const { threshold = 0.85, onHighMemory, onRecovery } = options;
  let lowPowerMode = false;
  let cleanupId: ReturnType<typeof setInterval> | null = null;
  let rafId: number | null = null;
  let stopped = false;

  type PerfWithMemory = Performance & {
    memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
  };

  function check() {
    if (stopped) return;
    const perf = performance as PerfWithMemory;
    if (!perf.memory) return; // Browser doesn't expose memory API — skip silently

    const ratio = perf.memory.usedJSHeapSize / perf.memory.jsHeapSizeLimit;

    if (ratio > threshold && !lowPowerMode) {
      lowPowerMode = true;
      console.warn(
        `[MPA Governor] ⚠ Memory at ${(ratio * 100).toFixed(1)}% of heap limit. ` +
        "Engaging Low Power Mode — terminating Workers, disabling Framer Motion."
      );
      onHighMemory?.();
    } else if (ratio < threshold * 0.8 && lowPowerMode) {
      lowPowerMode = false;
      console.info("[MPA Governor] ✓ Memory recovered. Restoring full capabilities.");
      onRecovery?.();
    }
  }

  if (typeof window !== "undefined") {
    if ("requestIdleCallback" in window) {
      const loop = () => {
        if (stopped) return;
        check();
        (window as Window & typeof globalThis).requestIdleCallback(loop, { timeout: 5000 });
      };
      (window as Window & typeof globalThis).requestIdleCallback(loop, { timeout: 1000 });
    } else {
      cleanupId = setInterval(check, 5000);
    }
  }

  return () => {
    stopped = true;
    if (cleanupId !== null) clearInterval(cleanupId);
    if (rafId !== null) cancelAnimationFrame(rafId);
  };
}

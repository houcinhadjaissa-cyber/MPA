/**
 * lib/worker.ts — Compute Web Worker
 * Heavy mathematical operations (Monte Carlo, TDA Betti numbers) run in an
 * isolated thread via a Blob-URL Worker so the main UI thread is never blocked.
 */

// ─── Worker source code (runs inside Worker context) ─────────────────────────
export const WORKER_CODE = `
"use strict";

// ── Monte Carlo simulation ──────────────────────────────────────────────────
function monteCarlo(params) {
  var iterations = params.iterations || 1000;
  var amplitude  = params.amplitude  || 1.0;
  var seed       = params.seed       || Date.now();

  var samples = new Float64Array(iterations);
  // Linear congruential generator for reproducibility
  var lcg = seed;
  for (var i = 0; i < iterations; i++) {
    lcg = (lcg * 1664525 + 1013904223) >>> 0;
    samples[i] = (lcg / 4294967296) * amplitude;
  }

  var sum = 0;
  for (var i = 0; i < samples.length; i++) sum += samples[i];
  var mean = sum / iterations;

  var varianceSum = 0;
  for (var i = 0; i < samples.length; i++) varianceSum += Math.pow(samples[i] - mean, 2);
  var variance = varianceSum / iterations;
  var stdDev   = Math.sqrt(variance);

  // Kelly Criterion: f* = (bp - q) / b  (simplified: uniform return estimate)
  var b = amplitude;
  var p = samples.filter(function(x) { return x > mean; }).length / iterations;
  var q = 1 - p;
  var kellyFraction = b > 0 ? (b * p - q) / b : 0;

  // UCB1 exploration bonus for MCTS
  var ucb1 = mean + Math.sqrt(2 * Math.log(iterations) / (iterations * 0.5));

  return { mean: mean, variance: variance, stdDev: stdDev, kellyFraction: kellyFraction, ucb1: ucb1, iterations: iterations };
}

// ── TDA Betti Numbers (union-find + Euler characteristic) ────────────────────
function unionFind(n) {
  var parent = new Int32Array(n);
  var rank   = new Int32Array(n);
  for (var i = 0; i < n; i++) parent[i] = i;

  function find(i) {
    while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; }
    return i;
  }
  function union(i, j) {
    var ri = find(i), rj = find(j);
    if (ri === rj) return false;
    if (rank[ri] < rank[rj]) { parent[ri] = rj; }
    else if (rank[ri] > rank[rj]) { parent[rj] = ri; }
    else { parent[rj] = ri; rank[ri]++; }
    return true;
  }
  function components() {
    var roots = new Set();
    for (var i = 0; i < n; i++) roots.add(find(i));
    return roots.size;
  }
  return { find: find, union: union, components: components };
}

function computeBetti(points, epsilon) {
  if (!points || points.length === 0) return { beta0: 0, beta1: 0 };
  var n = points.length;
  var uf = unionFind(n);
  var edges = 0;

  for (var i = 0; i < n; i++) {
    for (var j = i + 1; j < n; j++) {
      var dx = points[i][0] - points[j][0];
      var dy = points[i][1] - points[j][1];
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= epsilon) {
        if (!uf.union(i, j)) edges++; // redundant edge → contributes to β₁
      }
    }
  }
  // β₀ = connected components, β₁ ≈ independent cycles (Euler: V - E + F = χ = β₀ - β₁)
  var beta0 = uf.components();
  var beta1 = Math.max(0, edges - n + beta0);
  return { beta0: beta0, beta1: beta1 };
}

// ── Message dispatcher ────────────────────────────────────────────────────────
self.onmessage = function(e) {
  var type = e.data.type;
  var data = e.data.data;
  var id   = e.data.id;
  try {
    if (type === 'MONTE_CARLO') {
      var result = monteCarlo(data);
      self.postMessage({ type: 'MONTE_CARLO_RESULT', result: result, id: id });
    } else if (type === 'TDA_BETTI') {
      var epsilon = data.epsilon || 0.3;
      var result  = computeBetti(data.points, epsilon);
      self.postMessage({ type: 'TDA_RESULT', result: result, id: id });
    } else {
      self.postMessage({ type: 'ERROR', error: 'Unknown task type: ' + type, id: id });
    }
  } catch (err) {
    self.postMessage({ type: 'ERROR', error: err && err.message ? err.message : String(err), id: id });
  }
};
`;

// ─── Factory: instantiate Worker from Blob URL ────────────────────────────────
let _worker: Worker | null = null;

/**
 * Returns a singleton compute Worker. Creates it on first call using a Blob URL
 * so no separate worker file is needed at build time.
 */
export function getComputeWorker(): Worker {
  if (_worker) return _worker;
  const blob = new Blob([WORKER_CODE], { type: "application/javascript" });
  const url  = URL.createObjectURL(blob);
  _worker    = new Worker(url);
  // Blob URL is no longer needed after Worker is created
  URL.revokeObjectURL(url);
  return _worker;
}

/** Terminate and release the shared Worker instance. */
export function terminateComputeWorker(): void {
  if (_worker) { _worker.terminate(); _worker = null; }
}

export type WorkerTaskType = "MONTE_CARLO" | "TDA_BETTI";

export interface MonteCarloParams { iterations: number; amplitude: number; seed?: number; }
export interface TDAParams { points: [number, number][]; epsilon?: number; }
export interface MonteCarloResult { mean: number; variance: number; stdDev: number; kellyFraction: number; ucb1: number; iterations: number; }
export interface TDAResult { beta0: number; beta1: number; }

/**
 * Sends a task to the Worker and returns a Promise that resolves when
 * the Worker posts the result back. Rejects on Worker errors.
 */
export function runWorkerTask(
  type: "MONTE_CARLO",
  data: MonteCarloParams
): Promise<MonteCarloResult>;
export function runWorkerTask(
  type: "TDA_BETTI",
  data: TDAParams
): Promise<TDAResult>;
export function runWorkerTask(
  type: WorkerTaskType,
  data: MonteCarloParams | TDAParams
): Promise<MonteCarloResult | TDAResult> {
  const worker = getComputeWorker();
  const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return new Promise((resolve, reject) => {
    const handler = (ev: MessageEvent) => {
      if (ev.data.id !== id) return;
      worker.removeEventListener("message", handler);
      if (ev.data.type === "ERROR") {
        reject(new Error(`Worker error: ${ev.data.error}`));
      } else {
        resolve(ev.data.result as MonteCarloResult & TDAResult);
      }
    };
    worker.addEventListener("message", handler);
    worker.postMessage({ type, data, id });
  });
}

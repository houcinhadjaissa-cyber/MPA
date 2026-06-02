/**
 * lib/immutableCore.ts — Next-Gen Structural Lock
 *
 * Defines strict TypeScript interfaces for the Omega-Core and Crypto modules.
 * payloadGenerator.ts depends ONLY on these interfaces — never on concrete
 * implementation details of the underlying modules.
 *
 * IMMUTABLE BOUNDARY: The underlying logic of these modules cannot be altered
 * by future updates without breaking this interface. This guarantees the
 * 56-Pillar architecture remains mathematically stable forever.
 */

// ─── Omega-Core Interface ─────────────────────────────────────────────────────

export interface IResilienceResult<T> {
  result: T | null;
  adapted: boolean;
  warning: string | null;
}

export interface IFailureEntry {
  error: unknown;
  timestamp: number;
  context: string;
}

export interface IOmegaCore {
  /**
   * Schema-agnostic recursive parser.
   * Extracts the longest string from any depth of JSON/unknown structure.
   */
  extractStringFromUnknownStructure(obj: unknown): string;

  /**
   * Deterministic self-healing wrapper.
   * Wraps any async logic block; on failure, runs optional fallback.
   * Never propagates an unhandled exception.
   */
  executeWithResilience<T>(
    logicBlock: () => Promise<T>,
    fallback?: () => Promise<T>,
    context?: string
  ): Promise<IResilienceResult<T>>;

  /**
   * Priority mutex queue runner.
   * Serializes concurrent state mutations by module priority.
   */
  runMutex<T>(module: string, task: () => Promise<T>): Promise<T>;

  /** Returns a snapshot of the accumulated failure log. */
  getFailureLog(): Readonly<IFailureEntry[]>;
}

// ─── Crypto Interface ─────────────────────────────────────────────────────────

export interface ICrypto {
  /** Returns true when WebCrypto (PBKDF2 + AES-GCM) is available. */
  isCryptoAvailable(): boolean;

  /**
   * Encrypts plaintext and returns a base64-encoded (iv ++ ciphertext) blob.
   * Falls back to base64 encoding when WebCrypto is unavailable.
   */
  safeEncrypt(password: string, salt: Uint8Array, plaintext: string): Promise<string>;

  /**
   * Decrypts a base64-encoded blob produced by safeEncrypt.
   * Falls back to base64 decoding when WebCrypto is unavailable.
   */
  safeDecrypt(password: string, salt: Uint8Array, encoded: string): Promise<string>;

  /** Generates 16 cryptographically random bytes as a salt. */
  generateSalt(): Uint8Array;
}

// ─── NextWave Interface ───────────────────────────────────────────────────────

export interface INextWaveCore {
  /**
   * Adversarial AI Auditor.
   * Scans for malicious injection patterns; truncates and notifies on detection.
   */
  sanitizeGeneratedPayload(outputString: string): string;

  /**
   * Algorithmic Cohesion Director.
   * Deduplicates cross-toggle directives; abstracts to dense shorthand if
   * combined character count exceeds 120,000.
   */
  compressDirectives(activeToggles: string[]): string;

  /**
   * Temporal Cryptographic Anchor.
   * Generates SHA-256(payloadSlice + timestamp) and appends it as a hidden
   * comment — proof of temporal IP ownership stored only in localStorage.
   */
  generateTemporalAnchor(payloadSlice: string): Promise<string>;

  /**
   * Topological Yield Capacity Calculator (TYCC).
   * Treats interaction hyperedges as a mathematical graph; returns Betti-number-
   * derived Yield Capacity ∈ [0.0, 1.0]. Never outputs a price.
   */
  calculateYieldCapacity(interactionGraph: number[][]): number;

  /**
   * Macro-Entropy Ingestion.
   * Fetches real-world systemic entropy (Fear & Greed Index).
   * Returns 0.0 (Calm) → 1.0 (Chaos). Never throws.
   */
  fetchMacroEntropy(): Promise<number>;
}

// ─── Payload Generator Interface ─────────────────────────────────────────────

export interface IGenerateOptions {
  targetEntity: string;
  targetContext: string;
  masterObjective: string;
  customDirectives: string;
  protocol: string;
  mathDominance: boolean;
  singularityIntelligence: boolean;
  monteCarlo: boolean;
  zkVerification: boolean;
  fractalEconomy: boolean;
  regenerativeSovereignty: boolean;
  omniNode: boolean;
  mediaOracle: boolean;
  reverseEngineering: boolean;
  apexDefense: boolean;
  omegaTopology: boolean;
  ergodicSync: boolean;
  apiKey: string;
  model: string;
  temperature: number;
}

export interface IGenerateResult {
  prompt: string;
  model: string;
  tokensUsed: number;
  durationMs: number;
  adapted: boolean;
  warning: string | null;
}

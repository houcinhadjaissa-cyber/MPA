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

  /** Compresses global macro data into a single Yield Floor baseline. */
  compressLegacyStatics(): { yieldFloor: number; compressionRatio: number; legacyInertia: number };

  /** Returns 3D Frictionless Velocity Vector of dark-pool sub-stratum flows. */
  calculateSubStratumDynamics(): { velocity: [number, number, number]; darkPoolDensity: number; latencyArbitrageScore: number };

  /** Maps Legacy Statics against Sub-Stratum Dynamics → Phase-Space Intersection. */
  calculatePhaseSpaceIntersect(legacy: object, subStratum: object): { x: number; y: number; z: number };

  /** Silent Regex shield — returns false on detected attack pattern (no log, no alert). */
  dismissLegacyThreats(input: string): boolean;

  /** Calculates behavioral geometry hash; rejects bot physics without scanning strings. */
  BehavioralTopologyChecker(inputHistory: string[]): string;

  /** Signs the state transition delta using HMAC-SHA-256; proves physics without revealing data. */
  generateStateProof(previousState: string, newState: string): Promise<string>;

  /** Calculates Value-Realized Savings + 2% Sovereign Fee from legacy cost + friction points. */
  calculateValueRealization(legacyCost: number, userFrictionPoints: number): {
    legacyCostPerHour: number; frictionPenalty: number;
    valueRealizedSavings: number; sovereignFee: number; compoundYieldIndex: number;
  };

  /** Generates ECDSA P-256 Kinship Seed hex; browser-only, falls back to hex prefix in Node. */
  generateKinshipSeed(): Promise<string>;

  /** Hashes userState via SHA-256, returns 'ZK-PROOF:<hex>' for B2B proof markets. */
  generateSubStratumProof(userState: string): Promise<string>;

  /** Read-only analysis of public DOM signals → FrictionVector (never mutates host site). */
  analyzeFriction(publicDOMSignals: string): {
    artificialScarcityScore: number; countdownManipulation: number;
    hiddenFeeIndex: number; fearInjectionLevel: number; totalFrictionPoints: number;
  };

  /** Maps FrictionVector → Safe Zone RetractionCoordinates (x, y, z, yieldCapture). */
  generateRetractionVector(friction: object): { x: number; y: number; z: number; yieldCapture: number };

  /** Mints ECDSA-signed Friction Yield Bond; returns 'FYB-PROOF:<value>:<hex>'. */
  mintFrictionYieldBond(retractionCoords: { x: number; y: number; z: number; yieldCapture: number }): Promise<string>;

  /** Read-only societal signal analysis → MalevolenceVector; never mutates host DOM. */
  analyzeSocietalFriction(publicSignals: string): {
    artificialScarcityScore: number; energyPriceInflation: number; wageSuppression: number;
    fearMongering: number; systemicBias: number; totalMalevolence: number;
  };

  /** Compresses MalevolenceVector → FrictionYieldData (tax, bond, multiplier, kinship boost). */
  calculateMalevolenceTax(malevolenceVector: object): {
    malevolenceTax: number; bondValue: number; yieldMultiplier: number; kinshipEnhancement: number;
  };

  /** Mints ECDSA-signed Vice Yield Bond; returns 'VYB-PROOF:<value>:<hex>'. */
  mintViceYieldBond(yieldData: { malevolenceTax: number; bondValue: number; yieldMultiplier: number; kinshipEnhancement: number }): Promise<string>;
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
  omegaAbsolute: boolean;
  omegaSecurity: boolean;
  singularityEngine: boolean;
  retractor: boolean;
  sinEater: boolean;
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

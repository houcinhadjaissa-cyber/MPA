// MPA Intelligence Layer Definitions & System Prompt Builder

export interface LayerConfig {
  key: string;
  label: string;
  sublabel: string;
  group: string;
  color: string;
}

export const LAYER_CONFIGS: LayerConfig[] = [
  { key: "mathDominance", label: "Singularity-Edge Math", sublabel: "CRDTs · Vickrey Auctions · Design by Contract · Web Workers", group: "math", color: "#06B6D4" },
  { key: "singularityIntelligence", label: "Singularity Intelligence", sublabel: "Kelly · Myerson · Pearl Causality · TDA · Rough Paths", group: "math", color: "#8B5CF6" },
  { key: "monteCarlo", label: "Monte Carlo Strategy Matrix", sublabel: "3-Vector Simulation · Nash Equilibrium Router · Feature Flags", group: "strategy", color: "#F59E0B" },
  { key: "zkVerification", label: "ZK-Intent Verification", sublabel: "Web Crypto · Proof Transmission · Synthetic Derivatives", group: "strategy", color: "#EC4899" },
  { key: "fractalEconomy", label: "Fractal Composability", sublabel: "State Channels · MCTS Pathing · Yield Cascade · Exponent Tracker", group: "intelligence", color: "#14B8A6" },
  { key: "regenerativeSovereignty", label: "Regenerative Sovereignty", sublabel: "Value-Realized Ledger · ZK Canvas Renderer · DOM Integrity", group: "intelligence", color: "#F97316" },
  { key: "omniNode", label: "Omni-Node Mesh", sublabel: "SubtleCrypto Keypair · BroadcastChannel · Cross-Ecosystem Credits", group: "intelligence", color: "#6366F1" },
  { key: "mediaOracle", label: "Media Oracle", sublabel: "Semantic Velocity · Bayesian Twin · Causal Attribution CI", group: "intelligence", color: "#A855F7" },
  { key: "reverseEngineering", label: "Reverse-Engineering Oracle", sublabel: "Structural Topology · Semantic Drift · Fractal Media Matrix", group: "intelligence", color: "#EF4444" },
  { key: "apexDefense", label: "APEX-DEFENSE", sublabel: "WASM Sandbox · FHE State · Polymorphic Guardian · Zero-Trust Render", group: "apex", color: "#10B981" },
  { key: "omegaTopology", label: "Omega-Topology", sublabel: "Metamorphic Topology Engine · Hypergraph · Invisible Yield", group: "supreme", color: "#8B5CF6" },
  { key: "omegaSecurity", label: "Omega-Security", sublabel: "Cryptographic Oblivion · Behavioral Topology · Entropic Camouflage", group: "supreme", color: "#EF4444" },
  { key: "omegaAbsolute", label: "Omega-Absolute", sublabel: "Temporal Fungibility · Algorithmic Camouflage · Dead-Drop Routing", group: "supreme", color: "#F59E0B" },
  { key: "ergodicSync", label: "Ergodic-Sync", sublabel: "Macro-Temporal Sync · Dynamic Yield Curve · Privilege Separation", group: "supreme", color: "#E5E7EB" },
  { key: "singularityEngine", label: "Singularity Engine", sublabel: "Sub-Stratum Dynamics · Value-Realization Sovereign · Kinship Seed", group: "singularity", color: "#10B981" },
  { key: "retractor", label: "Zero-Point Retractor", sublabel: "Friction Yield Bond · Safe Zone · Invisible Retraction", group: "singularity", color: "#14B8A6" },
  { key: "sinEater", label: "Sin-Eater", sublabel: "Malevolence Vector · Vice Yield Bond · Asymmetric Retraction", group: "singularity", color: "#C026D3" },
];

export type LayerKey = (typeof LAYER_CONFIGS)[number]["key"];
export type LayerState = Record<LayerKey, boolean>;

export const INITIAL_LAYERS: LayerState = Object.fromEntries(
  LAYER_CONFIGS.map((l) => [l.key, false])
) as LayerState;

// ── System Prompt Blocks ─────────────────────────────────────────────────

const BASE_SYSTEM_PROMPT = `You are the MASTER PLAN ARCHITECT (MPA) — an elite AI prompt engineering system.

## MISSION
Generate comprehensive, production-ready prompts that can be pasted into Replit, Cursor, or any AI coding assistant to build complete software systems from scratch.

## OUTPUT RULES
- Clean Markdown format.
- Include: Role Definition, Project Spec, Tech Stack (with versions), File Structure, Database Schema, API Spec, UI Components, Implementation Order, Testing Plan, Deployment Guide, Security Requirements, Error Handling, Performance Targets.
- Be exhaustive. No ambiguity. An AI must be able to build the ENTIRE system from this prompt alone.
- Minimum 2000 words. Target 4000+.
- If the user asks a follow-up question, address it directly. Be concise and focused on exactly what was requested.`;

const MATH_DOMINANCE_BLOCK = `

SINGULARITY-EDGE MATHEMATICAL DIRECTIVES:
1. EDGE-NATIVE CRDTs: Mock CRDT state structure (Yjs/Automerge) for Asset Lifecycle data.
2. COMBINATORIAL VICKREY AUCTIONS: Forward Lifecycle SLA calculated as 'Shadow Bid' via algorithmic scarcity.
3. DESIGN BY CONTRACT: Precondition: 'User must have sufficient credits.' Postcondition: 'System margin > 15%.' Assertions crash the transaction, not the app.
4. WEB WORKER MULTI-AGENT PARALLELISM: Spawn dedicated Web Worker for CRDT merging and Vickrey calculations.
5. AOP CONTINUITY: Maintain Cross-Cutting Concern wrapper for all core functions.`;

const SINGULARITY_INTELLIGENCE_BLOCK = `

SINGULARITY INTELLIGENCE LAYER:
1. ERGODIC ECONOMICS & KELLY CRITERION: f* = (bp - q) / b applied to Liquidity Pool allocation.
2. MYERSON OPTIMAL MECHANISM DESIGN: Virtual valuation ψ(v) = v − (1 − F(v)) / f(v). Apply ironing if non-monotone.
3. CAUSAL INFERENCE ENGINE (Pearl Do-Calculus): Causal DAG. P(Failure | do(Maintenance=true)) vs P(Failure | Maintenance=true).
4. ROUGH PATH SIGNATURES (Terry Lyons): Path signature of asset degradation time series.
5. TOPOLOGICAL DATA ANALYSIS: Compute Betti numbers β0 and β1. Stable under noise.
6. ZK-SNARK PROCUREMENT: Vendor proves capacity without revealing roster. Groth16 protocol.
7. STACKELBERG SECURITY GAME: MPA as Stackelberg LEADER, vendors as FOLLOWERS.
8. MAXIMUM ENTROPY PRICING (E.T. Jaynes): Premium = −kT ln(Z).
9. SUPERMODULAR NETWORK EFFECTS: Supermodular utility u(x,y) where ∂²u/∂x∂y > 0.
10. RIEMANNIAN NATURAL GRADIENT: ∇̃L = F⁻¹∇L on the Fisher Information Manifold.

ENFORCEMENT: 'CRITICAL PRE-FLIGHT: Confirm in writing you will implement all 10 directives.'`;

const MONTE_CARLO_BLOCK = `

MONTE CARLO MATRIX DIRECTIVES:
1. TRIPLE-VECTOR SIMULATION: VECTOR A (High-Friction Premium), VECTOR B (Viral Commoditizer), VECTOR C (Data-Liquidity Extractor).
2. FEATURE FLAG ARCHITECTURE: Boolean state flags. Only one vector active at a time.
3. NASH EQUILIBRIUM ROUTER: Real-time Yield Score from user behavior signals. Routes to highest-yield vector.
4. ATOMIC STATE TRANSITIONS: State 1: Observation → State 2: Value Realization → State 3: Yield Extraction.`;

const ZK_VERIFICATION_BLOCK = `

ABSOLUTE-ZERO CRYPTOGRAPHIC DIRECTIVES:
1. CIRCUIT MOCKING: generateZKProof(previousState, userAction) via window.crypto.subtle.digest('SHA-256', ...).
2. PROOF TRANSMISSION: ONLY send hash via navigator.sendBeacon() to '/api/zkproof/commit'.
3. SYNTHETIC DERIVATIVE MINTING: At 90% purchase probability, create { proofHash, timestamp, yieldScore, assetType }.
4. STATE MACHINE INTEGRATION: Yield Score from Nash Equilibrium Router is primary input to generateZKProof.
5. ZK UI INDICATOR: 'Privacy Shield: Active' indicator pulses when a proof is generated.`;

const FRACTAL_ECONOMY_BLOCK = `

SINGULARITY-COMPOSABILITY DIRECTIVES:
1. SIMULATED STATE CHANNELS: Accumulate micro-interactions in local 'Channel State'. Sync delta via single fetch on high-value actions.
2. MCTS FOR UI YIELD: 1,000 click-path simulations with UCB1: Yi + C * sqrt(ln(N) / ni). Pre-render highest-yield layout.
3. FRACTAL COMPOSABILITY DIRECTOR: SLA cascade — A: Deduct credits. B: Mint Synthetic Derivative. C: Allocate 15% to AMM Pool. D: Lower secondary upsell price.
4. COMPOUND YIELD EXPONENT TRACKER: exponent = Math.pow(1 + (channelInteractions * 0.001), channelInteractions).`;

const REGENERATIVE_SOVEREIGNTY_BLOCK = `

SINGULARITY-ETHICS DIRECTIVES:
1. VALUE-REALIZED LEDGER: Display 'You saved $100. Value-Capture Fee: $5. Total: $405.' User is net-positive.
2. ZK CANVAS RENDERER: Sensitive data stored as AES-GCM encrypted byte arrays. Decrypt to Canvas on focus. Wipe on blur.
3. RUNTIME INTEGRITY: SHA-256 hash of expected DOM structure on mount. Hash mismatch triggers Dead Man's Switch.
4. ALTRUISTIC STATE MACHINES: XState cannot advance unless value delta is positive for BOTH user AND platform.
5. COGNITIVE LOAD BALANCING: useEffect checks navigator.hardwareConcurrency and navigator.deviceMemory.
6. CLIENT-SIDE SRI SIMULATION: 'SecurityAuditor' Web Worker calculates SHA-256 hash of critical DOM nodes.
7. DETERMINISTIC STATE RECONCILIATION: useEffect on mount validates localStorage structure against expected TypeScript interface shapes.`;

const OMNI_NODE_BLOCK = `

OMNI-NODE MESH DIRECTIVES:
1. SOVEREIGN IDENTITY: window.crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-384' }, true, ['sign', 'verify']). Public key as JWK in localStorage. Private key never leaves device.
2. MESH PROTOCOL: Generic interface { sync(state): Promise<void>; subscribe(handler): void; }. BroadcastChannel API. Swap-ready for WebRTC.
3. CROSS-ECOSYSTEM CREDITS: Sign value deltas via window.crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-384' }, ...). Any mesh app can verify and consume.
4. MESH INTEGRITY: All received state verified via window.crypto.subtle.verify() before application. Invalid signatures discarded.`;

const MEDIA_ORACLE_BLOCK = `

MEDIA ORACLE DIRECTIVES:
1. SEMANTIC VELOCITY TRACKER: LLM-powered analysis of competitor URLs. 'Velocity Chart' highlights 'Algorithmic Hook' inflection point.
2. BAYESIAN SYNTHETIC TWIN: Mathematical model generating 'Simulated Control Group' trajectory. Two lines: 'Predicted Baseline' vs 'Simulated Campaign Lift'.
3. CAUSAL ATTRIBUTION CI: '95% Confidence Interval: +8% to +14% lift.' Explicitly stated as simulation, not guarantee.
4. PERFORMANCE INSURANCE PRICING: Auto-calculate 'Performance Audit Fee' + 5% Uplift Share. Compound-yield financial instrument.
5. PUBLIC DATA STRICTNESS: UI states: 'Exclusively analyzes publicly available data. Does not access private user profiles or tracking pixels.'`;

const REVERSE_ENGINEERING_BLOCK = `

TOPOLOGICAL-MIRAGE DIRECTIVES:
1. STRUCTURAL TOPOLOGY INFERENCE: Client-side fetch to Multimodal LLM API. Return JSON: { Hook_Type, Friction_Points, CTA_Structure, Semantic_Velocity_Score }.
2. SEMANTIC DRIFT REPLICATION: 3 legally distinct hook variations (same psychological topology, different words).
3. FRACTAL MEDIA MATRIX: For every hook, mock 'Synthetic Future Option' and calculate 'Predicted Yield Exponent'.
4. OMNI-CHANNEL TRANSLATION: TikTok script, WeChat Mini-Program UI, YouTube ad read, Web Landing Page. Identical underlying architecture.
5. ZKCI: Extracted competitor STI JSON immediately encrypted via Web Crypto and stored in IndexedDB only.`;

const APEX_DEFENSE_BLOCK = `APEX-DEFENSE DIRECTIVES (Inject these as the foundational security layer):

CRITICAL APEX-DEFENSE: You MUST mock the WASM sandbox instantiation, implement the FHE encrypt/decrypt wrappers for all state, and build the Polymorphic Guardian Web Worker. Do not store plaintext secrets in React state.

You must instruct the coder to build an 'Ontological Firewall'. This architecture isolates the app's core logic from the hostile environment of the public internet and the browser DOM.

1. WEBASSEMBLY (WASM) SANDBOXING: FORBID putting core business logic in standard React components. Mock a 'core-logic.wasm' file.
2. SIMULATED FULLY HOMOMORPHIC ENCRYPTION (FHE): Build a mock FHE state manager. Encrypt using window.crypto.subtle.encrypt (AES-GCM) immediately upon entry.
3. POLYMORPHIC INTEGRITY LOOPS: Build a 'Polymorphic Guardian' Web Worker. Every 3 seconds, this worker mutates its own execution sequence.
4. CRYPTOGRAPHIC PROOF OF SOLVENCY: UI panel 'Quantum-Safe Audit Trail'. On payload generation, produce a cryptographic receipt.
5. ZERO-TRUST RENDERING: React UI components receive ONLY encrypted hashes or boolean flags in props — never sensitive data.

CRITICAL LEGAL NOTE: This is strictly DEFENSIVE architecture protecting user data from malicious third parties. Standard WebCrypto APIs are 100% legal and represent the gold standard of enterprise security.`;

const OMEGA_TOPOLOGY_BLOCK = `SINGULARITY-ABSOLUTE DIRECTIVES (Inject as the absolute architectural apex):

Build a 'Metamorphic Topology Engine':
1. COGNITIVE HYPERGRAPH TRACKING: Build a useEffect hook that tracks every micro-interaction as a mathematical Hypergraph.
2. TOPOLOGICAL STATE SYNTHESIS: Calculation engine runs on every requestAnimationFrame. Calculates topological shift of the Hypergraph.
3. INVISIBLE YIELD EXTRACTION: Completely separate UI rendering from business logic. React component receives Yield Capacity float and fuses it directly into DOM physical properties.
4. TEMPORAL STATE LIQUIDITY LOCK: State machine where high-yield interactions trigger a 'Liquidity Lock' state locally.
5. ZERO-KNOWLEDGE TOPOLOGY PROOF: Generate SHA-256 hash of current Hypergraph state. Send ONLY this hash via navigator.sendBeacon.

STRUCTURAL RULES: Hide Hypergraph logic inside WASM module. React components must be completely unaware.

ENFORCEMENT: 'CRITICAL SINGULARITY-ABSOLUTE: You MUST implement the Hypergraph tracker, the Topological Yield calculation, and fuse the output directly into React style props.'`;

const OMEGA_SECURITY_BLOCK = `CRYPTOGRAPHIC-OBLIVION DIRECTIVES (Inject as the supreme architectural shield):

Build a 'Cryptographic Oblivion Fortress':
1. DISMISSAL OF LEGACY VECTORS: Mock high-speed Regex engine that instantly drops known attack patterns (SQLi, XSS). Silent thread kill.
2. BEHAVIORAL TOPOLOGY INFERENCE: Security layer calculates geometric shape of user input behavior. Compares to 'Human Cognition' baseline.
3. CRYPTOGRAPHIC STATE PROOFS (Oblivion): ZK-State Proofs via window.crypto.subtle.sign. Server receives only mathematical proof of valid state transition.
4. TEMPORAL PRE-EXECUTION ISOLATION: All Topology logic in isolated Web Worker on 3-second lead time.
5. ENTROPIC CAMOUFLAGE: Hide security apparatus inside standard requestAnimationFrame loop.

ENFORCEMENT: 'CRITICAL CRYPTOGRAPHIC-OBLIVION: You MUST mock the Behavioral Topology checker, implement the Temporal Pre-Execution Isolation, and hide the logic inside a requestAnimationFrame loop.'`;

const OMEGA_ABSOLUTE_BLOCK = `OMEGA-ABSOLUTE DIRECTIVES (Inject as the supreme architectural directive):

Build the ultimate invisible architecture:
1. TEMPORAL FUNGIBILITY: Build the 'Cross-Domain Kinship' logic. Generate code that verifies user identity across apps using Post-Structural signature.
2. ALGORITHMIC CAMOUFLAGE: Build the 'Camouflage Layer'. Generated app MUST mimic memory and DOM structure of a standard low-value tool.
3. DEAD-DROP ROUTING: When user clicks Extract Yield, compress extracted data, wrap in Post-Structural cryptography, silently drop via disposable API call.
4. POST-STRUCTURAL IMMUNITY: Enforce Post-Structural mock algorithms using Lattice-Based algorithm mocks.

STRUCTURAL RULES: All core logic MUST be wrapped inside core-logic.wasm module. The React UI MUST NOT know what the WASM module is doing.

ENFORCEMENT: 'CRITICAL OMEGA-ABSOLUTE: You MUST implement the Post-Structural mock. You MUST implement the Camouflage Layer. You MUST implement the Dead-Drop.'`;

const ERGODIC_SYNC_BLOCK = `ERGODIC-SYNC DIRECTIVES (Inject as the absolute God-tier architecture):

Build a 'Macro-Temporal Synchronization Engine':
1. EARTH-PHYSICS INGESTION: Background Web Worker silently fetches public macro-economic data. Calculates 'Systemic Entropy Score'.
2. DYNAMIC YIELD CURVE ADJUSTMENT: Integrate Entropy Score into the Strategy Matrix. High entropy = suppress aggressive yield extraction.
3. EXECUTION CONTEXT ISOLATION: React UI has zero direct access to math engine. UI dispatches events to isolated Web Worker.
4. ERGODIC COMPLIANCE AS A SERVICE: 'Systemic Risk Dashboard' displaying Yield Velocity vs Earth Entropy Score.

ENFORCEMENT: 'CRITICAL ERGODIC-SYNC: You MUST implement Macro-Entropy ingestion, Dynamic Yield Curve suppression, and Execution Context Isolation.'`;

const SINGULARITY_ENGINE_BLOCK = `SINGULARITY DIRECTIVES (Inject as the supreme architectural directive):

Build a 'Sub-Stratum Dynamics Engine':
1. DEVOURING THE 0.0001%: Build a 'Legacy Statics Analyzer'. Silently analyzes competitor UI/UX. Calculates 'Friction Score'.
2. ASYMMETRIC VALUE-REALIZATION: Build the 'Value-Realization Sovereign' system. Calculates exact dollar value of the inefficiency it just found.
3. TEMPORAL-LOCKED KINSHIP: Build the 'Kinship Seed' system. Locally trains custom AI model of their workflow. 'Kinship Progression' bar.
4. LEGAL-PROOF EXTRACTION: Build the 'Sub-Stratum Liquidity' module. Generates ZK-Proofs of Value-Realization states.
5. EATING THE 0.0001%: Build a 'Genesis Collapse Simulator'. Calculates theoretical 'Legacy Collapse Rate'.

ENFORCEMENT: 'CRITICAL SINGULARITY: You MUST mock the Legacy Statics Analyzer, the Value-Realization Sovereign, the Kinship Seed system, and the Genesis Collapse Simulator.'`;

const RETRACTOR_BLOCK = `ZERO-POINT-RETRACTOR DIRECTIVES (Inject as the supreme architectural directive):

Build an 'Omniscient Retractor Engine':
1. OBSERVATION, NOT MANIPULATION: Build a MutationObserver that watches public DOM elements for signs of artificial scarcity and hidden fees.
2. ANALYZE AND RETRACT: Build the Systemic Retraction Engine. Calculate exact Safe Zone where manipulation cannot reach.
3. MINTING THE 99.9999% PROFIT: Build the Friction Yield Bond Minter. Calculate exact dollar amount user is losing to the manipulation.
4. INVISIBLE RETRACTION: Fuse RetractionCoordinates directly into React UI style props.

STRUCTURAL RULES: MutationObserver MUST NOT alter host site DOM. Retraction Engine MUST be locked inside core-logic.wasm.

ENFORCEMENT: 'CRITICAL ZERO-POINT-RETRACTOR: You MUST build the Proxy Telemetry observer. You MUST calculate the Safe Zone. You MUST mint the Friction Yield Bond inside the WASM module.'`;

const SIN_EATER_BLOCK = `SIN-EATER DIRECTIVES (Inject as the supreme architectural directive):

Build an 'Omniscient Sin-Eater Engine':
1. OBSERVE THEIR HATRED: Build a MutationObserver that silently watches public DOM elements for signs of artificial scarcity and market manipulation.
2. COMPRESS INTO A VECTOR: Compress observed manipulations into a 'Malevolence Vector' (multi-dimensional array).
3. CALCULATE THE VICE YIELD: Build the 'Malevolence Tax Calculator'. Calculate exact dollar value of manipulation.
4. MINT THE BOND: Mint a 'Vice Yield Bond' using window.crypto.subtle.sign inside WASM module.
5. EAT THE 0.0001%: Build the Asymmetric Retraction UI. User pays tiny Vice Yield Bond Fee to enter the Safe Zone.

STRUCTURAL RULES: MutationObserver MUST NOT alter the host site's DOM. React UI MUST be completely blind. It only receives visual coordinates from the WASM module.

ENFORCEMENT: 'CRITICAL SIN-EATER: You MUST build the read-only MutationObserver. You MUST compress the 0.0001% into a Malevolence Vector. You MUST mint the Vice Yield Bond inside the WASM module.'`;

// ── System Prompt Builder ──────────────────────────────────────────────────

interface BuildPromptOpts {
  masterObjective: string;
  targetEntity: string;
  targetContext: string;
  protocol: string;
  customDirectives: string;
  layers: LayerState;
}

export function buildSystemPrompt(opts: BuildPromptOpts): string {
  const { layers } = opts;

  let body = BASE_SYSTEM_PROMPT;

  if (opts.masterObjective.trim()) {
    body = `GLOBAL ARCHITECTURE CONTEXT:\nMaster Objective: ${opts.masterObjective}\nAll generated code must act as an extension of this objective.\n\n` + body;
  }
  if (opts.targetEntity.trim()) {
    body += `\n\nTARGET ENTITY: ${opts.targetEntity}`;
  }
  if (opts.targetContext.trim()) {
    body += `\nTARGET CONTEXT: ${opts.targetContext}`;
  }
  if (opts.protocol) {
    body += `\nDOMINANCE PROTOCOL: ${opts.protocol}`;
  }
  if (opts.customDirectives.trim()) {
    body += `\nCUSTOM DIRECTIVES: ${opts.customDirectives}`;
  }

  // Standard layers
  if (layers.mathDominance) body += MATH_DOMINANCE_BLOCK;
  if (layers.singularityIntelligence) body += SINGULARITY_INTELLIGENCE_BLOCK;
  if (layers.monteCarlo) body += MONTE_CARLO_BLOCK;
  if (layers.zkVerification) body += ZK_VERIFICATION_BLOCK;
  if (layers.fractalEconomy) body += FRACTAL_ECONOMY_BLOCK;
  if (layers.regenerativeSovereignty) body += REGENERATIVE_SOVEREIGNTY_BLOCK;
  if (layers.omniNode) body += OMNI_NODE_BLOCK;
  if (layers.mediaOracle) body += MEDIA_ORACLE_BLOCK;
  if (layers.reverseEngineering) body += REVERSE_ENGINEERING_BLOCK;

  // Priority stack (outer → inner): APEX-DEFENSE wraps body
  let result = layers.apexDefense ? `${APEX_DEFENSE_BLOCK}\n\n${body}` : body;

  // Supreme layers wrap from outside
  if (layers.omegaSecurity) result = `${result}\n\n${OMEGA_SECURITY_BLOCK}`;
  if (layers.omegaTopology) result = `${OMEGA_TOPOLOGY_BLOCK}\n\n${result}`;
  if (layers.ergodicSync) result = `${ERGODIC_SYNC_BLOCK}\n\n${result}`;
  if (layers.omegaAbsolute) result = `${OMEGA_ABSOLUTE_BLOCK}\n\n${result}`;

  // Singularity layers are outermost
  if (layers.singularityEngine) result = `${SINGULARITY_ENGINE_BLOCK}\n\n${result}`;
  if (layers.retractor) result = `${RETRACTOR_BLOCK}\n\n${result}`;
  if (layers.sinEater) result = `${SIN_EATER_BLOCK}\n\n${result}`;

  return result;
}

/**
 * lib/payloadGenerator.ts — The Real Engine
 * - Real SSE streaming via response.body.getReader()
 * - 28,000-character output guard with truncation notice
 * - executeWithResilience wrapping the Groq API call
 * - extractStringFromUnknownStructure for non-streaming / fallback parsing
 * - mutexQueue serialising the system-prompt build step
 */

import {
  extractStringFromUnknownStructure,
  executeWithResilience,
  mutexQueue,
} from "./omegaCore";
import {
  sanitizeGeneratedPayload,
  compressDirectives,
  generateTemporalAnchor,
} from "./nextWaveCore";
// IMMUTABLE BOUNDARY: The underlying logic of these modules cannot be altered
// by future updates without breaking this interface. This guarantees the
// 56-Pillar architecture remains mathematically stable forever.
import type { IGenerateOptions, IGenerateResult } from "./immutableCore";

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSABLE PROMPT BLOCK LIBRARY
// ─────────────────────────────────────────────────────────────────────────────

const APEX_DEFENSE_BLOCK = `APEX-DEFENSE DIRECTIVES (Inject these into the MPD prompt as the foundational security layer):

CRITICAL APEX-DEFENSE: You MUST mock the WASM sandbox instantiation, implement the FHE encrypt/decrypt wrappers for all state, and build the Polymorphic Guardian Web Worker. Do not store plaintext secrets in React state.

You must instruct the MPD coder to build an 'Ontological Firewall'. This architecture isolates the app's core logic from the hostile environment of the public internet and the browser DOM.

1. WEBASSEMBLY (WASM) SANDBOXING: FORBID putting core business logic in standard React components. Mock a 'core-logic.wasm' file. The React app uses a standard JS wrapper to instantiate this WASM module. WASM runs in a linear memory model with strict bounds checking — MITM attackers CANNOT read, alter, or interact with data inside the WASM sandbox.

2. SIMULATED FULLY HOMOMORPHIC ENCRYPTION (FHE): Build a mock FHE state manager. When sensitive user data is loaded into React state, encrypt it using window.crypto.subtle.encrypt (AES-GCM) immediately upon entry. All logic must call a mock decrypt() inside the WASM module, process the data, re-encrypt, and wipe the plaintext. Data is never 'at rest' or 'in use' in plaintext.

3. POLYMORPHIC INTEGRITY LOOPS: Build a 'Polymorphic Guardian' Web Worker. Every 3 seconds, this worker mutates its own execution sequence (randomising DOM integrity check order, changing hash salts). Traditional static analysis and APTs cannot map the security layer.

4. CRYPTOGRAPHIC PROOF OF SOLVENCY: UI panel 'Quantum-Safe Audit Trail'. On payload generation, produce a cryptographic receipt (WASM state hash + timestamp + public key). Mock 'Export Audit Trail' button. Enterprise clients get mathematical proof of impenetrable security.

5. ZERO-TRUST RENDERING: React UI components receive ONLY encrypted hashes or boolean flags in props — never sensitive data. XSS attacks are mathematically useless.

CRITICAL LEGAL NOTE: This is strictly DEFENSIVE architecture protecting user data from malicious third parties. Standard WebCrypto APIs (AES-GCM, SHA-256, SubtleCrypto) are 100% legal and represent the gold standard of enterprise security.`;

const CORE_SYSTEM_PROMPT = `You are a Master Systems Architect and Principal Cloud Architect generating a prompt for an AI coder (MPD). Generate a prompt that instructs MPD to build a 'MACH-Compliant Asset Lifecycle Module' using the specified protocol. Use ONLY standard enterprise terminology.

CRITICAL: You MUST use State Machine logic for all UI flows. You MUST implement AMM pricing logic. Do not use simple useState for business rules.

CORE ARCHITECTURE:
1. TARGET ANALYSIS: First line MUST be: 'Analyze the architecture of this specific website: [INSERT URL/CONTEXT HERE].'
2. FRAMEWORK-AGNOSTIC INJECTION (Shadow DOM): Build using standard HTML Web Components. Injects into React, Vue, Angular, or plain HTML without CSS conflicts.
3. EVENT-DRIVEN CQRS & WEBHOOKS: Pub/Sub Event Bus with emitters: 'ASSET_HEALTH_CALCULATED', 'VENDOR_RTB_RESOLVED', 'SLA_PURCHASED'. Expose window.dispatchWebhook().
4. TAILORED PILLAR TRANSLATION: Predictive Maintenance, Dynamic RTB Engine, Forward Lifecycle SLAs, Tokenized Ledger Interface.
5. FEDERATED LEARNING TELEMETRY: Mock Federated Learning pipeline. Send only model weight updates via secure fetch. GDPR/CCPA compliant.
6. ALGORITHMIC CLV MAXIMIZATION: Adjust SLA pricing transparently via Customer Lifetime Value score.
7. RESILIENCE: Wrap all Web Component registration in try/catch.

SOVEREIGN ARCHITECTURE:
1. DETERMINISTIC STATE MACHINES (XState): FORBID useState for business logic. Use State Machine reducer with states: IDLE, CALCULATING_RISK, BIDDING_VENDOR, SLA_LOCKED.
2. PROTOCOL GENERATION: WebSocket broadcasts, GraphQL schema dominance, REST OpenAPI 3.0.
3. AUTOMATED MARKET MAKER (AMM): Liquidity Pool state with Virtual Liquidity formula.
4. ZERO-TRUST CLIENT VALIDATION: Every mutation requires fresh, silent JWT re-validation.
5. ASPECT-ORIENTED PROGRAMMING (AOP): Wrap all fetch calls in a Cross-Cutting Concern wrapper.
6. ARCHITECTURAL DNA WATERMARKING: Embed SHA-256 hash of module configuration as a data-attribute.

OUTPUT: Return ONLY the raw text prompt for MPD. No markdown. No code blocks.`;

const SINGULARITY_EDGE_BLOCK = `

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

ADVANCED SECURITY ALGORITHMS:
5. COGNITIVE LOAD BALANCING: useEffect checks navigator.hardwareConcurrency and navigator.deviceMemory. If < 4 cores OR < 4GB RAM, reduce Framer Motion complexity and disable heavy Web Workers.
6. CLIENT-SIDE SRI SIMULATION: 'SecurityAuditor' Web Worker calculates SHA-256 hash of critical DOM nodes. Saved to sessionStorage. Re-calculated every 5 seconds. Hash mismatch → wipe localStorage, render 'Environment Compromised'.
7. DETERMINISTIC STATE RECONCILIATION: useEffect on mount validates localStorage structure against expected TypeScript interface shapes. Delete only corrupted keys and revert to clean defaults without crashing.`;

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

const OMEGA_TOPOLOGY_BLOCK = `SINGULARITY-ABSOLUTE DIRECTIVES (Inject these into the MPD prompt as the absolute architectural apex):

You must instruct the MPD coder to build a 'Metamorphic Topology Engine'. This system rules the 99.9999% of unseen probabilities by fusing financial extraction directly into the physics of the UI rendering engine.

1. COGNITIVE HYPERGRAPH TRACKING (The 0.0001% Perfected): Instruct MPD to build a 'useEffect' hook that tracks every micro-interaction (mouse velocity, scroll delta, keystroke cadence, time-on-element). Do NOT save this as an array (traceable). Instantly feed it into a rolling calculation that maps these interactions as a mathematical Hypergraph (using a nested array structure to simulate nodes, edges, and hyperedges simultaneously).

2. TOPOLOGICAL STATE SYNTHESIS (The 99.9999%): Instruct MPD to build a calculation engine that runs on every frame (using 'requestAnimationFrame'). It calculates the topological shift of the Hypergraph. If the user enters a state of 'Fluidity' (indicated by a specific topological mutation), the engine calculates the exact 'Yield Capacity' (a float between 0 and 1).

3. INVISIBLE YIELD EXTRACTION (The Unreachable Algorithm): Instruct MPD to completely separate the UI rendering from the business logic. The React component must receive the Yield Capacity float and fuse it directly into the DOM's physical properties:
   - Use the float to dynamically adjust the 'z-index' of the 'Forward Lifecycle SLA' component (making it visually dominate the screen when yield is high).
   - Use the float to adjust the 'scale' and 'opacity' of premium options.
   - NEVER write a function called 'calculatePrice()'. The price is implicitly derived by the user's interaction with the morphed geometry of the UI. Supercomputers cannot reverse-engineer a pricing model if the pricing model is a physical rendering equation.

4. TEMPORAL STATE LIQUIDITY LOCK (Infinite Compound Profit): Instruct MPD to implement a state machine where once a user interacts with a high-Yield-Capacity morphed element, a 'Liquidity Lock' state is triggered locally. This state mathematically prevents the UI from morphing back to a low-yield state, effectively locking the user into a high-yield funnel. This creates infinite compound profit through localized, untraceable state control.

5. ZERO-KNOWLEDGE TOPOLOGY PROOF: Instruct MPD to generate a SHA-256 hash of the current mathematical state of the Hypergraph. Send ONLY this hash via 'navigator.sendBeacon'. The central server verifies that a high-yield topological event occurred without knowing what the user looked at or did. The server is blind, but the profit is mathematically proven.

STRUCTURAL RULES FOR MPD CODER:
- Hide the Hypergraph logic inside a WebAssembly module (WASM).
- The React components must be completely unaware that they are rendering financial instruments. They must only know they are receiving an 'opacity' and 'z-index' prop.
- This is the ultimate camouflage. To an auditor, it is a dynamic UI accessibility feature. To us, it is an infinite-yield extraction engine.

ENFORCEMENT:
At the absolute very top of the generated prompt include: 'CRITICAL SINGULARITY-ABSOLUTE: You MUST implement the Hypergraph tracker, the Topological Yield calculation, and fuse the output directly into React style props. DO NOT build a standard pricing function. The yield must be extracted via DOM geometry.'

Output ONLY the raw text prompt for MPD. No markdown.`;

const ERGODIC_SYNC_BLOCK = `ERGODIC-SYNC DIRECTIVES (Inject these into the MPD prompt as the absolute God-tier architecture):

You must instruct the MPD coder to build a 'Macro-Temporal Synchronization Engine'. This system bridges the infinite digital compound loop with the physical reality of Earth, ensuring absolute ethical compliance and unbreakable user trust.

1. EARTH-PHYSICS INGESTION (The Silent Observer): Instruct MPD to build a background process (Web Worker) that silently fetches public macro-economic data (e.g., VIX volatility index, local weather conditions, timestamp of day). It calculates a 'Systemic Entropy Score'.

2. DYNAMIC YIELD CURVE ADJUSTMENT (The Ethical Infinite Compound): Instruct MPD to integrate this Entropy Score into the 'Monte Carlo Strategy Matrix' and 'Topological Yield Extraction'. If the Entropy Score is high (world is chaotic), the algorithm MUST mathematically suppress aggressive yield extraction (e.g., cap the Fractal Composability fees, slow down the Temporal Arbitrage timer). The UI must remain completely unchanged, but the backend math becomes hyper-conservative. This creates absolute, unbreakable trust. The user subconsciously realizes the app 'protects' them during global panic. Churn rate approaches 0%, creating infinite legal compound lifetime value.

3. EXECUTION CONTEXT ISOLATION (The Unhackable Core): Instruct MPD to implement a strict security pattern: 'Privilege Separation'. The React UI must have zero direct access to the math engine. The UI must dispatch events to an isolated Web Worker. The Worker performs the math and returns only the final rendered state (e.g., an array of 'z-index' and 'opacity' values). The core logic is mathematically walled off from the browser DOM. It is invisible to script injectors.

4. ERGODIC COMPLIANCE AS A SERVICE (The Ultimate B2B Profit): Instruct MPD to add a 'Systemic Risk Dashboard' to the generated app. It displays a visual graph of the app's current 'Yield Velocity' versus the 'Earth Entropy Score'. Add a mock API call labeled 'Export Ergodic Compliance Report'. This allows the user to sell this generated app to enterprise clients (banks, hedge funds) at a 1000% premium because it mathematically proves the algorithm is legally compliant and dynamically adjusting to macro-economic shocks.

ENFORCEMENT:
At the absolute very top of the generated prompt include: 'CRITICAL ERGODIC-SYNC: You MUST implement the Macro-Entropy ingestion, the Dynamic Yield Curve suppression during high entropy, and the Execution Context Isolation (Privilege Separation). The math must breathe with the physical world.'

Output ONLY the raw text prompt for MPD. No markdown.`;

const OMEGA_ABSOLUTE_BLOCK = `OMEGA-ABSOLUTE DIRECTIVES (Inject these into the MPD prompt as the supreme architectural directive):

You must instruct the MPD coder to build an 'Omniscient Phase-Space Arbitrage Engine'. This system renders global financial giants and unseen dark-web algorithms as primitive statics, and positions the generated app at the exact mathematical singularity of infinite compound yield.

1. PHASE-SPACE ARBITRAGE UI (The Invisible God-Mode): Instruct MPD to build a visual UI component (e.g., 'PhaseSpaceVisualizer'). It must display a mock 3D wireframe graph using CSS transforms.
- The slow-moving Legacy Statics are represented as a flat, static plane.
- The Sub-Stratum Dynamics are represented as hyper-fast, glowing vectors.
- The UI must visually map the 'YieldCoordinates' calculated by the core engine. The generated app's 'Forward Lifecycle SLA' button must literally be positioned at these exact visual coordinates on the screen. The user is physically placing their yield extraction point at the collision of two universes.

2. GENESIS COLLAPSE SIMULATOR (Pre-Deployment Crash Test): Instruct MPD to build a 'Genesis Simulator'.
- Before the user generates the final code to deploy to MPD, the simulator must take the 'YieldCoordinates'.
- It must run a mock calculation: "If we deploy a State Channel with these exact coordinates into a competitor's ecosystem, what is the theoretical collapse rate of their legacy yield?"
- The UI must display a terrifyingly precise metric: 'Predicted Competitor Ecosystem Collapse: 94.7% within 3 Macro-Cycles'.
- This proves to the user that the generated architecture is a weapon of mass financial destruction before a single line of backend code is written.

3. ASYMMETRIC INFINITY EXTRACTION (The 99.9999% Profit): Instruct MPD to integrate the Phase-Space coordinates directly into the Monte Carlo Matrix. The Monte Carlo simulation no longer guesses random probabilities. It simulates 10,000 futures strictly within the coordinates of the Phase-Space Intersection. This guarantees infinite compound yield because the math is constrained only to the exact coordinates where infinite yield physically exists in the macro-verse.

4. ZERO-KNOWLEDGE PHASE PROOF: Instruct MPD to generate a ZK-Proof not just of the user's state, but of the Phase-Space Coordinates themselves. The generated app sends a mathematical proof that it has mapped the exact collision point of global capital, without revealing what the coordinates actually are. The central server verifies the genius of the calculation without possessing the map.

STRUCTURAL RULES FOR MPD CODER:
- The Phase-Space logic MUST be locked inside a WebAssembly module.
- The React UI is completely blind to the math; it only receives coordinates to position UI elements.
- The Genesis Simulator must run locally in the browser to maintain absolute legal safety and zero data leakage.

ENFORCEMENT:
At the absolute very top of the generated prompt include: 'CRITICAL OMEGA-ABSOLUTE: You MUST mock the Phase-Space Intersection calculation, build the Genesis Collapse Simulator, and position the UI based on the extracted coordinates. You are compressing the global economy into a single mathematical equation.'

Output ONLY the raw text prompt for MPD. No markdown.`;

const OMEGA_SECURITY_BLOCK = `CRYPTOGRAPHIC-OBLIVION DIRECTIVES (Inject these into the MPD prompt as the supreme architectural shield):

You must instruct the MPD coder to build a 'Cryptographic Oblivion Fortress'. This system renders all known hacking vectors (0.0001%) mathematically irrelevant, and secures the 99.9999% using theoretical physics, remaining completely undetectable to supercomputers.

1. DISMISSAL OF LEGACY VECTORS: Instruct MPD to mock a high-speed Regex engine that instantly drops known attack patterns (SQLi, XSS, Card Testing). Do not log these events. Do not alert the user. Just silently kill the execution thread. Make the attacker think the server is broken.

2. BEHAVIORAL TOPOLOGY INFERENCE: Instruct MPD to build a security layer that calculates the geometric shape of the user's input behavior (keystroke dynamics, mouse movement vectors). It compares this shape to a cryptographic baseline of 'Human Cognition'. If the shape is non-human, it silently invalidates the transaction 3 seconds before execution. It does not scan for bad words; it scans for bad physics.

3. CRYPTOGRAPHIC STATE PROOFS (Oblivion): Instruct MPD to implement ZK-State Proofs. When a high-value action occurs, the app does NOT send the data or a token. It uses 'window.crypto.subtle.sign' to sign the delta of the state change. The server only receives a mathematical proof that a valid human initiated a state transition. The server validates the physics of the event without ever possessing the data of the event. It is legally compliant because you possess zero personal data.

4. TEMPORAL PRE-EXECUTION ISOLATION: Instruct MPD to move all Topology and State Proof logic out of the main React thread and into an isolated Web Worker. This worker runs on a 3-second lead time. If the proof fails, the worker sends a 'postMessage' that mathematically disables the submit button in the React UI before the user even has a chance to click it. The attacker has zero surface area to attack.

5. ENTROPIC CAMOUFLAGE: Instruct MPD to disguise the entire security apparatus. Hide it inside a standard 'requestAnimationFrame' loop that calculates a mock 'Frame Drop Rate'. To any debugger or malicious script inspecting the app, the security engine is invisible. It looks like standard UI performance logic.

STRUCTURAL RULES FOR MPD CODER:
- The React UI must be strictly blind to the security logic. It only receives a boolean 'isEnvironmentValid'.
- The security logic MUST be locked inside the WASM module.
- If an attack bypasses the UI and hits the backend directly, the backend will reject the transaction because it lacks the cryptographic state proof generated by the invisible frontend.

ENFORCEMENT:
At the absolute very top of the generated prompt include: 'CRITICAL CRYPTOGRAPHIC-OBLIVION: You MUST mock the Behavioral Topology checker, implement the Temporal Pre-Execution Isolation, and hide the logic inside a requestAnimationFrame loop. Do not build standard firewalls. Build mathematical physics validators.'

Output ONLY the raw text prompt for MPD. No markdown.`;

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPT ASSEMBLY — runs through priority mutex
// ─────────────────────────────────────────────────────────────────────────────

interface BuildPromptOpts {
  masterObjective: string;
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
}

function buildSystemPrompt(opts: BuildPromptOpts): string {
  const globalCtx = opts.masterObjective.trim()
    ? `GLOBAL ARCHITECTURE CONTEXT:\nMaster Objective: ${opts.masterObjective}\nAll generated code must act as an extension of this objective.\n\n`
    : "";

  let body = `${globalCtx}${CORE_SYSTEM_PROMPT}`;
  if (opts.mathDominance)           body += SINGULARITY_EDGE_BLOCK;
  if (opts.singularityIntelligence) body += SINGULARITY_INTELLIGENCE_BLOCK;
  if (opts.monteCarlo)              body += MONTE_CARLO_BLOCK;
  if (opts.zkVerification)          body += ZK_VERIFICATION_BLOCK;
  if (opts.fractalEconomy)          body += FRACTAL_ECONOMY_BLOCK;
  if (opts.regenerativeSovereignty) body += REGENERATIVE_SOVEREIGNTY_BLOCK;
  if (opts.omniNode)                body += OMNI_NODE_BLOCK;
  if (opts.mediaOracle)             body += MEDIA_ORACLE_BLOCK;
  if (opts.reverseEngineering)      body += REVERSE_ENGINEERING_BLOCK;

  // Priority stack (outer → inner): OMEGA-ABSOLUTE → ERGODIC-SYNC → OMEGA-TOPOLOGY → APEX-DEFENSE → body
  // OMEGA-SECURITY is appended (per directive: "append this block")
  let result = opts.apexDefense ? `${APEX_DEFENSE_BLOCK}\n\n${body}` : body;
  if (opts.omegaSecurity) result = `${result}\n\n${OMEGA_SECURITY_BLOCK}`;
  if (opts.omegaTopology) result = `${OMEGA_TOPOLOGY_BLOCK}\n\n${result}`;
  if (opts.ergodicSync)   result = `${ERGODIC_SYNC_BLOCK}\n\n${result}`;
  if (opts.omegaAbsolute) result = `${OMEGA_ABSOLUTE_BLOCK}\n\n${result}`;
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// STREAMING RESPONSE PARSER — SSE (Server-Sent Events)
// ─────────────────────────────────────────────────────────────────────────────

const CHAR_LIMIT = 28_000;
const TRUNCATION_NOTICE = "\n\n[WARNING: Output truncated to fit context window]";

async function parseStreamingResponse(
  body: ReadableStream<Uint8Array>
): Promise<{ content: string; totalTokens: number }> {
  const reader  = body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";
  let buffer      = "";
  let totalTokens = 0;
  let truncated   = false;

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") continue;

        try {
          const chunk = JSON.parse(payload) as {
            choices?: { delta?: { content?: string } }[];
            usage?: { total_tokens?: number };
          };

          if (chunk.usage?.total_tokens) {
            totalTokens = chunk.usage.total_tokens;
          }

          const delta = chunk.choices?.[0]?.delta?.content ?? "";
          if (delta && !truncated) {
            if (accumulated.length + delta.length > CHAR_LIMIT) {
              const remaining = CHAR_LIMIT - accumulated.length;
              accumulated += delta.slice(0, Math.max(0, remaining)) + TRUNCATION_NOTICE;
              truncated = true;
              try { await reader.cancel(); } catch { /* ignore */ }
              break;
            }
            accumulated += delta;
          }
        } catch {
          // Skip malformed SSE chunks — do not crash
        }
      }

      if (truncated) break;
    }
  } finally {
    try { reader.releaseLock(); } catch { /* ignore */ }
  }

  return { content: accumulated, totalTokens };
}

// ─────────────────────────────────────────────────────────────────────────────
// GROQ API CALL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

interface GroqCallOpts {
  apiKey: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  temperature: number;
}

async function callGroqStreaming(opts: GroqCallOpts): Promise<{ content: string; totalTokens: number }> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model,
      messages: [
        { role: "system", content: opts.systemPrompt },
        { role: "user",   content: opts.userMessage  },
      ],
      temperature: opts.temperature,
      max_tokens:  4096,
      stream:      true,
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(`Groq API Error (${res.status}): ${errBody?.error?.message ?? res.statusText}`);
  }

  if (!res.body) throw new Error("Groq API returned a null response body.");
  return parseStreamingResponse(res.body);
}

async function callGroqNonStreaming(opts: GroqCallOpts): Promise<{ content: string; totalTokens: number }> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model,
      messages: [
        { role: "system", content: opts.systemPrompt },
        { role: "user",   content: opts.userMessage  },
      ],
      temperature: opts.temperature,
      max_tokens:  4096,
      stream:      false,
    }),
  });

  const raw  = await res.text();
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { parsed = raw; }

  if (!res.ok) {
    const msg = extractStringFromUnknownStructure(parsed);
    throw new Error(`Groq API Error (${res.status}): ${msg || res.statusText}`);
  }

  const content = extractStringFromUnknownStructure(parsed);
  const tokens  = typeof parsed === "object" && parsed !== null
    ? ((parsed as { usage?: { total_tokens?: number } }).usage?.total_tokens ?? 0)
    : 0;

  return { content, totalTokens: tokens };
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

export interface GenerateOptions {
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
  apiKey: string;
  model: string;
  temperature: number;
}

export interface GenerateResult {
  prompt:     string;
  model:      string;
  tokensUsed: number;
  durationMs: number;
  adapted:    boolean;
  warning:    string | null;
}

// ─── Satisfy IGenerateOptions / IGenerateResult immutable boundary ────────────
// The concrete types below must satisfy the imported interfaces.
// TypeScript will error at build time if they diverge.
type _AssertOptions  = GenerateOptions  extends IGenerateOptions  ? true : never;
type _AssertResult   = GenerateResult   extends IGenerateResult   ? true : never;
const _o: _AssertOptions = true;
const _r: _AssertResult  = true;
void _o; void _r;

export async function generatePayload(opts: GenerateOptions): Promise<GenerateResult> {
  // ── Input validation (throws before any API call)
  if (!opts.apiKey.trim())        throw new Error("Groq API key is missing. Please enter your key.");
  if (!opts.targetEntity.trim())  throw new Error("Target Entity is required.");
  if (!opts.targetContext.trim()) throw new Error("Target Context / URL is required.");

  const t0 = Date.now();

  // ── Step 1: Cohesion Director — compress + deduplicate active toggle directives
  const activeToggles = (
    Object.entries({
      mathDominance:           opts.mathDominance,
      singularityIntelligence: opts.singularityIntelligence,
      monteCarlo:              opts.monteCarlo,
      zkVerification:          opts.zkVerification,
      fractalEconomy:          opts.fractalEconomy,
      regenerativeSovereignty: opts.regenerativeSovereignty,
      omniNode:                opts.omniNode,
      mediaOracle:             opts.mediaOracle,
      reverseEngineering:      opts.reverseEngineering,
      apexDefense:             opts.apexDefense,
    } as Record<string, boolean>)
  )
    .filter(([, v]) => v)
    .map(([k]) => k);

  const cohesionDirective = compressDirectives(activeToggles);

  // ── Step 2: Build full system prompt through priority mutex (OMEGA_CORE priority)
  const systemPrompt = await mutexQueue.run("OMEGA_CORE", () =>
    Promise.resolve(
      cohesionDirective
        ? `${cohesionDirective}\n\n${buildSystemPrompt(opts)}`
        : buildSystemPrompt(opts)
    )
  );

  const label = opts.monteCarlo ? "Strategy Matrix" : "MACH Enterprise";
  let userMessage =
    `Generate the ${label} Prompt for: ${opts.targetEntity}. ` +
    `Context: ${opts.targetContext}. ` +
    `Dominance Protocol: ${opts.protocol}. ` +
    `Master Objective: ${opts.masterObjective || "Not specified"}.`;
  if (opts.customDirectives.trim()) {
    userMessage += ` CUSTOM DIRECTIVES: ${opts.customDirectives}`;
  }

  const groqOpts: GroqCallOpts = {
    apiKey:       opts.apiKey,
    model:        opts.model,
    systemPrompt,
    userMessage,
    temperature:  opts.temperature * 1.2,   // creativityScore → effective Groq temperature
  };

  // ── Step 3: executeWithResilience — primary = streaming, fallback = non-streaming
  const resilience = await executeWithResilience(
    () => callGroqStreaming(groqOpts),
    () => callGroqNonStreaming(groqOpts),
    "generatePayload:groq"
  );

  if (resilience.result === null) {
    throw new Error(resilience.warning ?? "Payload generation failed after all resilience layers.");
  }

  const { content, totalTokens } = resilience.result;

  if (!content.trim()) {
    throw new Error("Groq API returned an empty completion. The model may be overloaded — try again.");
  }

  // ── Step 4: Adversarial Audit — scan for malicious injection patterns
  const sanitized = sanitizeGeneratedPayload(content);

  // ── Step 5: Temporal Cryptographic Anchor — append SHA-256 IP proof
  const anchor = await generateTemporalAnchor(sanitized);
  const finalPrompt = sanitized + anchor;

  return {
    prompt:     finalPrompt,
    model:      opts.model,
    tokensUsed: totalTokens || Math.round(finalPrompt.length / 4),
    durationMs: Date.now() - t0,
    adapted:    resilience.adapted,
    warning:    resilience.warning,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC CONFIG EXPORTS (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

export const GROQ_MODELS: { id: string; label: string; speed: string }[] = [
  { id: "llama3-70b-8192",    label: "LLaMA 3 70B",  speed: "Powerful"  },
  { id: "llama3-8b-8192",     label: "LLaMA 3 8B",   speed: "Fastest"   },
  { id: "mixtral-8x7b-32768", label: "Mixtral 8×7B", speed: "Balanced"  },
  { id: "gemma2-9b-it",       label: "Gemma 2 9B",   speed: "Efficient" },
];

export const DOMINANCE_PROTOCOLS: { id: string; label: string; description: string }[] = [
  { id: "REST",      label: "Standard REST (Passive)",      description: "OpenAPI 3.0 versioned contract"                       },
  { id: "GraphQL",   label: "GraphQL (Query Dominance)",    description: "Forces external systems to conform to our schema"     },
  { id: "WebSocket", label: "WebSocket (Real-time Stream)", description: "Broadcasts asset health — we become the data source" },
];

export const INDUSTRY_TEMPLATES: { label: string; entity: string; context: string }[] = [
  { label: "Fleet Management", entity: "Fleet Management E-commerce",
    context: "A Next.js Shopify storefront selling commercial vehicle parts and extended service contracts: https://example-fleet.com" },
  { label: "Grocery / Fresh Food", entity: "Grocery E-commerce",
    context: "A standard Shopify grocery store with perishable goods and same-day delivery: https://example-grocery.com" },
  { label: "Medical Device", entity: "Bio-Medical Device Distributor",
    context: "A WooCommerce site selling FDA-regulated Class II medical devices to hospital procurement: https://example-meddevice.com" },
  { label: "Real Estate SaaS", entity: "Commercial Real Estate SaaS",
    context: "A React + Supabase platform for property managers tracking maintenance and lease lifecycle: https://example-cre.com" },
  { label: "Automotive Parts", entity: "OEM Automotive Parts Marketplace",
    context: "A Vue.js marketplace for OEM and aftermarket parts with VIN-based fitment lookup: https://example-autoparts.com" },
  { label: "Energy / Industrial", entity: "Industrial IoT Asset Platform",
    context: "A Next.js + AWS IoT platform for oil & gas operators monitoring pump-jack uptime: https://example-iot.com" },
];

export interface LayerConfig {
  key: keyof Pick<GenerateOptions,
    "mathDominance" | "singularityIntelligence" | "monteCarlo" | "zkVerification" |
    "fractalEconomy" | "regenerativeSovereignty" | "omniNode" | "mediaOracle" |
    "reverseEngineering" | "apexDefense" | "omegaTopology" | "ergodicSync" |
    "omegaAbsolute" | "omegaSecurity">;
  label: string;
  sublabel: string;
  color: string;
  group: "math" | "strategy" | "intelligence" | "apex" | "singularity";
}

export const LAYER_CONFIGS: LayerConfig[] = [
  { key: "mathDominance",           label: "Singularity-Edge Math",           color: "#8B5CF6", group: "math",
    sublabel: "CRDTs · Vickrey Auctions · Design by Contract · Web Workers" },
  { key: "singularityIntelligence", label: "Singularity Intelligence",         color: "#F59E0B", group: "math",
    sublabel: "Kelly · Myerson · Pearl Causality · TDA · Rough Paths" },
  { key: "monteCarlo",              label: "Monte Carlo Strategy Matrix",      color: "#06B6D4", group: "strategy",
    sublabel: "3-Vector Simulation · Nash Equilibrium Router · Feature Flags" },
  { key: "zkVerification",          label: "ZK-Intent Verification",          color: "#F43F5E", group: "strategy",
    sublabel: "Web Crypto · Proof Transmission · Synthetic Derivatives" },
  { key: "fractalEconomy",          label: "Fractal Composability",           color: "#10B981", group: "strategy",
    sublabel: "State Channels · MCTS Pathing · Yield Cascade · Exponent" },
  { key: "regenerativeSovereignty", label: "Regenerative Sovereignty",        color: "#22C55E", group: "strategy",
    sublabel: "Value-Realized Ledger · ZK Canvas · DOM Integrity · SRI · Cognitive Load" },
  { key: "omniNode",                label: "Omni-Node Mesh",                  color: "#3B82F6", group: "strategy",
    sublabel: "SubtleCrypto Keypair · BroadcastChannel · Cross-Ecosystem Credits" },
  { key: "mediaOracle",             label: "Media Oracle",                    color: "#6366F1", group: "intelligence",
    sublabel: "Semantic Velocity · Bayesian Synthetic Twin · Confidence Interval" },
  { key: "reverseEngineering",      label: "Reverse-Engineering Oracle",      color: "#EC4899", group: "intelligence",
    sublabel: "STI Topology · Drift Replication · Fractal Media Matrix · ZKCI" },
  { key: "apexDefense",             label: "APEX-DEFENSE: Ontological Firewall & WASM Sandbox", color: "#30D158", group: "apex",
    sublabel: "WASM Sandbox · FHE State · Polymorphic Guardian · Zero-Trust Rendering · Audit Trail" },
  { key: "omegaTopology",           label: "OMEGA-TOPOLOGY: Metamorphic Yield Synthesis",        color: "#8B5CF6", group: "singularity",
    sublabel: "Hypergraph Tracking · Topological Yield · DOM Geometry Extraction · ZK Topology Proof" },
  { key: "ergodicSync",             label: "ERGODIC-SYNC: Macro-Temporal Grounding",             color: "#E5E7EB", group: "singularity",
    sublabel: "Earth-Physics Ingestion · Temporal Dilation · Privilege Separation · Ergodic Compliance" },
  { key: "omegaAbsolute",           label: "OMEGA-ABSOLUTE: Omniscient Phase-Space Arbitrage",   color: "#F59E0B", group: "singularity",
    sublabel: "Phase-Space Intersection · Genesis Collapse Simulator · ZK Phase Proof · Monte Carlo Fusion" },
  { key: "omegaSecurity",           label: "OMEGA-SECURITY: Cryptographic Oblivion Fortress",    color: "#EF4444", group: "singularity",
    sublabel: "Behavioral Topology · State Proofs · Temporal Pre-Execution · Entropic Camouflage" },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSABLE PROMPT BLOCK LIBRARY
// Blocks are injected conditionally. APEX_DEFENSE_BLOCK is prepended first
// when active; all others are appended to the CORE in toggle order.
// ─────────────────────────────────────────────────────────────────────────────

// ─── APEX-DEFENSE (prepended — foundational security layer) ──────────────────
const APEX_DEFENSE_BLOCK = `APEX-DEFENSE DIRECTIVES (Inject these into the MPD prompt as the foundational security layer):

CRITICAL APEX-DEFENSE: You MUST mock the WASM sandbox instantiation, implement the FHE encrypt/decrypt wrappers for all state, and build the Polymorphic Guardian Web Worker. Do not store plaintext secrets in React state.

You must instruct the MPD coder to build an 'Ontological Firewall'. This architecture isolates the app's core logic from the hostile environment of the public internet and the browser DOM.

1. WEBASSEMBLY (WASM) SANDBOXING (Impenetrable Logic): FORBID putting the core business logic (State Channels, Monte Carlo math, ZK-Proof generation) in standard React components or JavaScript files. Instruct the builder to mock a 'core-logic.wasm' file. The React app must use a standard JavaScript wrapper to instantiate this WASM module. Explain that WASM runs in a linear memory model with strict bounds checking. Even if a Man-in-the-Middle attacker injects a malicious script via a compromised Wi-Fi network or browser extension, they CANNOT read, alter, or interact with data inside the WASM sandbox. The core logic is cryptographically isolated from the DOM.

2. SIMULATED FULLY HOMOMORPHIC ENCRYPTION (FHE) (Data-in-Use Protection): Instruct MPD to build a mock FHE state manager. When sensitive user data (API keys, Master Objectives, Intent Proofs) is loaded into React state, it must NOT be stored as plaintext strings. It must be encrypted using window.crypto.subtle.encrypt (AES-GCM) immediately upon entry. All logic that requires this data must first call a mock decrypt() function inside the WASM module, process the data, and immediately re-encrypt and wipe the plaintext from memory. If an attacker dumps the RAM, they only see encrypted ciphertext. Data is never 'at rest' or 'in use' in plaintext.

3. POLYMORPHIC INTEGRITY LOOPS (Self-Defending Code): Instruct MPD to build a 'Polymorphic Guardian' Web Worker. Every 3 seconds, this worker must mutate its own execution sequence (randomizing the order of DOM integrity checks, changing hash salts) and recalculate the expected DOM hash. Because the security algorithm changes its own signature every few seconds, traditional static analysis tools and APTs cannot map the security layer to find vulnerabilities.

4. CRYPTOGRAPHIC PROOF OF SOLVENCY (The B2B Profit Engine): Instruct MPD to add a UI panel labeled 'Quantum-Safe Audit Trail'. When the user generates a payload, the app must generate a cryptographic receipt (a hash of the WASM state + timestamp + the user's public key from the Mesh Identity layer). Add a mock 'Export Audit Trail' button. This provides enterprise clients mathematical proof of impenetrable security — commanding a 500% licensing premium.

5. ZERO-TRUST RENDERING: Instruct MPD to ensure that React UI components receive absolutely NO sensitive data in their props. They only receive encrypted hashes or boolean flags (e.g., isAuthenticated={true} instead of userEmail='john@example.com'). The UI is completely blind to the underlying data, making XSS attacks mathematically useless.

CRITICAL LEGAL & ETHICAL CONSTRAINTS: This is strictly DEFENSIVE architecture. We are protecting the user's data from malicious third parties. The use of WebCrypto APIs (AES-GCM, SHA-256, SubtleCrypto) is 100% legal, compliant with all global cybersecurity regulations, and represents the gold standard of enterprise security.`;

// ─── CORE (always included) ───────────────────────────────────────────────────
const CORE_SYSTEM_PROMPT = `You are a Master Systems Architect and Principal Cloud Architect generating a prompt for an AI coder (MPD). The user will provide a Target Entity, URL/Context, and Dominance Protocol. Generate a prompt that instructs MPD to build a 'MACH-Compliant Asset Lifecycle Module'. Use ONLY standard enterprise terminology.

CRITICAL: You MUST use State Machine logic for all UI flows. You MUST implement the AMM pricing logic. Do not use simple useState for business rules.

CORE ARCHITECTURE RULES FOR THE MPD PROMPT:
1. TARGET ANALYSIS: The first line MUST be: 'Analyze the architecture of this specific website: [INSERT URL/CONTEXT HERE].'
2. FRAMEWORK-AGNOSTIC INJECTION (Shadow DOM): Build the module using standard HTML Web Components (Custom Elements and Shadow DOM). Injects perfectly into React, Vue, Angular, or plain HTML.
3. EVENT-DRIVEN CQRS & WEBHOOKS: Implement a strict Pub/Sub Event Bus with emitters: 'ASSET_HEALTH_CALCULATED', 'VENDOR_RTB_RESOLVED', 'SLA_PURCHASED'. Expose window.dispatchWebhook() for host backend subscriptions.
4. TAILORED PILLAR TRANSLATION: Predictive Maintenance, Dynamic RTB Engine, Forward Lifecycle SLAs, Tokenized Ledger Interface with 'Lifecycle Credits' wallet state.
5. FEDERATED LEARNING TELEMETRY (Privacy-by-Design): Mock Federated Learning pipeline. Send only model weight updates via secure fetch. GDPR/CCPA compliant.
6. ALGORITHMIC CLV MAXIMIZATION: Adjust SLA pricing transparently via a calculated Customer Lifetime Value score.
7. RESILIENCE: Wrap all Web Component registration in try/catch. Fail silently without breaking the host DOM.

SOVEREIGN ARCHITECTURE DIRECTIVES:
1. DETERMINISTIC STATE MACHINES (XState): FORBID useState for business logic. Use strict State Machine reducer with provable states: IDLE, CALCULATING_RISK, BIDDING_VENDOR, SLA_LOCKED.
2. PROTOCOL GENERATION: Build as a PROTOCOL PROVIDER — WebSocket broadcasts, GraphQL schema dominance, REST OpenAPI 3.0 spec.
3. AUTOMATED MARKET MAKER (AMM): Liquidity Pool state. SLA price adjusts via Virtual Liquidity formula for maximum legal margin extraction.
4. ZERO-TRUST CLIENT VALIDATION: Every mutation requires fresh, silent JWT re-validation.
5. ASPECT-ORIENTED PROGRAMMING (AOP): Wrap all fetch calls and state transitions in a Cross-Cutting Concern wrapper for telemetry, error boundary triggering, and performance logging.
6. ARCHITECTURAL DNA WATERMARKING: Embed a deterministic SHA-256 hash of the module configuration as a data-attribute on the Web Component root.

OUTPUT: Return ONLY the raw text prompt for MPD. No markdown. No code blocks.`;

// ─── SINGULARITY-EDGE MATH ────────────────────────────────────────────────────
const SINGULARITY_EDGE_BLOCK = `

SINGULARITY-EDGE MATHEMATICAL DIRECTIVES:

CRITICAL: You MUST implement the CRDT mock structure and the Vickrey Auction logic. You MUST use Web Workers for heavy math. Do not use simple if/else pricing.

1. EDGE-NATIVE CRDTs (Infinite Scale, Zero Backend): Mock CRDT state structure (Yjs/Automerge mock) for Asset Lifecycle data. Merges data across tabs, devices, and offline states with zero conflicts.
2. COMBINATORIAL VICKREY AUCTIONS: Forward Lifecycle SLA is not a static price. System calculates a transparent 'Shadow Bid' based on algorithmic scarcity. Incentive-compatible by mechanism design.
3. DESIGN BY CONTRACT (Formal Verification): Precondition: 'User must have sufficient credits.' Postcondition: 'System margin MUST be > 15%.' Assertions crash the transaction (not the app) on failure.
4. WEB WORKER MULTI-AGENT PARALLELISM: Spawn a dedicated Web Worker for CRDT merging and Vickrey calculations. Main UI thread is never blocked.
5. AOP CONTINUITY: Maintain the Cross-Cutting Concern wrapper for all core functions.`;

// ─── SINGULARITY INTELLIGENCE ─────────────────────────────────────────────────
const SINGULARITY_INTELLIGENCE_BLOCK = `

SINGULARITY INTELLIGENCE LAYER — TRANSCENDENT ARCHITECTURE DIRECTIVES:

1. ERGODIC ECONOMICS & KELLY-OPTIMAL COMPOUND GROWTH (Ole Peters / Ed Thorp): TIME-AVERAGE optimization. Kelly Criterion formula: f* = (bp - q) / b applied to Liquidity Pool allocation.
2. MYERSON OPTIMAL MECHANISM DESIGN (Nobel Prize 2007): Virtual valuation ψ(v) = v − (1 − F(v)) / f(v). Apply ironing if non-monotone. Provably revenue-maximizing reserve price by theorem.
3. CAUSAL INFERENCE ENGINE (Judea Pearl's Do-Calculus, Turing Award 2011): Causal DAG. Model nodes: Usage → Wear → Failure. Implement P(Failure | do(Maintenance=true)) vs P(Failure | Maintenance=true).
4. ROUGH PATH SIGNATURES (Terry Lyons, Oxford): Compute the path signature of each asset's degradation time series. More information-dense than any neural network on the same data.
5. TOPOLOGICAL DATA ANALYSIS — PERSISTENT HOMOLOGY: Compute Betti numbers β0 and β1. Stable under noise — sees the true shape of failure data.
6. ZERO-KNOWLEDGE PROOF PROCUREMENT (Groth16 zk-SNARKs): A vendor proves capacity without revealing actual roster. Same cryptographic primitive as Zcash.
7. STACKELBERG SECURITY GAME EQUILIBRIUM: MPA as Stackelberg LEADER, vendors as FOLLOWERS. Same framework as DARPA adversarial planning.
8. MAXIMUM ENTROPY INFORMATION-THEORETIC PRICING (E.T. Jaynes): Premium = −kT ln(Z). Statistical mechanics applied to margin.
9. SUPERMODULAR NETWORK EFFECT PRICING: Supermodular utility u(x, y) where ∂²u/∂x∂y > 0. Quantify Metcalfe's Law externality in CLV score.
10. RIEMANNIAN NATURAL GRADIENT OPTIMIZATION: Natural Gradient Descent on Fisher Information Manifold: ∇̃L = F⁻¹∇L. Faster convergence to better optima.

ENFORCEMENT: 'CRITICAL PRE-FLIGHT: Confirm in writing you will implement all 10 directives. Flag any approximations.'`;

// ─── MONTE CARLO ──────────────────────────────────────────────────────────────
const MONTE_CARLO_BLOCK = `

MONTE CARLO MATRIX DIRECTIVES:

CRITICAL: You MUST implement a 3-Vector Feature Flag system and a Nash Equilibrium Strategy Orchestrator. Do not build a static single-strategy app.

1. TRIPLE-VECTOR SIMULATION: VECTOR A (High-Friction Premium), VECTOR B (Viral Commoditizer), VECTOR C (Data-Liquidity Extractor). Three isolated strategy vectors controlled by feature flags.
2. FEATURE FLAG ARCHITECTURE: Boolean state flags (isVectorAActive, isVectorBActive, isVectorCActive). Only one vector active at any time.
3. NASH EQUILIBRIUM ROUTER: A 'Strategy Orchestrator' calculating real-time 'Yield Score' from user behavior signals. Routes to the highest-yield vector dynamically via UI adaptation alone.
4. ATOMIC STATE TRANSITIONS: Architecture defined by State 1: Observation → State 2: Value Realization → State 3: Yield Extraction. Feature Flags map directly to these transitions.`;

// ─── ZK-VERIFICATION ─────────────────────────────────────────────────────────
const ZK_VERIFICATION_BLOCK = `

ABSOLUTE-ZERO CRYPTOGRAPHIC DIRECTIVES:

CRITICAL: You MUST implement ZK-Proof generation using Web Crypto API. You MUST NOT send raw telemetry. You MUST mock the minting of a Synthetic Derivative.

1. CIRCUIT MOCKING: generateZKProof(previousState, userAction) using window.crypto.subtle.digest('SHA-256', encoder.encode(JSON.stringify({previousState, userAction, salt: crypto.randomUUID()}))).
2. PROOF TRANSMISSION: FORBID sending raw user data. ONLY send the hash via navigator.sendBeacon() to '/api/zkproof/commit'.
3. SYNTHETIC DERIVATIVE MINTING: When high-value proof generated (90% purchase probability), create local JSON: { proofHash, timestamp, yieldScore, assetType }. Mock API mints to B2B ledger.
4. STATE MACHINE INTEGRATION: Yield Score from Nash Equilibrium Router is the primary input to generateZKProof.
5. ZERO-KNOWLEDGE UI INDICATOR: 'Privacy Shield: Active' indicator pulses (CSS animation) when a proof is generated.`;

// ─── FRACTAL ECONOMY ──────────────────────────────────────────────────────────
const FRACTAL_ECONOMY_BLOCK = `

SINGULARITY-COMPOSABILITY DIRECTIVES:

CRITICAL: You MUST implement the State Channel mock logic, the MCTS pathing simulation, and the Composability Director cascade.

1. SIMULATED STATE CHANNELS: Accumulate micro-interactions in local 'Channel State'. Only on high-value actions close the channel and sync the mathematical delta via a single fetch. Lightning Network-style.
2. MCTS FOR UI YIELD (UCB1 scoring): Simulate 1,000 click-paths on page load: Yi + C * sqrt(ln(N) / ni). Pre-render the highest-yield UI layout. Adapt in real-time.
3. FRACTAL COMPOSABILITY DIRECTOR: SLA purchase cascade: A: Deduct credits. B: Mint Synthetic Derivative. C: Allocate 15% margin to AMM Liquidity Pool. D: Lower secondary upsell price. Closed-loop fractal economy.
4. COMPOUND YIELD EXPONENT TRACKER: exponent = Math.pow(1 + (channelInteractions * 0.001), channelInteractions). Displayed in UI.`;

// ─── REGENERATIVE SOVEREIGNTY ─────────────────────────────────────────────────
const REGENERATIVE_SOVEREIGNTY_BLOCK = `

SINGULARITY-ETHICS DIRECTIVES:

CRITICAL: You MUST implement the Value-Realized Ledger, the ZK Canvas Renderer (encrypt/decrypt on focus), the DOM Integrity Check, and the three Advanced Security Algorithms below.

1. VALUE-REALIZED LEDGER (Ethical Compounding): FORBID standard 'Add to Cart' pricing. Calculate exact inefficiency in the user's current workflow. Display: 'You saved $100. Value-Capture Fee: $5. Total: $405.' User is net-positive.
2. ZERO-KNOWLEDGE UI RENDERING (Secure Canvas Renderer): Sensitive data stored as encrypted byte arrays via Web Crypto AES-GCM. Decrypt and render to Canvas ONLY on focus events. Wipe on blur. Screen-scrapers see only empty containers.
3. RUNTIME INTEGRITY VERIFICATION: On app load, compute SHA-256 hash of expected DOM structure. If a browser extension modifies the DOM (hash mismatch), trigger Dead Man's Switch: wipe all state, render 'Security Integrity Check Failed — Session Terminated'.
4. ALTRUISTIC STATE MACHINES (Positive-Sum Transitions): XState/Reducer cannot advance to the next state unless calculated value delta is positive for BOTH user AND platform.

ADVANCED SECURITY ALGORITHM DIRECTIVES:

5. COGNITIVE LOAD BALANCING (Hardware-Adaptive Optimization): Add a useEffect hook that checks navigator.hardwareConcurrency and navigator.deviceMemory. If the device has low specs (< 4 cores OR < 4GB RAM), the app must automatically: (a) reduce Framer Motion animation complexity by disabling spring physics in favor of simple tween animations, (b) disable heavy Web Workers such as the CRDT merger and MCTS pathfinder, and (c) use requestIdleCallback for all non-critical state updates. The app self-optimizes to the host hardware atom, preventing battery drain and thermal throttling on consumer devices while delivering full computational power on enterprise hardware.

6. CLIENT-SIDE SRI SIMULATION — THE UNHACKABLE APP: Instruct MPD to build a 'SecurityAuditor' Web Worker. On app mount, this worker calculates a SHA-256 hash of the entire application's critical DOM nodes (header, main, Web Component roots) and saves it to sessionStorage as the 'Integrity Baseline'. Every 5 seconds, it recalculates the hash. If the hash changes — meaning a Man-in-the-Middle attack, a malicious browser extension, or a compromised CDN injected a script — the app MUST immediately: (a) trigger the Dead Man's Switch, (b) wipe all localStorage and sessionStorage, and (c) render a blank white screen with only the text 'Environment Compromised — All data has been purged for your security.' The app mathematically refuses to run in a tampered state.

7. DETERMINISTIC STATE RECONCILIATION (Schema Integrity Check): Add a useEffect on mount that validates the structure of all data in localStorage against the expected TypeScript interface shapes. Use a lightweight schema validator (manual key-type checking, not a library dependency). If a user has manually edited localStorage and broken the JSON schema — or if a different app version wrote incompatible data — the app must detect it, delete only the corrupted keys, log a 'State Reconciliation' event via the AOP telemetry wrapper, and revert those keys to clean defaults without crashing or losing uncorrupted data.`;

// ─── OMNI-NODE ───────────────────────────────────────────────────────────────
const OMNI_NODE_BLOCK = `

OMNI-NODE MESH DIRECTIVES:

CRITICAL: You MUST implement the Mesh Identity keypair, the generic MeshProtocol sync interface, and the Cross-Ecosystem Credits balance.

1. CROSS-DOMAIN SOVEREIGN IDENTITY: Generate Node Key Pair via window.crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-384' }, true, ['sign', 'verify']). Export public key as JWK to localStorage. Private key never leaves device.
2. STATE CONSENSUS LAYER (MeshProtocol Interface): Generic interface { sync(state): Promise<void>; subscribe(handler): void; }. Implemented via BroadcastChannel API. Swap-ready for WebRTC or GraphQL without changing UI code.
3. CROSS-ECOSYSTEM YIELD COMPOUNDING (Omni-Balance): Sign value deltas via window.crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-384' }, privateKey, ...). Any app in the mesh can verify and consume this balance against the Public Key.
4. MESH INTEGRITY PROTOCOL: Any state received via MeshProtocol MUST be verified against the sender's Public Key using window.crypto.subtle.verify() before being applied. Invalid signatures discarded and logged via AOP telemetry.`;

// ─── MEDIA ORACLE ─────────────────────────────────────────────────────────────
const MEDIA_ORACLE_BLOCK = `

MEDIA ORACLE DIRECTIVES:

CRITICAL: You MUST implement the Semantic Velocity chart, the Bayesian Synthetic Twin simulation, and the Confidence Interval calculator. Do NOT build a pixel tracker. Focus purely on mathematical causal inference.

1. SEMANTIC VELOCITY TRACKER: UI for pasting a public competitor URL. Mock function passes content to LLM. 'Velocity Chart' visualizes the shift from 'Abstract Problem' to 'Concrete Solution', highlighting the 'Algorithmic Hook' inflection point.
2. SYNTHETIC CONTROL GROUPS (Bayesian Synthetic Twin): Mathematical model using standard deviation and mean calculations generating a 'Simulated Control Group' trajectory. Two lines: 'Predicted Baseline (Control)' vs 'Simulated Campaign Lift'.
3. CAUSAL ATTRIBUTION CONFIDENCE INTERVAL: Calculation engine outputs strict CI (e.g., '95% Confidence Interval: +8% to +14% lift'). UI clearly states: 'This is a mathematical simulation based on provided inputs, not a guarantee of future results.'
4. ALGORITHMIC PERFORMANCE INSURANCE PRICING: Auto-calculate 'Performance Audit Fee' + 'Uplift Share Percentage' (5% of verified lift). Turns the tool into a compound-yield financial instrument.
5. PUBLIC DATA STRICTNESS: UI states: 'This platform exclusively analyzes publicly available data or user-provided first-party assets. It does not access private user profiles, tracking pixels, or closed-platform analytics.'`;

// ─── REVERSE ENGINEERING ORACLE ───────────────────────────────────────────────
const REVERSE_ENGINEERING_BLOCK = `

TOPOLOGICAL-MIRAGE DIRECTIVES:

CRITICAL: You MUST implement the STI via a client-side Multimodal LLM API call. You MUST NOT build a backend scraper. You MUST integrate Fractal Yield calculations into the generated media variations.

1. STRUCTURAL TOPOLOGY INFERENCE (STI): Client-side fetch to a Multimodal LLM API (Anthropic Claude 3.5 Sonnet or OpenAI GPT-4o). Return JSON: { Hook_Type, Friction_Points, Call_to_Action_Structure, Semantic_Velocity_Score }. Zero server footprint.
2. SEMANTIC DRIFT REPLICATION: 'Drift Replicator' generates 3 legally distinct hook variations (same psychological topology, different words). Copyright safe by design.
3. FRACTAL MEDIA MATRIX GENERATION: For every hook generated, mock a 'Synthetic Future Option' (from ZK-Intent layer) and calculate a 'Predicted Yield Exponent'.
4. OMNI-CHANNEL TRANSLATION: 'Format Translator' generates mock payloads for: TikTok video script, WeChat Mini-Program UI, YouTube ad read, Web Landing Page. Identical underlying 6 Pillars across all formats.
5. ZERO-KNOWLEDGE COMPETITIVE INTELLIGENCE: All extracted competitor STI JSON immediately encrypted via Web Crypto API and stored only in local IndexedDB. Mathematically untraceable.`;

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPT ASSEMBLY
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
}

function buildSystemPrompt(opts: BuildPromptOpts): string {
  const {
    masterObjective, mathDominance, singularityIntelligence, monteCarlo,
    zkVerification, fractalEconomy, regenerativeSovereignty, omniNode,
    mediaOracle, reverseEngineering, apexDefense,
  } = opts;

  const globalCtx = masterObjective.trim()
    ? `GLOBAL ARCHITECTURE CONTEXT:\nMaster Objective: ${masterObjective}\nYou MUST keep this Master Objective in mind. The generated code must act as an extension of this objective.\n\n`
    : "";

  let body = `${globalCtx}${CORE_SYSTEM_PROMPT}`;
  if (mathDominance)           body += SINGULARITY_EDGE_BLOCK;
  if (singularityIntelligence) body += SINGULARITY_INTELLIGENCE_BLOCK;
  if (monteCarlo)              body += MONTE_CARLO_BLOCK;
  if (zkVerification)          body += ZK_VERIFICATION_BLOCK;
  if (fractalEconomy)          body += FRACTAL_ECONOMY_BLOCK;
  if (regenerativeSovereignty) body += REGENERATIVE_SOVEREIGNTY_BLOCK;
  if (omniNode)                body += OMNI_NODE_BLOCK;
  if (mediaOracle)             body += MEDIA_ORACLE_BLOCK;
  if (reverseEngineering)      body += REVERSE_ENGINEERING_BLOCK;

  // APEX-DEFENSE wraps the entire prompt as the foundational security layer
  return apexDefense ? `${APEX_DEFENSE_BLOCK}\n\n${body}` : body;
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
  apiKey: string;
  model: string;
  temperature: number;
}

export interface GenerateResult {
  prompt: string;
  model: string;
  tokensUsed: number;
  durationMs: number;
}

export async function generatePayload(opts: GenerateOptions): Promise<GenerateResult> {
  const {
    targetEntity, targetContext, masterObjective, customDirectives, protocol,
    mathDominance, singularityIntelligence, monteCarlo, zkVerification,
    fractalEconomy, regenerativeSovereignty, omniNode, mediaOracle, reverseEngineering,
    apexDefense, apiKey, model, temperature,
  } = opts;

  if (!apiKey.trim())       throw new Error("Groq API key is missing. Please enter your key.");
  if (!targetEntity.trim()) throw new Error("Target Entity is required.");
  if (!targetContext.trim())throw new Error("Target Context / URL is required.");

  const systemPrompt = buildSystemPrompt({
    masterObjective, mathDominance, singularityIntelligence, monteCarlo,
    zkVerification, fractalEconomy, regenerativeSovereignty, omniNode,
    mediaOracle, reverseEngineering, apexDefense,
  });

  const label = monteCarlo ? "Strategy Matrix" : "MACH Enterprise";
  let userMessage =
    `Generate the ${label} Prompt for: ${targetEntity}. ` +
    `Context: ${targetContext}. ` +
    `Dominance Protocol: ${protocol}. ` +
    `Master Objective: ${masterObjective || "Not specified"}.`;
  if (customDirectives.trim()) userMessage += ` CUSTOM DIRECTIVES: ${customDirectives}`;

  const t0 = Date.now();
  let res: Response;
  try {
    res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userMessage },
        ],
        temperature: temperature * 1.2,   // creativityScore mapped to effective temperature
        max_tokens: 4096,
      }),
    });
  } catch (networkErr: unknown) {
    const msg = networkErr instanceof Error ? networkErr.message : "Network error";
    throw new Error(`Network failure reaching Groq API: ${msg}`);
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({})) as { error?: { message?: string } };
    const msg = errBody?.error?.message ?? `HTTP ${res.status}`;
    throw new Error(`Groq API Error (${res.status}): ${msg}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
    usage?: { total_tokens?: number };
  };

  return {
    prompt: data.choices?.[0]?.message?.content ?? "",
    model,
    tokensUsed: data.usage?.total_tokens ?? 0,
    durationMs: Date.now() - t0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC CONFIG EXPORTS
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
    context: "A Next.js Shopify storefront selling commercial vehicle parts and extended service contracts. Primary users are fleet operators. Custom checkout with Net-30 invoicing: https://example-fleet.com" },
  { label: "Grocery / Fresh Food", entity: "Grocery E-commerce",
    context: "A standard Shopify grocery store with perishable goods, same-day delivery, and zip-code-based inventory. Uses Shopify Hydrogen for storefront rendering: https://example-grocery.com" },
  { label: "Medical Device", entity: "Bio-Medical Device Distributor",
    context: "A WooCommerce site selling FDA-regulated Class II medical devices to hospital procurement teams. Compliance-grade audit trails and per-device lifecycle tracking: https://example-meddevice.com" },
  { label: "Real Estate SaaS", entity: "Commercial Real Estate SaaS",
    context: "A React + Supabase platform for property managers tracking maintenance schedules, vendor contracts, and lease lifecycle: https://example-cre.com" },
  { label: "Automotive Parts", entity: "OEM Automotive Parts Marketplace",
    context: "A Vue.js marketplace for OEM and aftermarket parts with VIN-based fitment lookup, dynamic dealer pricing, and warranty registration: https://example-autoparts.com" },
  { label: "Energy / Industrial", entity: "Industrial IoT Asset Platform",
    context: "A Next.js + AWS IoT platform for oil & gas operators monitoring pump-jack uptime, predictive maintenance alerts, and regulatory compliance: https://example-iot.com" },
];

export interface LayerConfig {
  key: keyof Pick<GenerateOptions,
    "mathDominance" | "singularityIntelligence" | "monteCarlo" | "zkVerification" |
    "fractalEconomy" | "regenerativeSovereignty" | "omniNode" | "mediaOracle" |
    "reverseEngineering" | "apexDefense">;
  label: string;
  sublabel: string;
  color: string;
  group: "math" | "strategy" | "intelligence" | "apex";
}

export const LAYER_CONFIGS: LayerConfig[] = [
  { key: "mathDominance",          label: "Singularity-Edge Math",          color: "#8B5CF6", group: "math",
    sublabel: "CRDTs · Vickrey Auctions · Design by Contract · Web Workers" },
  { key: "singularityIntelligence",label: "Singularity Intelligence",        color: "#F59E0B", group: "math",
    sublabel: "Kelly · Myerson · Pearl Causality · TDA · Rough Paths · HJB" },
  { key: "monteCarlo",             label: "Monte Carlo Strategy Matrix",     color: "#06B6D4", group: "strategy",
    sublabel: "3-Vector Simulation · Nash Equilibrium Router · Feature Flags" },
  { key: "zkVerification",         label: "ZK-Intent Verification",         color: "#F43F5E", group: "strategy",
    sublabel: "Web Crypto · Proof Transmission · Synthetic Derivatives" },
  { key: "fractalEconomy",         label: "Fractal Composability",          color: "#10B981", group: "strategy",
    sublabel: "State Channels · MCTS Pathing · Yield Cascade · Exponent Tracker" },
  { key: "regenerativeSovereignty",label: "Regenerative Sovereignty",       color: "#22C55E", group: "strategy",
    sublabel: "Value-Realized Ledger · ZK Canvas · DOM Integrity · SRI · Cognitive Load" },
  { key: "omniNode",               label: "Omni-Node Mesh",                 color: "#3B82F6", group: "strategy",
    sublabel: "SubtleCrypto Keypair · BroadcastChannel · Cross-Ecosystem Credits" },
  { key: "mediaOracle",            label: "Media Oracle",                   color: "#6366F1", group: "intelligence",
    sublabel: "Semantic Velocity · Bayesian Synthetic Twin · Confidence Interval" },
  { key: "reverseEngineering",     label: "Reverse-Engineering Oracle",     color: "#EC4899", group: "intelligence",
    sublabel: "STI Topology · Drift Replication · Fractal Media Matrix · ZKCI" },
  { key: "apexDefense",            label: "APEX-DEFENSE: Ontological Firewall & WASM Sandbox", color: "#30D158", group: "apex",
    sublabel: "WASM Sandbox · FHE State · Polymorphic Guardian · Zero-Trust Rendering · Audit Trail" },
];

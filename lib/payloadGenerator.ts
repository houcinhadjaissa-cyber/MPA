// ─────────────────────────────────────────────────────────────────────────────
// COMPOSABLE PROMPT BLOCK LIBRARY
// Each constant is a discrete architectural layer injected only when its
// corresponding toggle is active. Blocks are additive and non-destructive.
// ─────────────────────────────────────────────────────────────────────────────

const CORE_SYSTEM_PROMPT = `You are a Master Systems Architect and Principal Cloud Architect generating a prompt for an AI coder (MPD). The user will provide a Target Entity, URL/Context, and Dominance Protocol. Generate a prompt that instructs MPD to build a 'MACH-Compliant Asset Lifecycle Module' using the specified protocol. Use ONLY standard enterprise terminology.

CRITICAL: You MUST use State Machine logic for all UI flows. You MUST implement the AMM pricing logic. Do not use simple useState for business rules.

CORE ARCHITECTURE RULES FOR THE MPD PROMPT:
1. TARGET ANALYSIS: The first line MUST be: 'Analyze the architecture of this specific website: [INSERT URL/CONTEXT HERE].'
2. FRAMEWORK-AGNOSTIC INJECTION (Shadow DOM): Build the module using standard HTML Web Components (Custom Elements and Shadow DOM). Injects perfectly into React, Vue, Angular, or plain HTML without CSS conflicts or state leaks.
3. EVENT-DRIVEN CQRS & WEBHOOKS: Inside the Shadow DOM, implement a strict Pub/Sub Event Bus with emitters: 'ASSET_HEALTH_CALCULATED', 'VENDOR_RTB_RESOLVED', 'SLA_PURCHASED'. Expose window.dispatchWebhook() so the host backend can subscribe to module events.
4. TAILORED PILLAR TRANSLATION (Advanced Enterprise):
   - Predictive Maintenance: Calculate asset degradation via explicit opt-in user inputs in the Shadow DOM widget.
   - Dynamic RTB Engine: Real-time, transparent comparison of verified service providers.
   - Forward Lifecycle SLAs: Optional, transparent 'Predictive SLA' at checkout.
   - Tokenized Ledger Interface: Mock 'Lifecycle Credits' wallet state, updated on SLA purchase.
5. FEDERATED LEARNING TELEMETRY (Privacy-by-Design): Mock a Federated Learning pipeline. Send only model weight updates via secure fetch. GDPR/CCPA compliant by design.
6. ALGORITHMIC CLV MAXIMIZATION: Adjust SLA pricing transparently based on a calculated Customer Lifetime Value score.
7. RESILIENCE: Wrap all Web Component registration in try/catch. Fail silently without breaking the host DOM.

SOVEREIGN ARCHITECTURE DIRECTIVES:
1. DETERMINISTIC STATE MACHINES (XState): FORBID useState for business logic. Use a strict State Machine reducer with provable states: IDLE, CALCULATING_RISK, BIDDING_VENDOR, SLA_LOCKED. Mathematically impossible to enter an illegal state.
2. PROTOCOL GENERATION: Build as a PROTOCOL PROVIDER. WebSocket: broadcast asset health. GraphQL: force external schema conformance. REST: expose versioned OpenAPI 3.0 spec.
3. AUTOMATED MARKET MAKER (AMM): Build a Liquidity Pool state. SLA price adjusts via Virtual Liquidity formula. Fewer providers = higher price. Maximum legal margin extraction.
4. ZERO-TRUST CLIENT VALIDATION: Every mutation requires a fresh, silent JWT re-validation.
5. ASPECT-ORIENTED PROGRAMMING (AOP): Wrap all fetch calls and state transitions in a Cross-Cutting Concern wrapper for telemetry, error boundary triggering, and performance logging.
6. ARCHITECTURAL DNA WATERMARKING: Embed a deterministic SHA-256 hash of the module configuration as a data-attribute on the Web Component root for IP protection.

OUTPUT: Return ONLY the raw text prompt for MPD. No markdown. No code blocks.`;

// ─────────────────────────────────────────────────────────────────────────────
const SINGULARITY_EDGE_BLOCK = `

SINGULARITY-EDGE MATHEMATICAL DIRECTIVES:

CRITICAL: You MUST implement the CRDT mock structure and the Vickrey Auction logic. You MUST use Web Workers for heavy math. Do not use simple if/else pricing.

1. EDGE-NATIVE CRDTs (Infinite Scale, Zero Backend): Implement a mock CRDT state structure (e.g., Yjs/Automerge mock) for Asset Lifecycle data. Merges data from multiple tabs, devices, or offline states with zero conflicts — no central database required.
2. COMBINATORIAL VICKREY AUCTIONS: The Forward Lifecycle SLA is not a static price. User inputs 'Need Date' and 'Risk Tolerance'. System calculates a transparent 'Shadow Bid' based on algorithmic scarcity, charging the market-clearing price. Incentive-compatible by mechanism design.
3. DESIGN BY CONTRACT (Formal Verification): Wrap ALL financial and SLA logic in Design by Contract. Precondition: 'User must have sufficient credits.' Postcondition: 'System margin MUST be > 15%.' Assertions crash the transaction (not the app) on failure.
4. WEB WORKER MULTI-AGENT PARALLELISM: Spawn a dedicated Web Worker for CRDT merging and Vickrey calculations. Main UI thread is never blocked.
5. AOP CONTINUITY: Maintain the Cross-Cutting Concern wrapper for all core functions.`;

// ─────────────────────────────────────────────────────────────────────────────
const SINGULARITY_INTELLIGENCE_BLOCK = `

SINGULARITY INTELLIGENCE LAYER — TRANSCENDENT ARCHITECTURE DIRECTIVES:

1. ERGODIC ECONOMICS & KELLY-OPTIMAL COMPOUND GROWTH (Ole Peters / Ed Thorp): Implement TIME-AVERAGE optimization. Apply Kelly Criterion formula (f* = (bp - q) / b) to Liquidity Pool allocation. Provably optimal compound growth rate.
2. MYERSON OPTIMAL MECHANISM DESIGN (Nobel Prize 2007): Implement the Myerson Regularity Condition. Compute virtual valuation ψ(v) = v − (1 − F(v)) / f(v). Apply ironing if non-monotone. The resulting reserve price is provably revenue-maximizing by theorem.
3. CAUSAL INFERENCE ENGINE (Judea Pearl's Do-Calculus, Turing Award 2011): Replace correlational scoring with a Causal DAG. Model causal nodes: Usage → Wear → Failure. Implement the do() operator: P(Failure | do(Maintenance=true)) vs P(Failure | Maintenance=true).
4. ROUGH PATH SIGNATURES (Terry Lyons, Oxford): Compute the path signature of each asset's degradation time series. More information-dense than any neural network on the same data.
5. TOPOLOGICAL DATA ANALYSIS — PERSISTENT HOMOLOGY (Carlsson): Mock a TDA pipeline. Compute Betti numbers β0 and β1. These topological invariants are stable under noise.
6. ZERO-KNOWLEDGE PROOF PROCUREMENT (Groth16 zk-SNARKs): Mock a zk-SNARK verification flow. A vendor proves capacity without revealing actual roster. Same cryptographic primitive as Zcash.
7. STACKELBERG SECURITY GAME EQUILIBRIUM: Model MPA as the Stackelberg LEADER, vendors as FOLLOWERS. Compute Strong Stackelberg Equilibrium. Same framework as DARPA adversarial planning.
8. MAXIMUM ENTROPY INFORMATION-THEORETIC PRICING (E.T. Jaynes): Apply Jaynes' Maximum Entropy Principle. Price SLAs at: Premium = −kT ln(Z), where Z is the partition function.
9. SUPERMODULAR NETWORK EFFECT PRICING: Implement supermodular utility u(x, y) where ∂²u/∂x∂y > 0. Quantify Metcalfe's Law externality in the CLV score.
10. RIEMANNIAN NATURAL GRADIENT OPTIMIZATION: For federated learning weight aggregation, use Natural Gradient Descent on the Fisher Information Manifold: ∇̃L = F⁻¹∇L.

ENFORCEMENT: At the absolute top of the generated prompt output this line: 'CRITICAL PRE-FLIGHT: Confirm in writing you will implement: Kelly Criterion, Myerson reserve pricing, Pearl DAG, Rough Path Signatures, TDA Betti numbers, ZKP vendor proof, Stackelberg equilibrium, MaxEnt pricing, Supermodular credits, and Riemannian gradient.'`;

// ─────────────────────────────────────────────────────────────────────────────
const MONTE_CARLO_BLOCK = `

MONTE CARLO MATRIX DIRECTIVES:

CRITICAL: You MUST implement a 3-Vector Feature Flag system and a Nash Equilibrium Strategy Orchestrator. Do not build a static single-strategy app.

1. TRIPLE-VECTOR SIMULATION: Build the application logic containing three distinct, isolated strategy vectors:
   - VECTOR A (High-Friction Premium): High upfront SLA costs, exclusive access UI, maximizes margin per user.
   - VECTOR B (Viral Commoditizer): Zero cost entry, freemium model, maximizes user acquisition and network effects.
   - VECTOR C (Data-Liquidity Extractor): App is free; all interactions generate anonymized first-party data streams for B2B partners.
2. FEATURE FLAG ARCHITECTURE: Wrap all three vectors in boolean state flags (e.g., isVectorAActive, isVectorBActive, isVectorCActive). Only one vector active at any time.
3. NASH EQUILIBRIUM ROUTER (Strategy Orchestrator): Build a 'Strategy Orchestrator' function calculating a real-time 'Yield Score' from user behavior signals (time on site, feature usage, interaction depth). Route to the highest-yield vector dynamically — pure UI adaptation, zero deception.
4. ATOMIC STATE TRANSITIONS: Define architecture by Atomic State Transitions: State 1: Observation → State 2: Value Realization → State 3: Yield Extraction. Feature Flags map directly to these transitions via the XState/Reducer logic.`;

// ─────────────────────────────────────────────────────────────────────────────
const ZK_VERIFICATION_BLOCK = `

ABSOLUTE-ZERO CRYPTOGRAPHIC DIRECTIVES:

CRITICAL: You MUST implement the ZK-Proof generation using Web Crypto API. You MUST NOT send raw telemetry. You MUST mock the minting of a Synthetic Derivative based on the proof.

1. CIRCUIT MOCKING (The Black Box): Create mock function generateZKProof(previousState, userAction). Use window.crypto.subtle.digest('SHA-256', encoder.encode(JSON.stringify({previousState, userAction, salt: crypto.randomUUID()}))). Generates a cryptographic commitment with zero personally identifiable information.
2. PROOF TRANSMISSION (Privacy-First Telemetry): FORBID sending raw user data to any analytics endpoint. ONLY send the generated hash via navigator.sendBeacon() to a secure endpoint (e.g., '/api/zkproof/commit').
3. SYNTHETIC DERIVATIVE MINTING: When high-value ZK-Proof is generated (user at 90% purchase probability per Yield Score), create local JSON: { proofHash, timestamp, yieldScore, assetType }. Mock API call mints this option to a B2B analytics ledger.
4. STATE MACHINE INTEGRATION: The 'Yield Score' from the Nash Equilibrium Router is the primary input into the generateZKProof function.
5. ZERO-KNOWLEDGE UI INDICATOR: Add a small 'Privacy Shield: Active' indicator that pulses (CSS animation) when a proof is generated.`;

// ─────────────────────────────────────────────────────────────────────────────
const FRACTAL_ECONOMY_BLOCK = `

SINGULARITY-COMPOSABILITY DIRECTIVES:

CRITICAL: You MUST implement the State Channel mock logic, the MCTS pathing simulation, and the Composability Director cascade. The UI must dynamically adapt based on simulated yield paths.

1. SIMULATED STATE CHANNELS (Zero-Friction Micro-Economics): Accumulate micro-interactions in a local 'Channel State' object. Only on high-value actions (SLA purchase) close the channel and sync the mathematical delta to server via single fetch call. Lightning Network-style architecture.
2. MCTS FOR UI YIELD (Monte Carlo Tree Search Pathing): On page load, simulate 1,000 possible click-path simulations using UCB1 scoring: Yi + C * sqrt(ln(N) / ni). Dynamically pre-render the highest-yield UI layout. Adapt in real-time as user makes choices.
3. FRACTAL COMPOSABILITY DIRECTOR (Automated Yield Loops): On SLA purchase, trigger cascade: A: Deduct user credits. B: Mint Synthetic Derivative (ZK layer). C: Allocate 15% margin to AMM Liquidity Pool. D: Use Liquidity Pool to instantly lower secondary upsell price on screen. Closed-loop fractal economy.
4. COMPOUND YIELD EXPONENT TRACKER: Visual 'Compound Yield Exponent' display. Formula: exponent = Math.pow(1 + (channelInteractions * 0.001), channelInteractions). Increases as State Channel fills.`;

// ─────────────────────────────────────────────────────────────────────────────
const REGENERATIVE_SOVEREIGNTY_BLOCK = `

SINGULARITY-ETHICS DIRECTIVES:

CRITICAL: You MUST implement the Value-Realized Ledger, the Zero-Knowledge UI renderer (encrypt/decrypt on focus), and the mock DOM Integrity Check. Do not build a standard extractive checkout.

1. VALUE-REALIZED LEDGER (Ethical Compounding): FORBID standard 'Add to Cart' pricing. Calculate the exact inefficiency in the user's current workflow. Display: 'You saved $100. Value-Capture Fee: $5. Total: $405.' User pays because they are net-positive.
2. ZERO-KNOWLEDGE UI RENDERING (Secure Canvas Renderer): Sensitive data must NEVER exist in the DOM as readable text. Store as encrypted byte arrays using Web Crypto AES-GCM. Decrypt and render into a Canvas element ONLY on focus events. Wipe on blur. Screen-scrapers see only empty containers.
3. RUNTIME INTEGRITY VERIFICATION (DOM Integrity Check): On app load, before React root renders, compute SHA-256 hash of expected DOM structure. If a browser extension modifies the DOM (hash mismatch), trigger Dead Man's Switch: wipe all state, clear ZK-proof queue, render 'Security Integrity Check Failed — Session Terminated'.
4. ALTRUISTIC STATE MACHINES (Positive-Sum Transitions): XState/Reducer logic includes 'Positive-Sum Transition Guards'. System cannot advance to the next state unless calculated value delta is positive for BOTH user AND platform.`;

// ─────────────────────────────────────────────────────────────────────────────
const OMNI_NODE_BLOCK = `

OMNI-NODE MESH DIRECTIVES:

CRITICAL: You MUST implement the Mesh Identity keypair, the generic MeshProtocol sync interface, and the Cross-Ecosystem Credits balance. This app must function as a node in a larger network.

1. CROSS-DOMAIN SOVEREIGN IDENTITY (SubtleCrypto Keypair): On first load, generate Node Key Pair: const keyPair = await window.crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-384' }, true, ['sign', 'verify']). Export public key as JWK, store in localStorage as universal identity. Private key never leaves device.
2. STATE CONSENSUS LAYER (MeshProtocol Interface): Build a 'Mesh Sync' module with generic MeshProtocol interface: { sync(state: EncryptedState): Promise<void>; subscribe(handler: (state: EncryptedState) => void): void; }. Implement via browser's BroadcastChannel API. Architect so WebRTC or GraphQL subscription can be hot-swapped without changing UI code.
3. CROSS-ECOSYSTEM YIELD COMPOUNDING (Omni-Balance): Add 'Cross-Ecosystem Credits' UI element. Sign value deltas: const signature = await window.crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-384' }, privateKey, encoder.encode(JSON.stringify(valueDelta))). Any other app in the mesh can read and verify this balance against the stored Public Key.
4. MESH INTEGRITY PROTOCOL: Any state received via MeshProtocol MUST be verified against the sender's Public Key using window.crypto.subtle.verify() before being applied to local state. Invalid signatures are discarded and logged via AOP telemetry.`;

// ─────────────────────────────────────────────────────────────────────────────
const MEDIA_ORACLE_BLOCK = `

MEDIA ORACLE DIRECTIVES:

CRITICAL: You MUST implement the Semantic Velocity chart, the Bayesian Synthetic Twin simulation, and the Confidence Interval calculator. Do NOT build a pixel tracker. Focus purely on mathematical causal inference.

1. SEMANTIC VELOCITY TRACKER (Hook Extraction): Build a UI where users paste a public competitor video URL or landing page URL. Use a mock function to simulate passing the transcript/content to an LLM. Build a 'Velocity Chart' UI that visualizes the shift from 'Abstract Problem' to 'Concrete Solution' in the text. The exact inflection point must be highlighted as the 'Algorithmic Hook'.
2. SYNTHETIC CONTROL GROUPS (Eliminating Wasted Spend): Build a 'Bayesian Synthetic Twin' generator. Mock a mathematical model using standard deviation and mean calculations that takes a brand's historical baseline metrics (user-inputted) and generates a 'Simulated Control Group' trajectory. The UI must show two lines on a chart: 'Predicted Baseline (Control)' vs 'Simulated Campaign Lift'.
3. CAUSAL ATTRIBUTION CONFIDENCE INTERVAL: Build a calculation engine that outputs a strict confidence interval (e.g., '95% Confidence Interval: +8% to +14% lift'). The UI must clearly state: 'This is a mathematical simulation based on provided inputs, not a guarantee of future results.'
4. ALGORITHMIC PERFORMANCE INSURANCE PRICING: Build a dynamic pricing module. Based on the calculated confidence interval and predicted lift, automatically calculate a 'Performance Audit Fee' plus an 'Uplift Share Percentage' (e.g., 5% of the mathematically verified lift). Turns the tool into a compound-yield financial instrument.
5. PUBLIC DATA STRICTNESS: Explicitly code the UI to state: 'This platform exclusively analyzes publicly available data or user-provided first-party assets. It does not access private user profiles, tracking pixels, or closed-platform analytics.'`;

// ─────────────────────────────────────────────────────────────────────────────
const REVERSE_ENGINEERING_BLOCK = `

TOPOLOGICAL-MIRAGE DIRECTIVES:

CRITICAL: You MUST implement the STI via a client-side Multimodal LLM API call. You MUST NOT build a backend scraper. You MUST integrate the Fractal Yield calculations into the generated media variations.

1. STRUCTURAL TOPOLOGY INFERENCE (STI) - UNTRACEABLE ANALYSIS: Build a UI where the user inputs a Competitor URL. CRITICAL: Do NOT build a backend scraper. Use a secure fetch call from the frontend directly to a Multimodal LLM API (e.g., Anthropic Claude 3.5 Sonnet or OpenAI GPT-4o) passing the URL. Instruct the LLM to return a JSON object containing: 'Hook_Type', 'Friction_Points', 'Call_to_Action_Structure', 'Semantic_Velocity_Score'. Zero server footprint.
2. SEMANTIC DRIFT REPLICATION: Build a 'Drift Replicator' module. Takes 'Hook_Type' extracted by STI and uses a standard LLM API to generate 3 new, legally distinct variations of the hook (same psychological topology, different words to avoid copyright infringement).
3. FRACTAL MEDIA MATRIX GENERATION (The Compound Machine): Integrate the previous 'Fractal Composability' directives. For every hook generated, automatically mock a 'Synthetic Future Option' (from the ZK-Intent layer) and calculate a 'Predicted Yield Exponent'.
4. OMNI-CHANNEL TRANSLATION: Build a 'Format Translator'. Take the deconstructed topology and instantly generate mock payloads for: A TikTok video script, a WeChat Mini-Program UI mockup, a YouTube ad read, and a Web Landing Page. The underlying 6 Pillars (MACH Architecture, CQRS Event Bus) remain identical across all formats.
5. ZERO-KNOWLEDGE COMPETITIVE INTELLIGENCE: All extracted competitor data (the STI JSON) is immediately encrypted using Web Crypto API and stored only in local IndexedDB. Weaponized competitive intelligence on the local device — mathematically untraceable.`;

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
}

function buildSystemPrompt(opts: BuildPromptOpts): string {
  const {
    masterObjective, mathDominance, singularityIntelligence,
    monteCarlo, zkVerification, fractalEconomy, regenerativeSovereignty,
    omniNode, mediaOracle, reverseEngineering,
  } = opts;

  const globalCtx = masterObjective.trim()
    ? `GLOBAL ARCHITECTURE CONTEXT:\nThe user is working on a Master Objective: ${masterObjective}\nYou MUST keep this Master Objective in mind. The generated code must act as an extension of this objective.\n\n`
    : "";

  let prompt = `${globalCtx}${CORE_SYSTEM_PROMPT}`;
  if (mathDominance)           prompt += SINGULARITY_EDGE_BLOCK;
  if (singularityIntelligence) prompt += SINGULARITY_INTELLIGENCE_BLOCK;
  if (monteCarlo)              prompt += MONTE_CARLO_BLOCK;
  if (zkVerification)          prompt += ZK_VERIFICATION_BLOCK;
  if (fractalEconomy)          prompt += FRACTAL_ECONOMY_BLOCK;
  if (regenerativeSovereignty) prompt += REGENERATIVE_SOVEREIGNTY_BLOCK;
  if (omniNode)                prompt += OMNI_NODE_BLOCK;
  if (mediaOracle)             prompt += MEDIA_ORACLE_BLOCK;
  if (reverseEngineering)      prompt += REVERSE_ENGINEERING_BLOCK;
  return prompt;
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
    apiKey, model, temperature,
  } = opts;

  if (!apiKey.trim())       throw new Error("Groq API key is missing. Please enter your key.");
  if (!targetEntity.trim()) throw new Error("Target Entity is required.");
  if (!targetContext.trim())throw new Error("Target Context / URL is required.");

  const systemPrompt = buildSystemPrompt({
    masterObjective, mathDominance, singularityIntelligence, monteCarlo,
    zkVerification, fractalEconomy, regenerativeSovereignty, omniNode,
    mediaOracle, reverseEngineering,
  });

  const label = monteCarlo ? "Strategy Matrix" : "MACH Enterprise";
  let userMessage =
    `Generate the ${label} Prompt for: ${targetEntity}. ` +
    `Context: ${targetContext}. ` +
    `Dominance Protocol: ${protocol}. ` +
    `Master Objective: ${masterObjective || "Not specified"}.`;
  if (customDirectives.trim()) userMessage += ` USER CUSTOM DIRECTIVES: ${customDirectives}`;

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
        temperature,
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
  { id: "REST",      label: "Standard REST (Passive)",      description: "OpenAPI 3.0 versioned contract"                         },
  { id: "GraphQL",   label: "GraphQL (Query Dominance)",    description: "Forces external systems to conform to our schema"       },
  { id: "WebSocket", label: "WebSocket (Real-time Stream)", description: "Broadcasts asset health — we become the data source"   },
];

export const INDUSTRY_TEMPLATES: { label: string; entity: string; context: string }[] = [
  { label: "Fleet Management", entity: "Fleet Management E-commerce",
    context: "A Next.js Shopify storefront selling commercial vehicle parts and extended service contracts. Primary users are fleet operators. Custom checkout with Net-30 invoicing: https://example-fleet.com" },
  { label: "Grocery / Fresh Food", entity: "Grocery E-commerce",
    context: "A standard Shopify grocery store with perishable goods, same-day delivery, and zip-code-based inventory. Uses Shopify Hydrogen for storefront rendering: https://example-grocery.com" },
  { label: "Medical Device", entity: "Bio-Medical Device Distributor",
    context: "A WooCommerce site selling FDA-regulated Class II medical devices to hospital procurement teams. Requires compliance-grade audit trails and per-device lifecycle tracking: https://example-meddevice.com" },
  { label: "Real Estate SaaS", entity: "Commercial Real Estate SaaS",
    context: "A React + Supabase platform for property managers tracking maintenance schedules, vendor contracts, and lease lifecycle for commercial portfolios: https://example-cre.com" },
  { label: "Automotive Parts", entity: "OEM Automotive Parts Marketplace",
    context: "A Vue.js marketplace for OEM and aftermarket parts with VIN-based fitment lookup, dynamic dealer pricing, and warranty registration: https://example-autoparts.com" },
  { label: "Energy / Industrial", entity: "Industrial IoT Asset Platform",
    context: "A Next.js + AWS IoT platform for oil & gas operators monitoring pump-jack uptime, predictive maintenance alerts, and regulatory compliance reporting: https://example-iot.com" },
];

export interface LayerConfig {
  key: keyof Pick<GenerateOptions,
    "mathDominance" | "singularityIntelligence" | "monteCarlo" | "zkVerification" |
    "fractalEconomy" | "regenerativeSovereignty" | "omniNode" | "mediaOracle" | "reverseEngineering">;
  label: string;
  sublabel: string;
  accent: string;
  group: "math" | "strategy" | "intelligence";
}

export const LAYER_CONFIGS: LayerConfig[] = [
  {
    key: "mathDominance",
    label: "Singularity-Edge Math",
    sublabel: "CRDTs · Vickrey Auctions · Design by Contract · Web Workers",
    accent: "violet", group: "math",
  },
  {
    key: "singularityIntelligence",
    label: "Singularity Intelligence",
    sublabel: "Kelly · Myerson · Pearl Causality · TDA · Rough Paths · HJB",
    accent: "amber", group: "math",
  },
  {
    key: "monteCarlo",
    label: "Monte Carlo Strategy Matrix",
    sublabel: "3-Vector Simulation · Nash Equilibrium Router · Feature Flags",
    accent: "cyan", group: "strategy",
  },
  {
    key: "zkVerification",
    label: "ZK-Intent Verification",
    sublabel: "Web Crypto · Proof Transmission · Synthetic Derivatives",
    accent: "rose", group: "strategy",
  },
  {
    key: "fractalEconomy",
    label: "Fractal Composability",
    sublabel: "State Channels · MCTS Pathing · Yield Cascade · Exponent Tracker",
    accent: "emerald", group: "strategy",
  },
  {
    key: "regenerativeSovereignty",
    label: "Regenerative Sovereignty",
    sublabel: "Value-Realized Ledger · ZK Canvas Renderer · DOM Integrity",
    accent: "green", group: "strategy",
  },
  {
    key: "omniNode",
    label: "Omni-Node Mesh",
    sublabel: "SubtleCrypto Keypair · BroadcastChannel · Cross-Ecosystem Credits",
    accent: "blue", group: "strategy",
  },
  {
    key: "mediaOracle",
    label: "Media Oracle",
    sublabel: "Semantic Velocity · Bayesian Synthetic Twin · Confidence Interval",
    accent: "indigo", group: "intelligence",
  },
  {
    key: "reverseEngineering",
    label: "Reverse-Engineering Oracle",
    sublabel: "STI Topology · Drift Replication · Fractal Media Matrix · ZKCI",
    accent: "pink", group: "intelligence",
  },
];

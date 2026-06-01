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
4. ZERO-TRUST CLIENT VALIDATION: Every mutation requires a fresh, silent JWT re-validation. More secure than standard bank apps.
5. ASPECT-ORIENTED PROGRAMMING (AOP): Wrap all fetch calls and state transitions in a Cross-Cutting Concern wrapper for telemetry, error boundary triggering, and performance logging.
6. ARCHITECTURAL DNA WATERMARKING: Embed a deterministic SHA-256 hash of the module configuration as a data-attribute on the Web Component root for IP protection.

OUTPUT: Return ONLY the raw text prompt for MPD. No markdown. No code blocks.`;

// ─────────────────────────────────────────────────────────────────────────────
const SINGULARITY_EDGE_BLOCK = `

SINGULARITY-EDGE MATHEMATICAL DIRECTIVES:

CRITICAL: You MUST implement the CRDT mock structure and the Vickrey Auction logic. You MUST use Web Workers for heavy math. Do not use simple if/else pricing.

1. EDGE-NATIVE CRDTs (Infinite Scale, Zero Backend): Implement a mock CRDT (Conflict-free Replicated Data Type) state structure (e.g., a Yjs/Automerge mock) for Asset Lifecycle data. Merges data from multiple tabs, devices, or offline states with zero conflicts — no central database required.
2. COMBINATORIAL VICKREY AUCTIONS: The Forward Lifecycle SLA is not a static price. User inputs 'Need Date' and 'Risk Tolerance'. System calculates a transparent 'Shadow Bid' based on algorithmic scarcity, charging the market-clearing price. Incentive-compatible by mechanism design.
3. DESIGN BY CONTRACT (Formal Verification): Wrap ALL financial and SLA logic in Design by Contract. Precondition: 'User must have sufficient credits.' Postcondition: 'System margin MUST be > 15%.' Assertions crash the transaction (not the app) on failure.
4. WEB WORKER MULTI-AGENT PARALLELISM: Spawn a dedicated Web Worker for CRDT merging and Vickrey calculations. Main UI thread is never blocked. App performs like a native desktop application.
5. AOP CONTINUITY: Maintain the Cross-Cutting Concern wrapper for all core functions.`;

// ─────────────────────────────────────────────────────────────────────────────
const SINGULARITY_INTELLIGENCE_BLOCK = `

SINGULARITY INTELLIGENCE LAYER — TRANSCENDENT ARCHITECTURE DIRECTIVES:

1. ERGODIC ECONOMICS & KELLY-OPTIMAL COMPOUND GROWTH (Ole Peters / Ed Thorp): Implement TIME-AVERAGE optimization. Apply Kelly Criterion formula (f* = (bp - q) / b) to Liquidity Pool allocation. Provably optimal compound growth rate — mathematically superior to expected-utility theory used by every bank.
2. MYERSON OPTIMAL MECHANISM DESIGN (Nobel Prize 2007): Implement the Myerson Regularity Condition. Compute virtual valuation ψ(v) = v − (1 − F(v)) / f(v). Apply ironing if non-monotone. The resulting reserve price is the provably revenue-maximizing price by theorem.
3. CAUSAL INFERENCE ENGINE (Judea Pearl's Do-Calculus, Turing Award 2011): Replace correlational scoring with a Causal DAG. Model causal nodes: Usage → Wear → Failure. Implement the do() operator: P(Failure | do(Maintenance=true)) vs P(Failure | Maintenance=true). Causation, not correlation.
4. ROUGH PATH SIGNATURES (Terry Lyons, Oxford): Compute the path signature of each asset's degradation time series — the collection of all iterated integrals. Two assets with identical means but different signatures have different failure predictions. More information-dense than any neural network on the same data.
5. TOPOLOGICAL DATA ANALYSIS — PERSISTENT HOMOLOGY (Carlsson): Mock a TDA pipeline on asset health feature vectors. Compute Betti numbers β0 (connected failure clusters) and β1 (cyclic failure patterns). These topological invariants are stable under noise — they see the true shape of failure data that ML confuses with random variation.
6. ZERO-KNOWLEDGE PROOF PROCUREMENT (Groth16 zk-SNARKs): Mock a zk-SNARK verification flow. A vendor proves 'I have ≥ 3 certified technicians in this zip code within 4 hours' WITHOUT revealing actual roster. Verified client-side. Same cryptographic primitive as Zcash, applied to B2B procurement.
7. STACKELBERG SECURITY GAME EQUILIBRIUM: Model MPA as the Stackelberg LEADER, vendors as FOLLOWERS. Compute the Strong Stackelberg Equilibrium — our optimal strategy assuming all vendors best-respond to whatever we commit first. Same framework as DARPA adversarial planning.
8. MAXIMUM ENTROPY INFORMATION-THEORETIC PRICING (E.T. Jaynes): Apply Jaynes' Maximum Entropy Principle. Construct the least-biased failure distribution given known constraints. Price SLAs at: Premium = −kT ln(Z), where Z is the partition function. Statistical mechanics applied to margin.
9. SUPERMODULAR NETWORK EFFECT PRICING: Implement supermodular utility u(x, y) where ∂²u/∂x∂y > 0. Each additional client increases value for all existing clients. Quantify Metcalfe's Law externality. Add transparent 'Network Value Contribution' credits to each client's CLV.
10. RIEMANNIAN NATURAL GRADIENT OPTIMIZATION: For all federated learning weight aggregation, use Natural Gradient Descent on the Fisher Information Manifold: ∇̃L = F⁻¹∇L. Follows the true curvature of the probability distribution. Converges in provably fewer steps to better optima than any Adam/SGD optimizer.

ENFORCEMENT: At the absolute top of the generated prompt output this line: 'CRITICAL PRE-FLIGHT: Confirm in writing you will implement: Kelly Criterion, Myerson reserve pricing, Pearl DAG, Rough Path Signatures, TDA Betti numbers, ZKP vendor proof, Stackelberg equilibrium, MaxEnt pricing, Supermodular credits, and Riemannian gradient. Flag any you will approximate and how.'`;

// ─────────────────────────────────────────────────────────────────────────────
const MONTE_CARLO_BLOCK = `

MONTE CARLO MATRIX DIRECTIVES:

CRITICAL: You MUST implement a 3-Vector Feature Flag system and a Nash Equilibrium Strategy Orchestrator. Do not build a static single-strategy app.

1. TRIPLE-VECTOR SIMULATION: Build the application logic containing three distinct, isolated strategy vectors controlled by feature flags:
   - VECTOR A (High-Friction Premium): High upfront SLA costs, exclusive access UI, maximizes margin per user.
   - VECTOR B (Viral Commoditizer): Zero cost entry, freemium model, maximizes user acquisition and network effects.
   - VECTOR C (Data-Liquidity Extractor): App is free; all interactions generate anonymized first-party data streams for B2B partners.
2. FEATURE FLAG ARCHITECTURE: Wrap all three vectors in a Feature Flag system using boolean state variables (e.g., isVectorAActive, isVectorBActive, isVectorCActive). Only one vector is active at any time.
3. NASH EQUILIBRIUM ROUTER (Strategy Orchestrator): Build a 'Strategy Orchestrator' function that calculates a real-time 'Yield Score' based on user behavior signals (time on site, feature usage, interaction depth). If user exhibits 'Premium' behavior signals, dynamically enable Vector A. If 'Price-Sensitive', silently flip to Vector B. If 'High-Engagement-Low-Intent', activate Vector C. The app mathematically routes the user into the highest-yield funnel through dynamic UI adaptation — no deception, pure optimization.
4. ATOMIC STATE TRANSITIONS: Define the app's architecture not by pages, but by Atomic State Transitions: State 1: Observation → State 2: Value Realization → State 3: Yield Extraction. Feature Flags must map directly to these state transitions via the XState/Reducer logic.`;

// ─────────────────────────────────────────────────────────────────────────────
const ZK_VERIFICATION_BLOCK = `

ABSOLUTE-ZERO CRYPTOGRAPHIC DIRECTIVES:

CRITICAL: You MUST implement the ZK-Proof generation using Web Crypto API. You MUST NOT send raw telemetry. You MUST mock the minting of a Synthetic Derivative based on the proof.

1. CIRCUIT MOCKING (The Black Box): Create a mock function named generateZKProof(previousState, userAction). In production this would be a full ZK-SNARK circuit. For now, use the Web Crypto API: window.crypto.subtle.digest('SHA-256', encoder.encode(JSON.stringify({previousState, userAction, salt: crypto.randomUUID()}))). This generates a cryptographic commitment to the user's action without exposing the raw data.
2. PROOF TRANSMISSION (Privacy-First Telemetry): FORBID sending raw user data (names, emails, specific actions) to any analytics endpoint. ONLY send the generated hash (the ZK-Proof) via navigator.sendBeacon() to a secure endpoint (e.g., '/api/zkproof/commit'). The server receives a mathematical commitment with zero personally identifiable information.
3. SYNTHETIC DERIVATIVE MINTING: When a high-value ZK-Proof is generated locally (e.g., 'User reached 90% purchase probability' per the Yield Score), automatically create a local JSON object representing a 'Synthetic Forward Option': { proofHash, timestamp, yieldScore, assetType }. Add a mock API call that 'Mints' this option to a theoretical B2B analytics ledger. User intent becomes a first-party data asset without exposing the user.
4. STATE MACHINE INTEGRATION: The 'Yield Score' calculated by the Nash Equilibrium Router (or standard CLV if Monte Carlo is not active) must be the primary input into the generateZKProof function. ZK logic integrates seamlessly with the XState/Reducer.
5. ZERO-KNOWLEDGE UI INDICATOR: Add a small 'Privacy Shield: Active' indicator in the UI that pulses (CSS animation) when a proof is generated, communicating the premium, ultra-secure nature of the application.`;

// ─────────────────────────────────────────────────────────────────────────────
const FRACTAL_ECONOMY_BLOCK = `

SINGULARITY-COMPOSABILITY DIRECTIVES:

CRITICAL: You MUST implement the State Channel mock logic, the MCTS pathing simulation, and the Composability Director cascade. The UI must dynamically adapt based on simulated yield paths.

1. SIMULATED STATE CHANNELS (Zero-Friction Micro-Economics): Build a mock 'State Channel' manager. Accumulate micro-interactions (hover events, tooltip reads, scroll depth) in a local 'Channel State' object — do NOT fire server API calls for each. Only when a high-value action occurs (SLA purchase) does the app 'Close the Channel' and sync the final mathematical delta to the server via a single fetch call. This simulates zero-fee, infinite-volume transactional capacity with a Lightning Network-style architecture.
2. MCTS FOR UI YIELD (Monte Carlo Tree Search Pathing): On page load, implement a simplified MCTS simulation. Generate 1,000 possible click-path simulations using a lightweight random playout function. Calculate 'Yield Probability' for each path using UCB1 scoring: Yi + C * sqrt(ln(N) / ni). Dynamically pre-render the UI layout that guides the user down the highest-yield mathematical path. Adapt in real-time as the user makes choices, re-running the MCTS subtree from the current node.
3. FRACTAL COMPOSABILITY DIRECTOR (Automated Yield Loops): When a user purchases an Asset Lifecycle SLA, the Composability Director automatically triggers a cascade: Function A: Deduct user credits from Tokenized Ledger. Function B: Mint the Synthetic Derivative (ZK-Intent layer). Function C: Allocate 15% of margin to the AMM Liquidity Pool state. Function D: Use the updated Liquidity Pool to instantly lower the price of a secondary upsell item on screen. Creates a closed-loop fractal economy where each transaction automatically funds its own yield optimization.
4. COMPOUND YIELD EXPONENT TRACKER: Add a visual 'Compound Yield Exponent' display in the UI. As the State Channel fills with interactions, this number exponentially increases (1.01x → 1.05x → 1.12x), demonstrating the compounding value of the user's engagement before they spend money. Formula: exponent = Math.pow(1 + (channelInteractions * 0.001), channelInteractions).`;

// ─────────────────────────────────────────────────────────────────────────────
const REGENERATIVE_SOVEREIGNTY_BLOCK = `

SINGULARITY-ETHICS DIRECTIVES:

CRITICAL: You MUST implement the Value-Realized Ledger, the Zero-Knowledge UI renderer (encrypt/decrypt on focus), and the mock DOM Integrity Check. Do not build a standard extractive checkout.

1. VALUE-REALIZED LEDGER (Ethical Compounding): FORBID standard 'Add to Cart' pricing. Build a 'Value-Realized Ledger'. Calculate the exact inefficiency in the user's current workflow (e.g., 'Standard supply chain cost: $500. Optimized cost via our State Channel: $400'). Display: 'You saved $100. Value-Capture Fee: $5. Total: $405.' The user pays because they are net-positive. This creates legally unassailable compound growth through viral adoption driven by genuine value delivery.
2. ZERO-KNOWLEDGE UI RENDERING (Secure Canvas Renderer): Sensitive data (prices, vendor names, logic states) must NEVER exist in the DOM as readable text. Store them as encrypted byte arrays in state (using Web Crypto AES-GCM with a session key). Decrypt and render directly into a Canvas element ONLY on focus events. On blur events, wipe the Canvas and return data to the encrypted array in state. Screen-scrapers and DOM-inspection tools see only empty containers.
3. RUNTIME INTEGRITY VERIFICATION (DOM Integrity Check): On app load, before the React root renders, compute a SHA-256 hash of the initial expected DOM structure. Store this as the 'Known Good State'. After rendering, recompute the hash. If any browser extension or injected script has modified the DOM (hash mismatch), instantly trigger the Dead Man's Switch: wipe all state, clear the ZK-proof queue, and render a 'Security Integrity Check Failed — Session Terminated' screen. The app refuses to operate in a compromised environment.
4. ALTRUISTIC STATE MACHINES (Positive-Sum Transitions): Ensure the XState/Reducer logic includes 'Positive-Sum Transition Guards'. The system cannot advance to the next state unless the calculated value delta is positive for BOTH the user AND the platform. State transition is blocked if either party's value decreases. Mathematically enforces ethical commerce.`;

// ─────────────────────────────────────────────────────────────────────────────
const OMNI_NODE_BLOCK = `

OMNI-NODE MESH DIRECTIVES:

CRITICAL: You MUST implement the Mesh Identity keypair, the generic MeshProtocol sync interface, and the Cross-Ecosystem Credits balance. This app must function as a node in a larger network.

1. CROSS-DOMAIN SOVEREIGN IDENTITY (SubtleCrypto Keypair): Implement a mock 'Mesh Identity Provider'. On first load, generate a universal Node Key Pair using Web Crypto API: const keyPair = await window.crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-384' }, true, ['sign', 'verify']). Export the public key as a JWK and store it in localStorage as the user's persistent universal identity across all apps in the mesh. The private key never leaves the device.
2. STATE CONSENSUS LAYER (MeshProtocol Interface): Build a 'Mesh Sync' module with a generic MeshProtocol interface: { sync(state: EncryptedState): Promise<void>; subscribe(handler: (state: EncryptedState) => void): void; }. Implement this interface using the browser's BroadcastChannel API for same-device cross-tab sync immediately. Architect the abstraction so a real WebRTC data channel or GraphQL subscription can be hot-swapped as the implementation without changing any UI code.
3. CROSS-ECOSYSTEM YIELD COMPOUNDING (Omni-Balance): Add a UI element labeled 'Cross-Ecosystem Credits'. When the user generates value via the Value-Realized Ledger, sign the delta with their Private Key: const signature = await window.crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-384' }, privateKey, encoder.encode(JSON.stringify(valueDelta))). Add the signed value delta to the user's 'Omni-Balance' in localStorage. Any other app in the mesh can read and verify this balance against the stored Public Key, enabling seamless cross-platform premium upgrades with no central login server.
4. MESH INTEGRITY PROTOCOL: Extend the DOM Integrity Verification. Any state received via the MeshProtocol MUST be verified against the sender's stored Public Key using window.crypto.subtle.verify() before being applied to local state. If the signature is invalid, discard the state and log a mesh integrity violation event via the AOP telemetry wrapper. The network is mathematically immune to injected fake data from compromised nodes.`;

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
}

function buildSystemPrompt(opts: BuildPromptOpts): string {
  const {
    masterObjective,
    mathDominance,
    singularityIntelligence,
    monteCarlo,
    zkVerification,
    fractalEconomy,
    regenerativeSovereignty,
    omniNode,
  } = opts;

  const globalCtx = masterObjective.trim()
    ? `GLOBAL ARCHITECTURE CONTEXT:
The user is working on a Master Objective: ${masterObjective}
You MUST keep this Master Objective in mind. The generated code must act as an extension of this objective. If the user is building a tool (like a website builder), bake this objective into the core logic of the generated code.

`
    : "";

  let prompt = `${globalCtx}${CORE_SYSTEM_PROMPT}`;
  if (mathDominance)           prompt += SINGULARITY_EDGE_BLOCK;
  if (singularityIntelligence) prompt += SINGULARITY_INTELLIGENCE_BLOCK;
  if (monteCarlo)              prompt += MONTE_CARLO_BLOCK;
  if (zkVerification)          prompt += ZK_VERIFICATION_BLOCK;
  if (fractalEconomy)          prompt += FRACTAL_ECONOMY_BLOCK;
  if (regenerativeSovereignty) prompt += REGENERATIVE_SOVEREIGNTY_BLOCK;
  if (omniNode)                prompt += OMNI_NODE_BLOCK;
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
  // Layer toggles
  mathDominance: boolean;
  singularityIntelligence: boolean;
  monteCarlo: boolean;
  zkVerification: boolean;
  fractalEconomy: boolean;
  regenerativeSovereignty: boolean;
  omniNode: boolean;
  // Groq config
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
    targetEntity,
    targetContext,
    masterObjective,
    customDirectives,
    protocol,
    mathDominance,
    singularityIntelligence,
    monteCarlo,
    zkVerification,
    fractalEconomy,
    regenerativeSovereignty,
    omniNode,
    apiKey,
    model,
    temperature,
  } = opts;

  if (!apiKey.trim()) throw new Error("Groq API key is missing. Please enter your key.");
  if (!targetEntity.trim()) throw new Error("Target Entity is required.");
  if (!targetContext.trim()) throw new Error("Target Context / URL is required.");

  const systemPrompt = buildSystemPrompt({
    masterObjective,
    mathDominance,
    singularityIntelligence,
    monteCarlo,
    zkVerification,
    fractalEconomy,
    regenerativeSovereignty,
    omniNode,
  });

  const buttonLabel = monteCarlo ? "Strategy Matrix" : "MACH Enterprise";
  let userMessage =
    `Generate the ${buttonLabel} Prompt for: ${targetEntity}. ` +
    `Context: ${targetContext}. ` +
    `Dominance Protocol: ${protocol}. ` +
    `Master Objective: ${masterObjective || "Not specified"}.`;

  if (customDirectives.trim()) {
    userMessage += ` USER CUSTOM DIRECTIVES: ${customDirectives}`;
  }

  const t0 = Date.now();

  let res: Response;
  try {
    res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
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

  const prompt = data.choices?.[0]?.message?.content ?? "";
  const tokensUsed = data.usage?.total_tokens ?? 0;
  const durationMs = Date.now() - t0;

  return { prompt, model, tokensUsed, durationMs };
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC CONFIGURATION EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const GROQ_MODELS: { id: string; label: string; speed: string }[] = [
  { id: "llama3-70b-8192",    label: "LLaMA 3 70B",  speed: "Powerful"  },
  { id: "llama3-8b-8192",     label: "LLaMA 3 8B",   speed: "Fastest"   },
  { id: "mixtral-8x7b-32768", label: "Mixtral 8×7B", speed: "Balanced"  },
  { id: "gemma2-9b-it",       label: "Gemma 2 9B",   speed: "Efficient" },
];

export const DOMINANCE_PROTOCOLS: { id: string; label: string; description: string }[] = [
  { id: "REST",      label: "Standard REST (Passive)",       description: "OpenAPI 3.0 versioned contract"                            },
  { id: "GraphQL",   label: "GraphQL (Query Dominance)",     description: "Forces external systems to conform to our schema"          },
  { id: "WebSocket", label: "WebSocket (Real-time Stream)",  description: "Broadcasts asset health — we become the data source"      },
];

export const INDUSTRY_TEMPLATES: { label: string; entity: string; context: string }[] = [
  {
    label: "Fleet Management",
    entity: "Fleet Management E-commerce",
    context: "A Next.js Shopify storefront selling commercial vehicle parts and extended service contracts. Primary users are fleet operators. Custom checkout with Net-30 invoicing: https://example-fleet.com",
  },
  {
    label: "Grocery / Fresh Food",
    entity: "Grocery E-commerce",
    context: "A standard Shopify grocery store with perishable goods, same-day delivery, and zip-code-based inventory. Uses Shopify Hydrogen for storefront rendering: https://example-grocery.com",
  },
  {
    label: "Medical Device",
    entity: "Bio-Medical Device Distributor",
    context: "A WooCommerce site selling FDA-regulated Class II medical devices to hospital procurement teams. Requires compliance-grade audit trails and per-device lifecycle tracking: https://example-meddevice.com",
  },
  {
    label: "Real Estate SaaS",
    entity: "Commercial Real Estate SaaS",
    context: "A React + Supabase platform for property managers tracking maintenance schedules, vendor contracts, and lease lifecycle for commercial portfolios: https://example-cre.com",
  },
  {
    label: "Automotive Parts",
    entity: "OEM Automotive Parts Marketplace",
    context: "A Vue.js marketplace for OEM and aftermarket parts with VIN-based fitment lookup, dynamic dealer pricing, and warranty registration: https://example-autoparts.com",
  },
  {
    label: "Energy / Industrial",
    entity: "Industrial IoT Asset Platform",
    context: "A Next.js + AWS IoT platform for oil & gas operators monitoring pump-jack uptime, predictive maintenance alerts, and regulatory compliance reporting: https://example-iot.com",
  },
];

export interface LayerConfig {
  key: keyof Pick<GenerateOptions,
    "mathDominance" | "singularityIntelligence" | "monteCarlo" |
    "zkVerification" | "fractalEconomy" | "regenerativeSovereignty" | "omniNode">;
  label: string;
  sublabel: string;
  accent: "green" | "violet" | "amber" | "cyan" | "rose" | "emerald" | "blue";
  group: "math" | "strategy";
}

export const LAYER_CONFIGS: LayerConfig[] = [
  {
    key: "mathDominance",
    label: "Singularity-Edge Math",
    sublabel: "CRDTs · Vickrey Auctions · Design by Contract · Web Workers",
    accent: "violet",
    group: "math",
  },
  {
    key: "singularityIntelligence",
    label: "Singularity Intelligence",
    sublabel: "Kelly / Myerson / Pearl Causality / ZKP / TDA / Rough Paths / HJB",
    accent: "amber",
    group: "math",
  },
  {
    key: "monteCarlo",
    label: "Monte Carlo Strategy Matrix",
    sublabel: "3-Vector Simulation · Nash Equilibrium Router · Feature Flags",
    accent: "cyan",
    group: "strategy",
  },
  {
    key: "zkVerification",
    label: "ZK-Intent Verification",
    sublabel: "Web Crypto · Proof Transmission · Synthetic Derivatives",
    accent: "rose",
    group: "strategy",
  },
  {
    key: "fractalEconomy",
    label: "Fractal Composability",
    sublabel: "State Channels · MCTS Pathing · Yield Cascade · Exponent Tracker",
    accent: "emerald",
    group: "strategy",
  },
  {
    key: "regenerativeSovereignty",
    label: "Regenerative Sovereignty",
    sublabel: "Value-Realized Ledger · ZK Canvas Renderer · DOM Integrity",
    accent: "green",
    group: "strategy",
  },
  {
    key: "omniNode",
    label: "Omni-Node Mesh",
    sublabel: "SubtleCrypto Keypair · BroadcastChannel · Cross-Ecosystem Credits",
    accent: "blue",
    group: "strategy",
  },
];

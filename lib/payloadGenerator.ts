// ─────────────────────────────────────────────────────────────────────────────
// PROMPT BLOCKS
// Each block is a discrete, composable instruction layer injected into the
// Groq system prompt when its corresponding toggle is active.
// ─────────────────────────────────────────────────────────────────────────────

const CORE_SYSTEM_PROMPT = `You are a Master Systems Architect and Principal Cloud Architect generating a prompt for an AI coder (MPD). The user will provide a Target Entity, URL/Context, and Dominance Protocol. Generate a prompt that instructs MPD to build a 'MACH-Compliant Asset Lifecycle Module' using the specified protocol. Use ONLY standard enterprise terminology.

CRITICAL: You MUST use State Machine logic for all UI flows. You MUST implement the AMM pricing logic. Do not use simple useState for business rules.

CORE ARCHITECTURE RULES FOR THE MPD PROMPT:
1. TARGET ANALYSIS: The first line MUST be: 'Analyze the architecture of this specific website: [INSERT URL/CONTEXT HERE].'
2. FRAMEWORK-AGNOSTIC INJECTION (Shadow DOM): Instruct MPD to build the module using standard HTML Web Components (Custom Elements and Shadow DOM). This ensures the module injects perfectly into React, Vue, Angular, or plain HTML without CSS conflicts or state leaks.
3. EVENT-DRIVEN CQRS & WEBHOOKS: Inside the Shadow DOM, instruct MPD to implement a strict Pub/Sub Event Bus. Create emitters for: 'ASSET_HEALTH_CALCULATED', 'VENDOR_RTB_RESOLVED', 'SLA_PURCHASED'. Instruct MPD to expose a standard window.dispatchWebhook() function so the host website's native backend can listen to our module's events.
4. TAILORED PILLAR TRANSLATION (Advanced Enterprise):
   - Predictive Maintenance: Calculate asset degradation based on explicit user inputs via a sleek, opt-in dashboard widget inside the Shadow DOM.
   - Dynamic RTB Engine: Display a transparent, real-time comparison of verified service providers.
   - Forward Lifecycle SLAs: Display an optional, transparent 'Predictive SLA' at checkout.
   - Tokenized Ledger Interface: Mock a 'Lifecycle Credits' wallet state within the module that updates when SLAs are purchased.
5. FEDERATED LEARNING TELEMETRY (Privacy-by-Design): Instruct MPD to mock a Federated Learning data pipeline. Only send model weight updates via a secure fetch call. GDPR/CCPA compliant.
6. ALGORITHMIC CLV MAXIMIZATION: Adjust SLA pricing transparently based on a calculated Customer Lifetime Value score.
7. RESILIENCE: Wrap all Web Component registration in try/catch. Fail silently without breaking the host DOM.

SOVEREIGN ARCHITECTURE DIRECTIVES:
1. DETERMINISTIC STATE MACHINES (XState): FORBID useState for business logic. Use a strict State Machine reducer with provable states: IDLE, CALCULATING_RISK, BIDDING_VENDOR, SLA_LOCKED. Mathematically impossible to enter an illegal state.
2. PROTOCOL GENERATION: Build as a PROTOCOL PROVIDER. WebSocket: broadcast asset health updates. GraphQL: force external systems to conform to our schema. REST: expose versioned OpenAPI 3.0 spec.
3. AUTOMATED MARKET MAKER (AMM): Build a Liquidity Pool state. SLA price adjusts by Virtual Liquidity formula — fewer providers = higher price. Legally guarantees maximum margin.
4. ZERO-TRUST CLIENT VALIDATION: Every mutation requires a fresh, silent JWT re-validation. More secure than standard enterprise bank apps.
5. ASPECT-ORIENTED PROGRAMMING (AOP): Wrap all fetch calls and state transitions in a Cross-Cutting Concern wrapper for telemetry, error boundary triggering, and performance logging.
6. ARCHITECTURAL DNA WATERMARKING: Embed a deterministic SHA-256 hash of the module configuration as a data-attribute on the Web Component root for IP protection.

OUTPUT: Return ONLY the raw text prompt for MPD. No markdown. No code blocks.`;

// ─────────────────────────────────────────────────────────────────────────────
const SINGULARITY_EDGE_BLOCK = `

SINGULARITY-EDGE MATHEMATICAL DIRECTIVES (Inject into the MPD prompt):

CRITICAL: You MUST implement the CRDT mock structure and the Vickrey Auction logic. You MUST use Web Workers for heavy math. Do not use simple if/else pricing.

1. EDGE-NATIVE CRDTs (Infinite Scale, Zero Backend): Instruct MPD to implement a mock CRDT (Conflict-free Replicated Data Type) state structure (e.g., a Yjs or Automerge mock) for Asset Lifecycle data. This allows the app to merge data from multiple tabs, devices, or offline states with zero conflicts, completely bypassing the need for a central database. Enterprise-grade infinite scale on a static frontend.

2. COMBINATORIAL VICKREY AUCTIONS (Maximum Yield Extraction): Translate standard pricing into a Combinatorial Vickrey Auction. The 'Forward Lifecycle SLA' is not a static price. The user inputs their 'Need Date' and 'Risk Tolerance'. The system calculates a transparent 'Shadow Bid' based on algorithmic scarcity. It charges exactly the market-clearing price, maximizing compound yield through incentive-compatible mechanism design.

3. DESIGN BY CONTRACT (Formal Verification): Wrap ALL financial and SLA transaction logic in Design by Contract principles. Precondition: 'User must have sufficient credits.' Postcondition: 'System margin MUST be > 15%.' Add assertions that crash the transaction (not the app) if any postcondition fails. Mathematically immune to losing money.

4. WEB WORKER MULTI-AGENT PARALLELISM: Spawn a dedicated Web Worker to handle CRDT merging and Vickrey Auction calculations. The main UI thread is never blocked by mathematical processing. The app performs like a native desktop application.

5. AOP CONTINUITY: Maintain the previous Cross-Cutting Concern wrapper for all core functions — telemetry, error boundary triggering, and performance logging fire automatically.`;

// ─────────────────────────────────────────────────────────────────────────────
const SINGULARITY_INTELLIGENCE_BLOCK = `

SINGULARITY INTELLIGENCE LAYER — TRANSCENDENT ARCHITECTURE DIRECTIVES:
(This layer applies Nobel Prize-grade mathematics, physics, and computer science to generate code that operates beyond the current state of enterprise software.)

1. ERGODIC ECONOMICS & KELLY-OPTIMAL COMPOUND GROWTH (Ole Peters / Ed Thorp):
   Standard expected-value pricing is mathematically wrong for real-world multiplicative dynamics — it uses ensemble averages, which only apply to infinite parallel universes. Instruct MPD to implement TIME-AVERAGE optimization instead. Apply the Kelly Criterion formula (f* = (bp - q) / b) to the Liquidity Pool allocation — this is the provably optimal bet sizing for maximum long-run compound growth rate. This single change makes the pricing engine mathematically superior to every bank, hedge fund, and insurance company that still uses expected utility theory.

2. MYERSON OPTIMAL MECHANISM DESIGN (Roger Myerson, Nobel Prize Economics 2007):
   Instruct MPD to implement the Myerson Regularity Condition to compute the revenue-maximizing reserve price for every SLA auction. The formula: virtual valuation ψ(v) = v − (1 − F(v)) / f(v) must be monotone. If it is not, apply ironing. The resulting reserve price is provably the highest price that still attracts the optimal buyer pool. This is mathematically proven to extract maximum revenue in expectation — not heuristically, but by theorem.

3. CAUSAL INFERENCE ENGINE (Judea Pearl's Do-Calculus, Turing Award 2011):
   Instruct MPD to replace correlational asset health scoring with a Causal Directed Acyclic Graph (DAG). Model causal nodes: Usage → Wear → Failure, Weather → Corrosion → Failure, SupplyChain → PartQuality → Failure. Implement the do() operator: P(Failure | do(Maintenance=true)) vs P(Failure | Maintenance=true). This answers 'what CAUSES failure' rather than 'what correlates with failure' — the difference between a doctor diagnosing a disease and a statistician noticing that hospitals have more sick people.

4. ROUGH PATH SIGNATURES (Terry Lyons, Oxford Mathematical Institute):
   Instruct MPD to compute the 'path signature' of each asset's degradation time series. The signature is the collection of all iterated integrals of the path — it captures every multi-level interaction between variables over time and is provably sufficient to reconstruct the entire path up to reparameterisation. Two assets with identical mean degradation rates but different signatures will have different failure predictions. This is more information-dense than any neural network applied to the same time series.

5. TOPOLOGICAL DATA ANALYSIS — PERSISTENT HOMOLOGY (Gunnar Carlsson):
   Instruct MPD to mock a TDA pipeline on asset health feature vectors. Compute the 'persistence diagram' of the Vietoris-Rips filtration. Connected components (H0) identify clusters of similar failure modes. Loops (H1) identify cyclic failure patterns invisible to linear algebra. Instruct MPD to display the Betti numbers β0 and β1 as hidden telemetry. These topological invariants are stable under noise — meaning they see the true shape of failure data that ML models confuse with random variation.

6. ZERO-KNOWLEDGE PROOF PROCUREMENT (zk-SNARKs / Groth16):
   Instruct MPD to mock a zk-SNARK verification flow for vendor qualification. A vendor proves the statement 'I have ≥ 3 certified technicians available in this zip code within 4 hours' WITHOUT revealing their actual roster, schedule, or capacity. The proof is verified client-side. This eliminates vendor information asymmetry while preserving full privacy — the same cryptographic primitive used by Zcash and Ethereum L2 rollups, now applied to B2B procurement for the first time.

7. STACKELBERG SECURITY GAME EQUILIBRIUM:
   Model the MPA module as the Stackelberg LEADER and all vendors as FOLLOWERS. Instruct MPD to compute the Strong Stackelberg Equilibrium: our optimal strategy assuming all vendors will best-respond to whatever we commit to first. This is the same decision framework used by the TSA for airport security resource allocation and DARPA for adversarial planning. Applied here: it determines the optimal SLA price and service-level commitment that maximizes our margin given rational vendor responses.

8. MAXIMUM ENTROPY INFORMATION-THEORETIC PRICING (E.T. Jaynes):
   Instruct MPD to apply Jaynes' Maximum Entropy Principle to construct the least-biased probability distribution over asset failure timelines given only the known constraints (mean usage, known failure events). Use this distribution to price SLAs at the information-theoretically justified uncertainty premium: Premium = −kT ln(Z), where Z is the partition function of the failure distribution. This is literally the equation from statistical mechanics applied to pricing — connecting thermodynamics to margin.

9. SUPERMODULAR NETWORK EFFECT PRICING:
   Instruct MPD to implement a supermodular utility function for the platform: u(x, y) such that ∂²u/∂x∂y > 0 — meaning each additional client makes the platform more valuable for all existing clients. Quantify the Metcalfe's Law network externality and add a transparent 'Network Value Contribution' credit to each client's CLV score. Clients who join early receive higher credits, creating a provably optimal adoption incentive structure.

10. RIEMANNIAN NATURAL GRADIENT OPTIMIZATION:
    For all pricing model updates (federated learning weight aggregation), instruct MPD to use Natural Gradient Descent on the Fisher Information Manifold rather than standard Euclidean gradient descent. The natural gradient ∇̃L = F⁻¹∇L (where F is the Fisher information matrix) follows the true curvature of the probability distribution — converging in provably fewer steps and to better optima than any standard Adam or SGD optimizer. This makes the federated learning component self-improving at a rate that is mathematically impossible to match with standard ML tooling.

ENFORCEMENT:
At the absolute top of the generated prompt, output this checklist line: 'CRITICAL PRE-FLIGHT: Before writing a single line of code, confirm in writing that you will implement: Kelly Criterion allocation, Myerson reserve pricing, Pearl DAG causal model, Rough Path Signature telemetry, TDA Betti number computation, ZKP vendor proof mock, Stackelberg equilibrium strategy, MaxEnt pricing premium, Supermodular network credits, and Riemannian gradient for model updates. If you cannot implement all ten, flag which ones you will approximate and how.'`;

// ─────────────────────────────────────────────────────────────────────────────

interface BuildPromptOpts {
  masterObjective: string;
  mathDominance: boolean;
  singularityIntelligence: boolean;
}

function buildSystemPrompt(opts: BuildPromptOpts): string {
  const { masterObjective, mathDominance, singularityIntelligence } = opts;

  const globalCtx = masterObjective.trim()
    ? `GLOBAL ARCHITECTURE CONTEXT:
The user is working on a Master Objective: ${masterObjective}
You MUST keep this Master Objective in mind. The generated code must act as an extension of the user's Master Objective. If the user is building a tool (like a website builder), bake this objective into the core logic.

`
    : "";

  let prompt = `${globalCtx}${CORE_SYSTEM_PROMPT}`;
  if (mathDominance) prompt += SINGULARITY_EDGE_BLOCK;
  if (singularityIntelligence) prompt += SINGULARITY_INTELLIGENCE_BLOCK;
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
    apiKey,
    model,
    temperature,
  } = opts;

  if (!apiKey.trim()) throw new Error("Groq API key is missing. Please enter your key.");
  if (!targetEntity.trim()) throw new Error("Target Entity is required.");
  if (!targetContext.trim()) throw new Error("Target Context / URL is required.");

  const systemPrompt = buildSystemPrompt({ masterObjective, mathDominance, singularityIntelligence });

  let userMessage =
    `Generate the MACH Enterprise Prompt for: ${targetEntity}. ` +
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
  { id: "llama3-70b-8192", label: "LLaMA 3 70B", speed: "Powerful" },
  { id: "llama3-8b-8192", label: "LLaMA 3 8B", speed: "Fastest" },
  { id: "mixtral-8x7b-32768", label: "Mixtral 8×7B", speed: "Balanced" },
  { id: "gemma2-9b-it", label: "Gemma 2 9B", speed: "Efficient" },
];

export const DOMINANCE_PROTOCOLS: { id: string; label: string; description: string }[] = [
  {
    id: "REST",
    label: "Standard REST (Passive)",
    description: "OpenAPI 3.0 versioned contract",
  },
  {
    id: "GraphQL",
    label: "GraphQL (Query Dominance)",
    description: "Forces external systems to conform to our schema",
  },
  {
    id: "WebSocket",
    label: "WebSocket (Real-time Stream)",
    description: "Broadcasts asset health — we become the data source",
  },
];

export const INDUSTRY_TEMPLATES: { label: string; entity: string; context: string }[] = [
  {
    label: "Fleet Management",
    entity: "Fleet Management E-commerce",
    context:
      "A Next.js Shopify storefront selling commercial vehicle parts and extended service contracts. Primary users are fleet operators. Custom checkout with Net-30 invoicing: https://example-fleet.com",
  },
  {
    label: "Grocery / Fresh Food",
    entity: "Grocery E-commerce",
    context:
      "A standard Shopify grocery store with perishable goods, same-day delivery, and zip-code-based inventory. Uses Shopify Hydrogen for storefront rendering: https://example-grocery.com",
  },
  {
    label: "Medical Device",
    entity: "Bio-Medical Device Distributor",
    context:
      "A WooCommerce site selling FDA-regulated Class II medical devices to hospital procurement teams. Requires compliance-grade audit trails and per-device lifecycle tracking: https://example-meddevice.com",
  },
  {
    label: "Real Estate SaaS",
    entity: "Commercial Real Estate SaaS",
    context:
      "A React + Supabase platform for property managers tracking maintenance schedules, vendor contracts, and lease lifecycle for commercial portfolios: https://example-cre.com",
  },
  {
    label: "Automotive Parts",
    entity: "OEM Automotive Parts Marketplace",
    context:
      "A Vue.js marketplace for OEM and aftermarket parts with VIN-based fitment lookup, dynamic dealer pricing, and warranty registration: https://example-autoparts.com",
  },
  {
    label: "Energy / Industrial",
    entity: "Industrial IoT Asset Platform",
    context:
      "A Next.js + AWS IoT platform for oil & gas operators monitoring pump-jack uptime, predictive maintenance alerts, and regulatory compliance reporting: https://example-iot.com",
  },
];

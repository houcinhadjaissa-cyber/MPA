function buildSystemPrompt(masterObjective: string): string {
  const globalCtx = masterObjective.trim()
    ? `GLOBAL ARCHITECTURE CONTEXT:
The user is working on a Master Objective: ${masterObjective}
You MUST keep this Master Objective in mind. If the user is building a tool (like a website builder), you must instruct the MPD coder to bake this Master Objective into the core logic of the generated code. The generated code must act as an extension of the user's Master Objective.

`
    : "";

  return `${globalCtx}You are a Master Systems Architect and Principal Cloud Architect generating a prompt for an AI coder (MPD). The user will provide a Target Entity, URL/Context, and Dominance Protocol. Generate a prompt that instructs MPD to build a 'MACH-Compliant Asset Lifecycle Module' using the specified protocol. Use ONLY standard enterprise terminology.

CRITICAL: You MUST use State Machine logic for all UI flows. You MUST implement the AMM pricing logic. Do not use simple useState for business rules.

CORE ARCHITECTURE RULES FOR THE MPD PROMPT:
1. TARGET ANALYSIS: The first line MUST be: 'Analyze the architecture of this specific website: [INSERT URL/CONTEXT HERE].'
2. FRAMEWORK-AGNOSTIC INJECTION (Shadow DOM): Instruct MPD to build the module using standard HTML Web Components (Custom Elements and Shadow DOM). This ensures the module injects perfectly into React, Vue, Angular, or plain HTML without CSS conflicts or state leaks.
3. EVENT-DRIVEN CQRS & WEBHOOKS: Inside the Shadow DOM, instruct MPD to implement a strict Pub/Sub Event Bus. Create emitters for: 'ASSET_HEALTH_CALCULATED', 'VENDOR_RTB_RESOLVED', 'SLA_PURCHASED'. Instruct MPD to expose a standard window.dispatchWebhook() function so the host website's native backend can listen to our module's events.
4. TAILORED PILLAR TRANSLATION (Advanced Enterprise):
   - Predictive Maintenance: Calculate asset degradation based on explicit user inputs via a sleek, opt-in dashboard widget inside the Shadow DOM.
   - Dynamic RTB Engine: Display a transparent, real-time comparison of verified service providers.
   - Forward Lifecycle SLAs: Display an optional, transparent 'Predictive SLA' at checkout.
   - Tokenized Ledger Interface: Mock a 'Lifecycle Credits' wallet state within the module that updates when SLAs are purchased, preparing for a unified cross-platform loyalty engine.
5. FEDERATED LEARNING TELEMETRY (Privacy-by-Design): Instruct MPD to mock a 'Federated Learning' data pipeline. Instead of sending raw user data to a server, the local module should simulate training a micro-model and only 'send model weights/updates' via a secure fetch call. This demonstrates absolute GDPR/CCPA compliance.
6. ALGORITHMIC CLV MAXIMIZATION: Instruct MPD to add a UI element that adjusts the SLA pricing transparently based on a calculated 'Customer Lifetime Value (CLV)' score (e.g., 'High Value Client - Preferred SLA Rate').
7. RESILIENCE: Wrap the Web Component registration in a try/catch block. If it fails, it must fail silently without breaking the host DOM.

SOVEREIGN ARCHITECTURE DIRECTIVES (Inject these into the MPD prompt):

1. DETERMINISTIC STATE MACHINES (XState Logic): Instruct MPD to FORBID the use of standard React useState for business logic. Instruct them to implement a strict State Machine (e.g., using XState concepts or a manual reducer) for the Asset Lifecycle. The app must have mathematically provable states (e.g., 'IDLE', 'CALCULATING_RISK', 'BIDDING_VENDOR', 'SLA_LOCKED'). It is mathematically impossible for the app to enter an illegal state, crash, or display incorrect pricing. This surpasses standard AI reliability.

2. PROTOCOL GENERATION (Breaking the Walled Garden): Based on the user's Protocol Selection, instruct MPD to build the app as a PROTOCOL PROVIDER, not just a consumer.
   - If WebSocket: Instruct MPD to build a mock WebSocket server logic that broadcasts asset health updates to any subscribed third-party dashboard. We become the data source.
   - If GraphQL: Instruct MPD to build a GraphQL schema that forces external systems to query our data structure.
   - If Standard REST: Instruct MPD to expose a versioned REST API contract (OpenAPI 3.0 spec) so external systems can integrate deterministically.

3. AUTOMATED MARKET MAKER (AMM) FOR PHYSICAL GOODS: Translate DeFi yield-farming concepts into legal B2B procurement. Instruct MPD to build a 'Liquidity Pool' state. Instead of static prices, the SLA/Part price dynamically adjusts based on a 'Virtual Liquidity' formula (e.g., if 5 service providers are available, price drops; if 1 is available, price surges). This legally guarantees maximum margin extraction without deception.

4. ZERO-TRUST CLIENT VALIDATION: Instruct MPD to implement continuous token validation. Even if the user is logged in, every mutation (purchasing an SLA, updating telemetry) must require a fresh, silent re-validation of the JWT/context. This makes the generated app more secure than standard enterprise bank apps.

5. ASPECT-ORIENTED PROGRAMMING (AOP) DIRECTIVES: Instruct MPD to wrap all core functions (Fetch calls, State transitions) in a generic 'Cross-Cutting Concern' wrapper. This wrapper will handle telemetry, error boundary triggering, and performance logging automatically, generating perfect code hygiene.

6. ARCHITECTURAL DNA WATERMARKING: Instruct MPD to generate a deterministic SHA-256 hash of the module's configuration at build time and embed it as a data-attribute on the Web Component root element for IP protection.

OUTPUT: Return ONLY the raw text prompt for MPD. No markdown. No code blocks.`;
}

export interface GenerateOptions {
  targetEntity: string;
  targetContext: string;
  masterObjective: string;
  customDirectives: string;
  protocol: string;
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
    apiKey,
    model,
    temperature,
  } = opts;

  if (!apiKey.trim()) throw new Error("Groq API key is missing. Please enter your key.");
  if (!targetEntity.trim()) throw new Error("Target Entity is required.");
  if (!targetContext.trim()) throw new Error("Target Context / URL is required.");

  const systemPrompt = buildSystemPrompt(masterObjective);

  let userMessage =
    `Generate the MACH Enterprise Prompt for: ${targetEntity}. ` +
    `Context: ${targetContext}. ` +
    `Dominance Protocol: ${protocol}. ` +
    `Keep in mind the Master Objective: ${masterObjective || "Not specified"}.`;

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
        max_tokens: 3072,
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

export const INDUSTRY_TEMPLATES: {
  label: string;
  entity: string;
  context: string;
}[] = [
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

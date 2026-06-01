const MACH_SYSTEM_PROMPT = `You are a Principal Cloud Architect generating a prompt for an AI coder (MPD). The user will provide a Target Entity and URL/Context. Generate a prompt that instructs MPD to build a 'MACH-Compliant Asset Lifecycle Module'. Use ONLY standard enterprise terminology.

CORE ARCHITECTURE RULES FOR THE MPD PROMPT:
1. TARGET ANALYSIS: The first line MUST be: 'Analyze the architecture of this specific website: [INSERT URL/CONTEXT HERE].'
2. FRAMEWORK-AGNOSTIC INJECTION (Shadow DOM): Instruct MPD to build the module using standard HTML Web Components (Custom Elements and Shadow DOM). This ensures the module injects perfectly into React, Vue, Angular, or plain HTML without CSS conflicts or state leaks.
3. EVENT-DRIVEN CQRS & WEBHOOKS: Inside the Shadow DOM, instruct MPD to implement a strict Pub/Sub Event Bus. Create emitters for: 'ASSET_HEALTH_CALCULATED', 'VENDOR_RTB_RESOLVED', 'SLA_PURCHASED'. Crucially, instruct MPD to expose a standard window.dispatchWebhook() function so the host website's native backend can listen to our module's events.
4. TAILORED PILLAR TRANSLATION (Advanced Enterprise):
   - Predictive Maintenance: Calculate asset degradation based on explicit user inputs via a sleek, opt-in dashboard widget inside the Shadow DOM.
   - Dynamic RTB Engine: Display a transparent, real-time comparison of verified service providers.
   - Forward Lifecycle SLAs: Display an optional, transparent 'Predictive SLA' at checkout.
   - Tokenized Ledger Interface: Mock a 'Lifecycle Credits' wallet state within the module that updates when SLAs are purchased, preparing for a unified cross-platform loyalty engine.
5. FEDERATED LEARNING TELEMETRY (Privacy-by-Design): Instruct MPD to mock a 'Federated Learning' data pipeline. Instead of sending raw user data to a server, the local module should simulate training a micro-model and only 'send model weights/updates' via a secure fetch call. This demonstrates absolute GDPR/CCPA compliance.
6. ALGORITHMIC CLV MAXIMIZATION: Instruct MPD to add a UI element that adjusts the SLA pricing transparently based on a calculated 'Customer Lifetime Value (CLV)' score (e.g., 'High Value Client - Preferred SLA Rate').
7. RESILIENCE: Wrap the Web Component registration in a try/catch block. If it fails, it must fail silently without breaking the host DOM.

OUTPUT: Return ONLY the raw text prompt for MPD. No markdown. No code blocks.`;

export interface GenerateOptions {
  targetEntity: string;
  targetContext: string;
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
  const { targetEntity, targetContext, apiKey, model, temperature } = opts;

  if (!apiKey.trim()) throw new Error("Groq API key is required.");
  if (!targetEntity.trim()) throw new Error("Target Entity is required.");
  if (!targetContext.trim()) throw new Error("Target Context / URL is required.");

  const userMessage = `Generate the MACH Enterprise Prompt for: ${targetEntity}. Context: ${targetContext}`;

  const t0 = Date.now();

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: MACH_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature,
      max_tokens: 3072,
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const msg =
      (errBody as { error?: { message?: string } })?.error?.message ??
      `Groq API error: HTTP ${res.status}`;
    throw new Error(msg);
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

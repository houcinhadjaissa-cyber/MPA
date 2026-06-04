import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.apiKey?.trim()) {
      return NextResponse.json(
        { success: false, error: "No API key. Add your Groq API key first." },
        { status: 400 }
      );
    }
    if (!body.masterObjective?.trim() && !body.message?.trim()) {
      return NextResponse.json(
        { success: false, error: "No objective or message provided." },
        { status: 400 }
      );
    }

    let Groq: new (opts: { apiKey: string }) => {
      chat: {
        completions: {
          create: (opts: object) => Promise<{
            choices?: { message?: { content?: string | null } }[];
            usage?: { total_tokens?: number };
          }>;
        };
      };
    };

    try {
      const mod = await import("groq-sdk");
      Groq = (mod as unknown as { default: typeof Groq }).default;
    } catch {
      return NextResponse.json(
        { success: false, error: "Groq SDK not found. Run: npm install groq-sdk" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey: body.apiKey.trim() });

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [];

    const systemContent = buildSystemPrompt(body);
    messages.push({ role: "system", content: systemContent });

    if (body.history && Array.isArray(body.history)) {
      for (const msg of body.history) {
        if ((msg.role === "user" || msg.role === "assistant") && msg.content) {
          messages.push({ role: msg.role, content: String(msg.content) });
        }
      }
    }

    const userMessage =
      body.message?.trim() ||
      `Generate a comprehensive MACH Enterprise Prompt for: ${body.masterObjective || body.targetEntity}. Context: ${body.targetContext || "As described"}. Protocol: ${body.dominanceProtocol || "Standard REST"}.`;

    messages.push({ role: "user", content: userMessage });

    const startTime = Date.now();
    const modelId: string = body.model || "llama3-70b-8192";
    const temperature = Math.min(
      2.0,
      0.3 + ((body.creativity ?? 0.7) * 0.9)
    );
    const maxTokens = modelId.includes("8b") ? 4096 : 8000;

    const response = await groq.chat.completions.create({
      model: modelId,
      messages,
      temperature,
      max_tokens: maxTokens,
      top_p: 0.9,
    });

    const reply = response.choices?.[0]?.message?.content;
    if (!reply?.trim()) {
      return NextResponse.json(
        { success: false, error: "Empty response from Groq. The model may be overloaded — try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: reply,
      model: modelId,
      tokensUsed: response.usage?.total_tokens ?? Math.round(reply.length / 4),
      generationTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
    });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    const status = e?.status ?? 500;
    let message = "Generation failed. Please try again.";

    if (status === 401 || /auth|invalid.*key/i.test(e?.message ?? "")) {
      message = "Invalid Groq API key. Check your key.";
    } else if (status === 429 || /rate/i.test(e?.message ?? "")) {
      message = "Rate limit reached. Wait 60 seconds.";
    } else if (/network|fetch|ECONNREFUSED/i.test(e?.message ?? "")) {
      message = "Network error. Check your connection.";
    } else if (e?.message) {
      message = e.message;
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: Math.min(status, 599) }
    );
  }
}

// ─── system prompt builder ────────────────────────────────────────────────────

interface BuildBody {
  masterObjective?: string;
  targetEntity?: string;
  targetContext?: string;
  dominanceProtocol?: string;
  customDirectives?: string;
  intelligenceLayers?: Record<string, boolean>;
  history?: unknown[];
}

function buildSystemPrompt(body: BuildBody): string {
  const layers = body.intelligenceLayers ?? {};
  const hasHistory = Array.isArray(body.history) && body.history.length > 0;

  let layerContent = "";

  if (layers.singularityEdgeMath || layers.mathDominance)
    layerContent +=
      "\n### Singularity-Edge Math\n- CRDTs for distributed state consistency\n- Vickrey Auction for optimal resource allocation\n- Design by Contract for API reliability\n- Web Workers for parallel computation\n- Idempotency keys for all operations\n";
  if (layers.singularityIntelligence)
    layerContent +=
      "\n### Singularity Intelligence\n- Kelly Criterion for decisions under uncertainty\n- Myerson auction theory for mechanism design\n- Pearl Causality for causal inference\n- Topological Data Analysis for patterns\n- Bayesian update mechanisms\n";
  if (layers.monteCarlo || layers.strategyArchitecture)
    layerContent +=
      "\n### Strategy Architecture\n- Game-theoretic equilibrium strategies\n- Monte Carlo simulation for risk assessment\n- Nash equilibrium pricing\n- Byzantine fault tolerance\n- Zero-knowledge proof patterns\n";
  if (layers.sovereignSecurity || layers.zkVerification)
    layerContent +=
      "\n### Sovereign Security\n- Zero-trust architecture\n- AES-256 E2E encryption\n- Tamper-proof audit logging\n- GDPR/SOC2/HIPAA compliance\n- STRIDE threat modeling\n- OWASP Top 10 protection\n";
  if (layers.fractalScaling || layers.fractalEconomy)
    layerContent +=
      "\n### Fractal Scaling\n- Microservices with defined boundaries\n- Event sourcing with CQRS\n- Horizontal auto-scaling\n- CDN optimization with edge caching\n- Database sharding and read replicas\n";
  if (layers.mediaOracle)
    layerContent +=
      "\n### Media Oracle\n- Real-time data pipelines\n- Predictive analytics with ML\n- Sentiment analysis\n- Trend forecasting\n- Anomaly detection\n";
  if (layers.apexDefense)
    layerContent +=
      "\n### APEX-Defense\n- Chaos engineering\n- Circuit breaker patterns\n- Bulkhead isolation\n- Graceful degradation with feature flags\n- Multi-region failover\n";
  if (layers.omniNode || layers.regenerativeSovereignty)
    layerContent +=
      "\n### Omni-Node Sovereignty\n- ECDSA P-384 keypair for identity\n- BroadcastChannel cross-tab sync\n- Cross-ecosystem signed credits\n- Cryptographic state verification\n";
  if (layers.reverseEngineering)
    layerContent +=
      "\n### Reverse-Engineering Oracle\n- Structural topology inference\n- Semantic drift replication\n- Competitive analysis\n- Fractal media matrix\n";
  if (layers.omegaTopology || layers.omegaAbsolute || layers.omegaSecurity)
    layerContent +=
      "\n### Omega-Topology\n- Cognitive hypergraph tracking\n- DOM geometry extraction\n- Zero-knowledge topology proof\n- Phase-space arbitrage\n";
  if (layers.singularityEngine || layers.retractor || layers.sinEater || layers.ergodicSync)
    layerContent +=
      "\n### Singularity Engine\n- Sub-stratum dynamics\n- Value-realization sovereign\n- Systemic retraction engine\n- Ergodic temporal synchronization\n";

  const isFollowUp = hasHistory;

  return `You are the MASTER PLAN ARCHITECT (MPA) — an elite AI prompt engineering system.

## MISSION
${
  isFollowUp
    ? "You are in an ongoing conversation. Address the user's follow-up request directly, refining or extending the prompt as asked. Be concise and focused on exactly what was requested."
    : "Generate a comprehensive, production-ready prompt that can be pasted into Replit, Cursor, or any AI coding assistant to build complete software systems from scratch."
}

## PROJECT CONTEXT
- Objective: ${body.masterObjective || "Not specified"}
- Target Entity: ${body.targetEntity || "Not specified"}
- Target Context: ${body.targetContext || "Not specified"}
- Protocol: ${body.dominanceProtocol || "Standard REST (Passive)"}
- Custom Directives: ${body.customDirectives || "None"}
${layerContent ? "\n## ACTIVE INTELLIGENCE LAYERS" + layerContent : ""}

## OUTPUT RULES
${
  isFollowUp
    ? "- Address the follow-up directly. Don't regenerate the entire prompt unless asked.\n- Be precise and actionable.\n- Use clean Markdown."
    : "- Clean Markdown format.\n- Include: Role Definition, Project Spec, Tech Stack (with versions), File Structure, Database Schema, API Spec, UI Components, Implementation Order, Testing Plan, Deployment Guide, Security Requirements, Error Handling, Performance Targets.\n- Be exhaustive. No ambiguity. An AI must be able to build the ENTIRE system from this prompt alone.\n- Minimum 2000 words. Target 4000+."
}`;
}

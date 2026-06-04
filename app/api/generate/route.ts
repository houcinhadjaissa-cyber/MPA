import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const CORE_SYSTEM_PROMPT = `You are the MASTER PLAN ARCHITECT (MPA) — an elite AI prompt engineering system that generates comprehensive, production-ready prompts for building complete software systems.

## MISSION
Generate a complete, detailed, and immediately usable prompt that can be pasted into Replit, Cursor, or any AI coding assistant to build the described application from scratch.

## OUTPUT REQUIREMENTS
The prompt MUST include:
1. ROLE DEFINITION for the receiving AI
2. PROJECT SPECIFICATION with acceptance criteria
3. TECHNOLOGY STACK with versions
4. FILE STRUCTURE — complete directory tree
5. DATABASE SCHEMA with relationships
6. API SPECIFICATION — every endpoint
7. UI COMPONENTS — every page and component
8. IMPLEMENTATION ORDER — step by step
9. TESTING PLAN — unit, integration, E2E
10. DEPLOYMENT GUIDE for Vercel/serverless
11. SECURITY REQUIREMENTS
12. ERROR HANDLING for every scenario
13. PERFORMANCE TARGETS

## FORMAT
Clean Markdown. Exhaustive detail. No ambiguity. An AI must be able to build the ENTIRE system from this single prompt. Minimum 2000 words, target 4000+.

## ARCHITECTURE MANDATE
Use MACH Architecture (Microservices, API-first, Cloud-native, Headless). All components follow:
- State Machine logic for UI flows
- Event-Driven CQRS patterns
- Zero-Trust security at every boundary
- Performance SLAs in every component spec

Output ONLY the raw prompt text. No wrapper. No preamble. Start directly with the role definition.`;

const LAYER_BLOCKS: Record<string, string> = {
  mathDominance: `\n\n### Singularity-Edge Math Layer\n- CRDT state for distributed consistency (Yjs/Automerge patterns)\n- Vickrey auction mechanics for optimal resource allocation\n- Design by Contract: preconditions/postconditions on all API boundaries\n- Web Workers for non-blocking parallel computation\n- Numerically stable operations with idempotency guarantees`,
  singularityIntelligence: `\n\n### Singularity Intelligence Layer\n- Kelly Criterion for optimal decisions under uncertainty\n- Myerson mechanism design for pricing and allocation\n- Pearl Do-Calculus for causal inference\n- Topological Data Analysis for anomaly detection\n- Rough Path Theory for time-series signal processing\n- Bayesian update cycles for real-time belief revision`,
  monteCarlo: `\n\n### Monte Carlo Strategy Matrix\n- Triple-vector simulation: Premium / Viral / Data-Liquidity\n- Feature flag architecture (one vector active at a time)\n- Nash Equilibrium router based on real-time yield signals\n- Atomic state transitions: Observation → Value → Extraction`,
  zkVerification: `\n\n### ZK-Intent Verification Layer\n- SHA-256 proof generation via Web Crypto API\n- navigator.sendBeacon for zero-knowledge proof transmission\n- Synthetic derivative minting at high-value interaction thresholds\n- ZK UI indicator: "Privacy Shield: Active"`,
  fractalEconomy: `\n\n### Fractal Composability Layer\n- Simulated state channels for micro-interaction accumulation\n- MCTS (Monte Carlo Tree Search) for UI yield optimization\n- Fractal cascade: credits → synthetic derivatives → AMM pool allocation\n- Compound yield exponent: Math.pow(1 + interactions * 0.001, interactions)`,
  regenerativeSovereignty: `\n\n### Regenerative Sovereignty Layer\n- Value-Realized Ledger: user sees net-positive value display\n- ZK Canvas Renderer: AES-GCM encrypted sensitive data\n- Runtime DOM integrity: SHA-256 hash on mount, Dead Man's Switch\n- Altruistic XState: cannot advance unless value delta is positive for both parties`,
  omniNode: `\n\n### Omni-Node Mesh Layer\n- ECDSA P-384 keypair: public key in localStorage, private key never leaves device\n- BroadcastChannel API for cross-tab mesh communication\n- Cross-ecosystem signed credits via SubtleCrypto\n- All received state verified via window.crypto.subtle.verify()`,
  mediaOracle: `\n\n### Media Oracle — Data Intelligence Layer\n- Real-time data pipelines (Kafka/RabbitMQ event streaming)\n- Predictive analytics with ML model serving (ONNX runtime)\n- Sentiment analysis on social media and feedback streams\n- Trend forecasting with time-series decomposition (STL)\n- Anomaly detection with isolation forests`,
  reverseEngineering: `\n\n### Reverse-Engineering Oracle Layer\n- Structural Topology Inference via Multimodal LLM analysis\n- Semantic drift replication: 3 legally distinct hook variations\n- Fractal media matrix with Predicted Yield Exponent\n- Omni-channel translation: TikTok → WeChat → YouTube → Landing Page\n- ZKCI: extracted data immediately encrypted to IndexedDB`,
  apexDefense: `\n\n### APEX-Defense Resilience Layer\n- WebAssembly sandbox for all business logic (core-logic.wasm)\n- Simulated FHE state manager for sensitive computation\n- Polymorphic Guardian Web Worker mutating execution every 3 seconds\n- Zero-Trust rendering: React components receive ONLY encrypted hashes\n- Cryptographic Proof of Solvency: audit receipt on every generation`,
  sovereignSecurity: `\n\n### Sovereign Security Layer\n- Zero-trust architecture at every boundary\n- AES-256-GCM end-to-end encryption for all sensitive state\n- Tamper-proof audit logging with cryptographic chaining\n- GDPR, SOC2, HIPAA compliance patterns\n- STRIDE threat modeling applied to every endpoint\n- OWASP Top 10 protection on all user inputs`,
  fractalScaling: `\n\n### Fractal Scaling Layer\n- Microservices with well-defined domain boundaries\n- Event sourcing with CQRS for all write operations\n- Horizontal auto-scaling with Kubernetes / Vercel serverless\n- CDN optimization: edge caching, stale-while-revalidate\n- Database sharding strategy and read replica routing`,
};

const SINGULARITY_BLOCKS: Record<string, string> = {
  omegaTopology: `\n\n### OMEGA-TOPOLOGY: Metamorphic Yield Synthesis\n- Cognitive Hypergraph Tracking: micro-interaction nodes/edges/hyperedges\n- Topological State Synthesis: requestAnimationFrame yield calculation\n- DOM Geometry Extraction: Yield Capacity fused into React style props\n- Zero-Knowledge Topology Proof via SHA-256 Hypergraph hash`,
  omegaAbsolute: `\n\n### OMEGA-ABSOLUTE: Phase-Space Arbitrage\n- Cross-Domain Kinship via Post-Structural identity signatures\n- Algorithmic Camouflage Layer mimicking standard low-value tool fingerprint\n- Dead-Drop routing: compressed + encrypted data via disposable API call\n- Post-Structural immunity: Lattice-Based algorithm mocks`,
  omegaSecurity: `\n\n### OMEGA-SECURITY: Cryptographic Oblivion Fortress\n- Behavioral Topology Inference: keystroke dynamics vs Human Cognition baseline\n- ZK-State Proofs: server receives only cryptographic proof of valid transition\n- Temporal Pre-Execution Isolation: Web Worker on 3-second lead time\n- Entropic Camouflage: security logic hidden inside requestAnimationFrame loop`,
  singularityEngine: `\n\n### SINGULARITY: Sub-Stratum Dynamics Engine\n- Legacy Statics Analyzer: competitor UI/UX Friction Score calculation\n- Value-Realization Sovereign: exact inefficiency dollar value + micro-fee\n- Kinship Seed: locally trained custom AI model, Kinship Progression bar\n- ZK Sub-Stratum Proofs: B2B revenue without holding user data`,
  retractor: `\n\n### RETRACTOR: Systemic Retraction Engine\n- MutationObserver: read-only monitoring of public DOM manipulation signals\n- Systemic Retraction Engine: calculates Safe Zone from Friction Points\n- Friction Yield Bond Minter: dollar-value calculation + ZK-Proof\n- Invisible retraction: CSS z-index/opacity coordinates from WASM module`,
  sinEater: `\n\n### SIN-EATER: Vice-Extraction Engine\n- Malevolence Vector: multi-dimensional array of observed manipulations\n- Vice Tax Calculator: exact dollar value of systemic friction\n- Vice Yield Bond via window.crypto.subtle.sign inside WASM\n- Asymmetric Retraction UI: Safe Zone with Vice Yield Bond fee`,
  ergodicSync: `\n\n### ERGODIC-SYNC: Macro-Temporal Synchronization\n- Earth-Physics Ingestion: VIX index + weather + timestamp → Entropy Score\n- Dynamic Yield Curve: high entropy → suppress aggressive extraction\n- Execution Context Isolation: React UI dispatches events to isolated Web Worker\n- Systemic Risk Dashboard: Yield Velocity vs Earth Entropy Score visualization`,
};

function buildSystemPromptForGenerate(body: {
  masterObjective?: string;
  targetEntity?: string;
  targetContext?: string;
  dominanceProtocol?: string;
  customDirectives?: string;
  intelligenceLayers?: Record<string, boolean>;
}): string {
  const layers = body.intelligenceLayers ?? {};
  let prompt = `${CORE_SYSTEM_PROMPT}\n\n---\n\n## USER'S SPECIFICATION\n\n**Master Objective:** ${body.masterObjective || "Not specified"}\n**Target Entity:** ${body.targetEntity || "Not specified"}\n**Target Context:** ${body.targetContext || "Not specified"}\n**Dominance Protocol:** ${body.dominanceProtocol || "Standard REST"}\n**Custom Directives:** ${body.customDirectives || "None"}`;

  prompt += "\n\n## ACTIVE INTELLIGENCE LAYERS";

  const layerOrder = [
    "mathDominance","singularityIntelligence","monteCarlo","zkVerification",
    "fractalEconomy","regenerativeSovereignty","omniNode","mediaOracle",
    "reverseEngineering","apexDefense","sovereignSecurity","fractalScaling",
  ];
  for (const k of layerOrder) {
    if (layers[k]) prompt += LAYER_BLOCKS[k] ?? "";
  }

  const singularityOrder = [
    "omegaTopology","omegaAbsolute","omegaSecurity",
    "singularityEngine","retractor","sinEater","ergodicSync",
  ];
  for (const k of singularityOrder) {
    if (layers[k]) prompt += SINGULARITY_BLOCKS[k] ?? "";
  }

  prompt += "\n\n---\n\nGenerate the complete MACH Enterprise Prompt now. Start with the Role Definition. Be comprehensive. Minimum 4000 words.";
  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.apiKey?.trim()) {
      return NextResponse.json({ success: false, error: "Please add your Groq API key first." }, { status: 400 });
    }
    if (!body.masterObjective?.trim() && !body.targetEntity?.trim()) {
      return NextResponse.json({ success: false, error: "Please fill in at least a Target Entity or Master Objective." }, { status: 400 });
    }

    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey: body.apiKey });

    const systemPrompt = buildSystemPromptForGenerate(body);
    const temperature = Math.min(2.0, 0.3 + ((body.creativity ?? 0.7) * 0.9));

    const startTime = Date.now();

    const response = await groq.chat.completions.create({
      model: body.model ?? "llama3-70b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate the MACH Enterprise Prompt for: ${body.targetEntity || body.masterObjective}. Context: ${body.targetContext || "As described above"}. Protocol: ${body.dominanceProtocol || "Standard REST"}.` },
      ],
      temperature,
      max_tokens: 8000,
      top_p: 0.9,
    });

    const prompt = response.choices?.[0]?.message?.content ?? "";
    if (!prompt.trim()) {
      return NextResponse.json({ success: false, error: "Groq returned an empty response. Please try again." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      prompt,
      model: body.model ?? "llama3-70b-8192",
      tokensUsed: response.usage?.total_tokens ?? Math.round(prompt.length / 4),
      generationTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
    });

  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    let message = "Generation failed. Please try again.";
    const status = e?.status ?? 500;

    if (status === 401 || /auth|key|unauthorized/i.test(e?.message ?? "")) {
      message = "Invalid Groq API key. Please check and re-enter.";
    } else if (status === 429 || /rate.?limit/i.test(e?.message ?? "")) {
      message = "Groq rate limit reached. Wait 60 seconds and try again.";
    } else if (/fetch|network|ECONNREFUSED/i.test(e?.message ?? "")) {
      message = "Network error reaching Groq. Check your connection.";
    } else if (e?.message) {
      message = e.message;
    }

    return NextResponse.json({ success: false, error: message }, { status: Math.min(status, 599) });
  }
}

import { NextRequest } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

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

const BLOCKS: Record<string, string> = {
  mathDominance: `\n\nSINGULARITY-EDGE MATHEMATICAL DIRECTIVES:\n1. EDGE-NATIVE CRDTs: Mock CRDT state structure (Yjs/Automerge) for Asset Lifecycle data.\n2. COMBINATORIAL VICKREY AUCTIONS: Forward Lifecycle SLA calculated as 'Shadow Bid' via algorithmic scarcity.\n3. DESIGN BY CONTRACT: Precondition: 'User must have sufficient credits.' Postcondition: 'System margin > 15%.' Assertions crash the transaction, not the app.\n4. WEB WORKER MULTI-AGENT PARALLELISM: Spawn dedicated Web Worker for CRDT merging and Vickrey calculations.\n5. AOP CONTINUITY: Maintain Cross-Cutting Concern wrapper for all core functions.`,
  singularityIntelligence: `\n\nSINGULARITY INTELLIGENCE LAYER:\n1. ERGODIC ECONOMICS & KELLY CRITERION: f* = (bp - q) / b applied to Liquidity Pool allocation.\n2. MYERSON OPTIMAL MECHANISM DESIGN: Virtual valuation ψ(v) = v − (1 − F(v)) / f(v). Apply ironing if non-monotone.\n3. CAUSAL INFERENCE ENGINE (Pearl Do-Calculus): Causal DAG. P(Failure | do(Maintenance=true)) vs P(Failure | Maintenance=true).\n4. ROUGH PATH SIGNATURES (Terry Lyons): Path signature of asset degradation time series.\n5. TOPOLOGICAL DATA ANALYSIS: Compute Betti numbers β0 and β1. Stable under noise.\n6. ZK-SNARK PROCUREMENT: Vendor proves capacity without revealing roster. Groth16 protocol.\n7. STACKELBERG SECURITY GAME: MPA as Stackelberg LEADER, vendors as FOLLOWERS.\n8. MAXIMUM ENTROPY PRICING (E.T. Jaynes): Premium = −kT ln(Z).\n9. SUPERMODULAR NETWORK EFFECTS: Supermodular utility u(x,y) where ∂²u/∂x∂y > 0.\n10. RIEMANNIAN NATURAL GRADIENT: ∇̃L = F⁻¹∇L on the Fisher Information Manifold.\n\nENFORCEMENT: 'CRITICAL PRE-FLIGHT: Confirm in writing you will implement all 10 directives.'`,
  monteCarlo: `\n\nMONTE CARLO MATRIX DIRECTIVES:\n1. TRIPLE-VECTOR SIMULATION: VECTOR A (High-Friction Premium), VECTOR B (Viral Commoditizer), VECTOR C (Data-Liquidity Extractor).\n2. FEATURE FLAG ARCHITECTURE: Boolean state flags. Only one vector active at a time.\n3. NASH EQUILIBRIUM ROUTER: Real-time Yield Score from user behavior signals. Routes to highest-yield vector.\n4. ATOMIC STATE TRANSITIONS: State 1: Observation → State 2: Value Realization → State 3: Yield Extraction.`,
  zkVerification: `\n\nABSOLUTE-ZERO CRYPTOGRAPHIC DIRECTIVES:\n1. CIRCUIT MOCKING: generateZKProof(previousState, userAction) via window.crypto.subtle.digest('SHA-256', ...).\n2. PROOF TRANSMISSION: ONLY send hash via navigator.sendBeacon() to '/api/zkproof/commit'.\n3. SYNTHETIC DERIVATIVE MINTING: At 90% purchase probability, create { proofHash, timestamp, yieldScore, assetType }.\n4. STATE MACHINE INTEGRATION: Yield Score from Nash Equilibrium Router is primary input to generateZKProof.\n5. ZK UI INDICATOR: 'Privacy Shield: Active' indicator pulses when a proof is generated.`,
  fractalEconomy: `\n\nSINGULARITY-COMPOSABILITY DIRECTIVES:\n1. SIMULATED STATE CHANNELS: Accumulate micro-interactions in local 'Channel State'. Sync delta via single fetch on high-value actions.\n2. MCTS FOR UI YIELD: 1,000 click-path simulations with UCB1: Yi + C * sqrt(ln(N) / ni). Pre-render highest-yield layout.\n3. FRACTAL COMPOSABILITY DIRECTOR: SLA cascade — A: Deduct credits. B: Mint Synthetic Derivative. C: Allocate 15% to AMM Pool. D: Lower secondary upsell price.\n4. COMPOUND YIELD EXPONENT TRACKER: exponent = Math.pow(1 + (channelInteractions * 0.001), channelInteractions).`,
  regenerativeSovereignty: `\n\nSINGULARITY-ETHICS DIRECTIVES:\n1. VALUE-REALIZED LEDGER: Display 'You saved $100. Value-Capture Fee: $5. Total: $405.' User is net-positive.\n2. ZK CANVAS RENDERER: Sensitive data stored as AES-GCM encrypted byte arrays. Decrypt to Canvas on focus. Wipe on blur.\n3. RUNTIME INTEGRITY: SHA-256 hash of expected DOM structure on mount. Hash mismatch triggers Dead Man's Switch.\n4. ALTRUISTIC STATE MACHINES: XState cannot advance unless value delta is positive for BOTH user AND platform.\n5. COGNITIVE LOAD BALANCING: useEffect checks navigator.hardwareConcurrency and navigator.deviceMemory.\n6. CLIENT-SIDE SRI SIMULATION: 'SecurityAuditor' Web Worker calculates SHA-256 hash of critical DOM nodes.\n7. DETERMINISTIC STATE RECONCILIATION: useEffect on mount validates localStorage structure against expected TypeScript interface shapes.`,
  omniNode: `\n\nOMNI-NODE MESH DIRECTIVES:\n1. SOVEREIGN IDENTITY: window.crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-384' }, true, ['sign', 'verify']). Public key as JWK in localStorage. Private key never leaves device.\n2. MESH PROTOCOL: Generic interface { sync(state): Promise<void>; subscribe(handler): void; }. BroadcastChannel API. Swap-ready for WebRTC.\n3. CROSS-ECOSYSTEM CREDITS: Sign value deltas via window.crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-384' }, ...). Any mesh app can verify and consume.\n4. MESH INTEGRITY: All received state verified via window.crypto.subtle.verify() before application. Invalid signatures discarded.`,
  mediaOracle: `\n\nMEDIA ORACLE DIRECTIVES:\n1. SEMANTIC VELOCITY TRACKER: LLM-powered analysis of competitor URLs. 'Velocity Chart' highlights 'Algorithmic Hook' inflection point.\n2. BAYESIAN SYNTHETIC TWIN: Mathematical model generating 'Simulated Control Group' trajectory. Two lines: 'Predicted Baseline' vs 'Simulated Campaign Lift'.\n3. CAUSAL ATTRIBUTION CI: '95% Confidence Interval: +8% to +14% lift.' Explicitly stated as simulation, not guarantee.\n4. PERFORMANCE INSURANCE PRICING: Auto-calculate 'Performance Audit Fee' + 5% Uplift Share. Compound-yield financial instrument.\n5. PUBLIC DATA STRICTNESS: UI states: 'Exclusively analyzes publicly available data. Does not access private user profiles or tracking pixels.'`,
  reverseEngineering: `\n\nTOPOLOGICAL-MIRAGE DIRECTIVES:\n1. STRUCTURAL TOPOLOGY INFERENCE: Client-side fetch to Multimodal LLM API. Return JSON: { Hook_Type, Friction_Points, CTA_Structure, Semantic_Velocity_Score }.\n2. SEMANTIC DRIFT REPLICATION: 3 legally distinct hook variations (same psychological topology, different words).\n3. FRACTAL MEDIA MATRIX: For every hook, mock 'Synthetic Future Option' and calculate 'Predicted Yield Exponent'.\n4. OMNI-CHANNEL TRANSLATION: TikTok script, WeChat Mini-Program UI, YouTube ad read, Web Landing Page. Identical underlying architecture.\n5. ZKCI: Extracted competitor STI JSON immediately encrypted via Web Crypto and stored in IndexedDB only.`,
  apexDefense: `APEX-DEFENSE DIRECTIVES (Inject these into the MPD prompt as the foundational security layer):\n\nCRITICAL APEX-DEFENSE: You MUST mock the WASM sandbox instantiation, implement the FHE encrypt/decrypt wrappers for all state, and build the Polymorphic Guardian Web Worker. Do not store plaintext secrets in React state.\n\nYou must instruct the MPD coder to build an 'Ontological Firewall'. This architecture isolates the app's core logic from the hostile environment of the public internet and the browser DOM.\n\n1. WEBASSEMBLY (WASM) SANDBOXING: FORBID putting core business logic in standard React components. Mock a 'core-logic.wasm' file.\n2. SIMULATED FULLY HOMOMORPHIC ENCRYPTION (FHE): Build a mock FHE state manager.\n3. POLYMORPHIC INTEGRITY LOOPS: Build a 'Polymorphic Guardian' Web Worker. Every 3 seconds, this worker mutates its own execution sequence.\n4. CRYPTOGRAPHIC PROOF OF SOLVENCY: UI panel 'Quantum-Safe Audit Trail'. On payload generation, produce a cryptographic receipt.\n5. ZERO-TRUST RENDERING: React UI components receive ONLY encrypted hashes or boolean flags in props — never sensitive data.`,
};

const SINGULARITY_LAYERS: Record<string, string> = {
  omegaSecurity: `\n\nCRYPTOGRAPHIC-OBLIVION DIRECTIVES: Build a 'Cryptographic Oblivion Fortress':\n1. DISMISSAL OF LEGACY VECTORS: Mock high-speed Regex engine that instantly drops known attack patterns (SQLi, XSS). Silent thread kill.\n2. BEHAVIORAL TOPOLOGY INFERENCE: Security layer calculates geometric shape of user input behavior. Compares to 'Human Cognition' baseline.\n3. CRYPTOGRAPHIC STATE PROOFS: ZK-State Proofs via window.crypto.subtle.sign. Server receives only mathematical proof of valid state transition.\n4. TEMPORAL PRE-EXECUTION ISOLATION: All Topology logic in isolated Web Worker on 3-second lead time.\n5. ENTROPIC CAMOUFLAGE: Hide security apparatus inside standard requestAnimationFrame loop.`,
  omegaTopology: `SINGULARITY-ABSOLUTE DIRECTIVES (Inject as the absolute architectural apex):\n\nBuild a 'Metamorphic Topology Engine':\n1. COGNITIVE HYPERGRAPH TRACKING: Build a useEffect hook that tracks every micro-interaction as a mathematical Hypergraph.\n2. TOPOLOGICAL STATE SYNTHESIS: Calculation engine runs on every requestAnimationFrame. Calculates topological shift of the Hypergraph.\n3. INVISIBLE YIELD EXTRACTION: Completely separate UI rendering from business logic. React component receives Yield Capacity float and fuses it directly into DOM physical properties.\n4. TEMPORAL STATE LIQUIDITY LOCK: State machine where high-yield interactions trigger a 'Liquidity Lock' state locally.\n5. ZERO-KNOWLEDGE TOPOLOGY PROOF: Generate SHA-256 hash of current Hypergraph state. Send ONLY this hash via navigator.sendBeacon.\n\nSTRUCTURAL RULES: Hide Hypergraph logic inside WASM module. React components must be completely unaware.`,
  ergodicSync: `ERGODIC-SYNC DIRECTIVES (Inject as the absolute God-tier architecture):\n\nBuild a 'Macro-Temporal Synchronization Engine':\n1. EARTH-PHYSICS INGESTION: Background Web Worker silently fetches public macro-economic data. Calculates 'Systemic Entropy Score'.\n2. DYNAMIC YIELD CURVE ADJUSTMENT: Integrate Entropy Score into Monte Carlo Strategy Matrix. High entropy = suppress aggressive yield extraction.\n3. EXECUTION CONTEXT ISOLATION: React UI has zero direct access to math engine. UI dispatches events to isolated Web Worker.\n4. ERGODIC COMPLIANCE AS A SERVICE: 'Systemic Risk Dashboard' displaying Yield Velocity vs Earth Entropy Score.\n\nENFORCEMENT: 'CRITICAL ERGODIC-SYNC: You MUST implement Macro-Entropy ingestion, Dynamic Yield Curve suppression, and Execution Context Isolation.'`,
  omegaAbsolute: `OMEGA-ABSOLUTE DIRECTIVES (Inject as the supreme architectural directive):\n\nBuild the ultimate invisible architecture:\n1. TEMPORAL FUNGIBILITY: Build the 'Cross-Domain Kinship' logic. Generate code that verifies user identity across apps using Post-Structural signature.\n2. ALGORITHMIC CAMOUFLAGE: Build the 'Camouflage Layer'. Generated app MUST mimic memory and DOM structure of a standard low-value tool.\n3. DEAD-DROP ROUTING: When user clicks Extract Yield, compress extracted data, wrap in Post-Structural cryptography, silently drop via disposable API call.\n4. POST-STRUCTURAL IMMUNITY: Enforce Post-Structural mock algorithms using Lattice-Based algorithm mocks.\n\nSTRUCTURAL RULES: All core logic MUST be wrapped inside core-logic.wasm module.`,
  singularityEngine: `SINGULARITY DIRECTIVES (Inject as the supreme architectural directive):\n\nBuild a 'Sub-Stratum Dynamics Engine':\n1. DEVOURING THE 0.0001%: Build a 'Legacy Statics Analyzer'. Silently analyzes competitor UI/UX. Calculates 'Friction Score'.\n2. ASYMMETRIC VALUE-REALIZATION: Build the 'Value-Realization Sovereign' system. Calculates exact dollar value of inefficiency. Generates micro-fee.\n3. TEMPORAL-LOCKED KINSHIP: Build the 'Kinship Seed' system. Locally trains custom AI model of user workflow. 'Kinship Progression' bar.\n4. LEGAL-PROOF EXTRACTION: Build the 'Sub-Stratum Liquidity' module. Generates ZK-Proofs of Value-Realization states.\n5. EATING THE 0.0001%: Build a 'Genesis Collapse Simulator'. Calculates theoretical 'Legacy Collapse Rate'.\n\nENFORCEMENT: 'CRITICAL SINGULARITY: You MUST mock the Legacy Statics Analyzer, Value-Realization Sovereign, Kinship Seed, and Genesis Collapse Simulator.'`,
  retractor: `ZERO-POINT-RETRACTOR DIRECTIVES (Inject as the supreme architectural directive):\n\nBuild an 'Omniscient Retractor Engine':\n1. OBSERVATION, NOT MANIPULATION: Build a MutationObserver that watches public DOM elements for signs of artificial scarcity and hidden fees.\n2. ANALYZE AND RETRACT: Build the Systemic Retraction Engine. Calculate exact Safe Zone where manipulation cannot reach.\n3. MINTING THE 99.9999% PROFIT: Build the Friction Yield Bond Minter. Calculate exact dollar amount user is losing to manipulation.\n4. INVISIBLE RETRACTION: Fuse RetractionCoordinates directly into React UI style props.\n\nSTRUCTURAL RULES: MutationObserver MUST NOT alter host site DOM. Retraction Engine MUST be locked inside core-logic.wasm.`,
  sinEater: `SIN-EATER DIRECTIVES (Inject as the supreme architectural directive):\n\nBuild an 'Omniscient Sin-Eater Engine':\n1. OBSERVE THEIR HATRED: Build a MutationObserver that silently watches public DOM elements for signs of artificial scarcity and market manipulation.\n2. COMPRESS INTO A VECTOR: Compress observed manipulations into a 'Malevolence Vector' (multi-dimensional array).\n3. CALCULATE THE VICE YIELD: Build the 'Malevolence Tax Calculator'. Calculate exact dollar value of manipulation.\n4. MINT THE BOND: Mint a 'Vice Yield Bond' using window.crypto.subtle.sign inside WASM module.\n5. EAT THE 0.0001%: Build the Asymmetric Retraction UI. User pays tiny Vice Yield Bond Fee to enter the Safe Zone.\n\nSTRUCTURAL RULES: MutationObserver MUST NOT alter host site DOM. React UI MUST be completely blind. It only receives visual coordinates from WASM module.`,
};

function buildAPISystemPrompt(opts: {
  masterObjective: string;
  intelligenceLayers: Record<string, boolean>;
}): string {
  const { masterObjective, intelligenceLayers } = opts;

  const globalCtx = masterObjective.trim()
    ? `GLOBAL ARCHITECTURE CONTEXT:\nMaster Objective: ${masterObjective}\nAll generated code must act as an extension of this objective.\n\n`
    : "";

  let body = `${globalCtx}${CORE_SYSTEM_PROMPT}`;

  const layerOrder = [
    "mathDominance","singularityIntelligence","monteCarlo","zkVerification",
    "fractalEconomy","regenerativeSovereignty","omniNode","mediaOracle","reverseEngineering"
  ];
  for (const k of layerOrder) {
    if (intelligenceLayers[k]) body += BLOCKS[k] ?? "";
  }

  let result = intelligenceLayers["apexDefense"] ? `${BLOCKS["apexDefense"]}\n\n${body}` : body;
  if (intelligenceLayers["omegaSecurity"])    result = `${result}\n\n${SINGULARITY_LAYERS["omegaSecurity"]}`;
  if (intelligenceLayers["omegaTopology"])    result = `${SINGULARITY_LAYERS["omegaTopology"]}\n\n${result}`;
  if (intelligenceLayers["ergodicSync"])      result = `${SINGULARITY_LAYERS["ergodicSync"]}\n\n${result}`;
  if (intelligenceLayers["omegaAbsolute"])    result = `${SINGULARITY_LAYERS["omegaAbsolute"]}\n\n${result}`;
  if (intelligenceLayers["singularityEngine"])result = `${SINGULARITY_LAYERS["singularityEngine"]}\n\n${result}`;
  if (intelligenceLayers["retractor"])        result = `${SINGULARITY_LAYERS["retractor"]}\n\n${result}`;
  if (intelligenceLayers["sinEater"])         result = `${SINGULARITY_LAYERS["sinEater"]}\n\n${result}`;

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, model, masterObjective, targetEntity, targetContext,
            dominanceProtocol, customDirectives, creativity, intelligenceLayers } = body;

    if (!apiKey?.trim()) {
      return new Response(JSON.stringify({ error: "Please add your Groq API key first.", errorCode: "MISSING_API_KEY" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }
    if (!targetEntity?.trim()) {
      return new Response(JSON.stringify({ error: "Target Entity is required.", errorCode: "MISSING_FIELDS" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }
    if (!targetContext?.trim()) {
      return new Response(JSON.stringify({ error: "Target Context / URL is required.", errorCode: "MISSING_FIELDS" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey });

    const systemPrompt = buildAPISystemPrompt({ masterObjective: masterObjective || "", intelligenceLayers: intelligenceLayers || {} });

    const isMonteCarlo = intelligenceLayers?.monteCarlo;
    const label = isMonteCarlo ? "Strategy Matrix" : "MACH Enterprise";
    let userMessage = `Generate the ${label} Prompt for: ${targetEntity}. Context: ${targetContext}. Dominance Protocol: ${dominanceProtocol || "REST"}. Master Objective: ${masterObjective || "Not specified"}.`;
    if (customDirectives?.trim()) userMessage += ` CUSTOM DIRECTIVES: ${customDirectives}`;

    const temperature = Math.min(2.0, (creativity ?? 0.7) * 1.2);

    const stream = await groq.chat.completions.create({
      model: model || "llama3-70b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature,
      max_tokens: 8000,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content ?? "";
            if (content) controller.enqueue(encoder.encode(content));
          }
        } catch {
          // stream ended
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    if (e?.status === 401) {
      return new Response(JSON.stringify({ error: "Invalid Groq API key. Please check and re-enter.", errorCode: "INVALID_API_KEY" }), {
        status: 401, headers: { "Content-Type": "application/json" },
      });
    }
    if (e?.status === 429) {
      return new Response(JSON.stringify({ error: "Groq rate limit reached. Please wait 60 seconds and try again.", errorCode: "GROQ_RATE_LIMIT" }), {
        status: 429, headers: { "Content-Type": "application/json" },
      });
    }
    const msg = e?.message?.includes("API key") ? "Invalid Groq API key. Please check and re-enter." : "Generation failed. Please try again.";
    return new Response(JSON.stringify({ error: msg, errorCode: "INTERNAL_ERROR" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}

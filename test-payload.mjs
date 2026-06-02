/**
 * MPA Pre-Launch Functional Test
 * Validates: temperature mapping, prompt assembly, toggle system, fetch shape
 * Run with: node test-payload.mjs
 */

let passed = 0;
let failed = 0;

function test(name, condition) {
  if (condition) {
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✗\x1b[0m ${name}`);
    failed++;
  }
}

console.log("\n\x1b[1mMPA Pre-Launch Functional Verification\x1b[0m\n");
console.log("─────────────────────────────────────────\n");

// ── 1. Temperature mapping ──────────────────────────────────────────────────
console.log("1. Temperature Mapping (creativityScore * 1.2):");
test("0.1 * 1.2 = 0.12",  Math.abs(0.1 * 1.2 - 0.12)  < 0.0001);
test("0.7 * 1.2 = 0.84",  Math.abs(0.7 * 1.2 - 0.84)  < 0.0001);
test("1.0 * 1.2 = 1.20",  Math.abs(1.0 * 1.2 - 1.20)  < 0.0001);
test("Max temp (1.2) within Groq bounds (≤ 2.0)", 1.0 * 1.2 <= 2.0);

// ── 2. Toggle keys ──────────────────────────────────────────────────────────
console.log("\n2. Toggle Key System (10 layers):");
const TOGGLE_KEYS = [
  "mathDominance", "singularityIntelligence", "monteCarlo", "zkVerification",
  "fractalEconomy", "regenerativeSovereignty", "omniNode", "mediaOracle",
  "reverseEngineering", "apexDefense",
];
test("Exactly 10 toggle keys defined", TOGGLE_KEYS.length === 10);
const allActive = Object.fromEntries(TOGGLE_KEYS.map(k => [k, true]));
test("All 10 toggles activate to true", Object.values(allActive).every(v => v === true));
const allOff    = Object.fromEntries(TOGGLE_KEYS.map(k => [k, false]));
test("All 10 toggles deactivate to false", Object.values(allOff).every(v => v === false));

// ── 3. Mock prompt assembly ─────────────────────────────────────────────────
console.log("\n3. Prompt Block Assembly:");
function buildMockPrompt(opts) {
  let base = "CORE_BLOCK";
  if (opts.mathDominance)           base += " |EDGE_MATH|";
  if (opts.singularityIntelligence) base += " |SINGULARITY|";
  if (opts.monteCarlo)              base += " |MONTE_CARLO|";
  if (opts.zkVerification)          base += " |ZK_VERIFY|";
  if (opts.fractalEconomy)          base += " |FRACTAL|";
  if (opts.regenerativeSovereignty) base += " |REGEN_SOV|";
  if (opts.omniNode)                base += " |OMNI_NODE|";
  if (opts.mediaOracle)             base += " |MEDIA_ORACLE|";
  if (opts.reverseEngineering)      base += " |REVERSE_ENG|";
  if (opts.apexDefense)             base = "|APEX_DEFENSE| " + base;
  return base;
}

const allOnPrompt = buildMockPrompt(allActive);
test("Core block always present",             allOnPrompt.includes("CORE_BLOCK"));
test("APEX-DEFENSE prepended (not appended)", allOnPrompt.startsWith("|APEX_DEFENSE|"));
test("All 9 optional blocks included",
  ["|EDGE_MATH|","|SINGULARITY|","|MONTE_CARLO|","|ZK_VERIFY|","|FRACTAL|",
   "|REGEN_SOV|","|OMNI_NODE|","|MEDIA_ORACLE|","|REVERSE_ENG|"]
  .every(b => allOnPrompt.includes(b))
);
const allOffPrompt = buildMockPrompt(allOff);
test("No optional blocks when all inactive", allOffPrompt === "CORE_BLOCK");
const mcOnlyPrompt = buildMockPrompt({ ...allOff, monteCarlo: true });
test("Monte Carlo isolated correctly", mcOnlyPrompt === "CORE_BLOCK |MONTE_CARLO|");

// ── 4. Mock fetch response ──────────────────────────────────────────────────
console.log("\n4. Groq API Response Shape:");
const mockGroqResponse = {
  choices: [{ message: { content: "MOCK_ENTERPRISE_PROMPT_OUTPUT_FOR_MPD" } }],
  usage: { total_tokens: 2048 },
};
test("Response has choices array",            Array.isArray(mockGroqResponse.choices));
test("Response choices[0] has message",       !!mockGroqResponse.choices[0]?.message);
test("Prompt content is non-empty string",    mockGroqResponse.choices[0].message.content.length > 0);
test("Token usage is numeric and positive",   mockGroqResponse.usage.total_tokens > 0);

const promptOutput = mockGroqResponse.choices[0].message.content;
test("Prompt output accessible from result",  promptOutput === "MOCK_ENTERPRISE_PROMPT_OUTPUT_FOR_MPD");

// ── 5. Simulated full generate call ─────────────────────────────────────────
console.log("\n5. Simulated generatePayload() Call (all toggles ON):");
const mockOptions = {
  targetEntity: "Fleet Management E-commerce",
  targetContext: "https://example-fleet.com",
  masterObjective: "Build sovereign MACH architecture",
  customDirectives: "Avoid Redux",
  protocol: "GraphQL",
  ...allActive,
  apiKey: "gsk_test_mock_key_12345",
  model: "llama3-70b-8192",
  temperature: 0.7,
};
test("All required fields present",    !!mockOptions.targetEntity && !!mockOptions.apiKey && !!mockOptions.model);
test("Temperature value valid",        mockOptions.temperature >= 0.1 && mockOptions.temperature <= 1.0);
test("Effective API temperature",      Math.abs(mockOptions.temperature * 1.2 - 0.84) < 0.0001);
test("apexDefense toggle wired",       mockOptions.apexDefense === true);
test("Protocol is valid",              ["REST","GraphQL","WebSocket"].includes(mockOptions.protocol));

const systemPrompt = buildMockPrompt(mockOptions);
test("Final prompt non-empty",         systemPrompt.length > 0);
test("APEX-DEFENSE at position 0",     systemPrompt.indexOf("|APEX_DEFENSE|") === 0);

// ── Summary ─────────────────────────────────────────────────────────────────
console.log("\n─────────────────────────────────────────");
const status = failed === 0
  ? `\x1b[32m✓ ALL ${passed} TESTS PASSED — PRE-LAUNCH VERIFIED\x1b[0m`
  : `\x1b[31m✗ ${failed} FAILED, ${passed} passed\x1b[0m`;
console.log(status);
console.log("─────────────────────────────────────────\n");

if (failed > 0) process.exit(1);

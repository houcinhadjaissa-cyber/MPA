export interface IndustryTemplate {
  id: string;
  label: string;
  entity: string;
  context: string;
  masterObjective: string;
  protocol: string;
  layers: Record<string, boolean>;
}

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    id: "fleet-management", label: "Fleet Management",
    entity: "Fleet Management E-commerce",
    context: "A Next.js Shopify storefront selling commercial vehicle parts and extended service contracts.",
    masterObjective: "Build a real-time fleet tracking and management platform with GPS monitoring, predictive maintenance, and SLA-backed service contracts.",
    protocol: "websocket", layers: { mathDominance: true, monteCarlo: true },
  },
  {
    id: "grocery", label: "Grocery / Fresh Food",
    entity: "Grocery E-commerce",
    context: "A Shopify grocery store with perishable goods and same-day delivery.",
    masterObjective: "Build a fresh food inventory management and delivery platform with expiration tracking, demand forecasting, and dynamic pricing.",
    protocol: "rest", layers: { mediaOracle: true, fractalEconomy: true },
  },
  {
    id: "medical", label: "Medical Device",
    entity: "Bio-Medical Device Distributor",
    context: "A WooCommerce site selling FDA-regulated Class II medical devices to hospital procurement.",
    masterObjective: "Build a medical device compliance and monitoring platform with FDA audit trails, 21 CFR Part 11 compliance, and UDI tracking.",
    protocol: "graphql", layers: { apexDefense: true, zkVerification: true, regenerativeSovereignty: true },
  },
  {
    id: "realestate", label: "Real Estate SaaS",
    entity: "Commercial Real Estate SaaS",
    context: "A React + Supabase platform for property managers tracking maintenance and lease lifecycle.",
    masterObjective: "Build a commercial real estate SaaS with tenant portals, lease lifecycle management, and AI-powered maintenance routing.",
    protocol: "graphql", layers: { singularityIntelligence: true, mediaOracle: true },
  },
  {
    id: "automotive", label: "Automotive Parts",
    entity: "OEM Automotive Parts Marketplace",
    context: "A Vue.js marketplace for OEM and aftermarket parts with VIN-based fitment lookup.",
    masterObjective: "Build an automotive parts catalog and supply chain system with VIN decoder, fitment compatibility, and B2B dealer portals.",
    protocol: "rest", layers: { mathDominance: true, fractalEconomy: true },
  },
  {
    id: "energy", label: "Energy / Industrial",
    entity: "Industrial IoT Asset Platform",
    context: "A Next.js + AWS IoT platform for oil & gas operators monitoring pump-jack uptime.",
    masterObjective: "Build an energy monitoring and industrial IoT platform with real-time sensor telemetry and predictive failure detection.",
    protocol: "websocket", layers: { monteCarlo: true, mathDominance: true, singularityIntelligence: true },
  },
  {
    id: "fintech", label: "FinTech Banking",
    entity: "Digital Banking Platform",
    context: "A neobank platform with KYC/AML compliance, multi-currency accounts, and open banking APIs.",
    masterObjective: "Build a digital banking platform with KYC/AML compliance, real-time fraud detection, and AI-powered financial health scoring.",
    protocol: "graphql", layers: { zkVerification: true, apexDefense: true, singularityIntelligence: true, monteCarlo: true },
  },
  {
    id: "edtech", label: "EdTech LMS",
    entity: "AI-Powered Learning Management System",
    context: "A Next.js + PostgreSQL LMS platform with adaptive learning paths and video courses.",
    masterObjective: "Build a learning management system with AI-powered adaptive learning, spaced repetition, and gamification mechanics.",
    protocol: "websocket", layers: { mediaOracle: true, mathDominance: true },
  },
  {
    id: "healthtech", label: "HealthTech Telemedicine",
    entity: "Telemedicine & Remote Patient Monitoring",
    context: "A HIPAA-compliant telehealth platform with video consultations and RPM device integrations.",
    masterObjective: "Build a telemedicine platform with HIPAA-compliant video consultations, remote patient monitoring, and AI-powered symptom triage.",
    protocol: "websocket", layers: { apexDefense: true, zkVerification: true, regenerativeSovereignty: true },
  },
  {
    id: "ecommerce", label: "E-Commerce Marketplace",
    entity: "Multi-Vendor E-Commerce Marketplace",
    context: "A React + Node.js multi-vendor marketplace with real-time inventory and vendor management.",
    masterObjective: "Build a multi-vendor marketplace with real-time inventory sync, dynamic pricing, and revenue share automation.",
    protocol: "rest", layers: { monteCarlo: true, fractalEconomy: true, mediaOracle: true },
  },
  {
    id: "analytics", label: "SaaS Analytics",
    entity: "Real-Time SaaS Analytics Dashboard",
    context: "A Next.js + ClickHouse analytics platform for SaaS companies tracking product usage and revenue.",
    masterObjective: "Build a real-time analytics platform with custom metric builders, cohort analysis, and automated insight generation.",
    protocol: "websocket", layers: { singularityIntelligence: true, mathDominance: true, mediaOracle: true },
  },
  {
    id: "devops", label: "DevOps Platform",
    entity: "CI/CD Pipeline Management Platform",
    context: "A Next.js + Kubernetes platform for managing CI/CD pipelines and deployment automation.",
    masterObjective: "Build a CI/CD pipeline management platform with deployment automation, multi-cloud orchestration, and DORA metrics.",
    protocol: "websocket", layers: { apexDefense: true, mathDominance: true, monteCarlo: true },
  },
];

export const DOMINANCE_PROTOCOLS = [
  { id: "rest",         label: "Standard REST (Passive)",  description: "Traditional request-response architecture" },
  { id: "websocket",    label: "WebSocket (Dominant)",      description: "Real-time bidirectional communication" },
  { id: "graphql",      label: "GraphQL (Sovereign)",       description: "Query-driven API with full type safety" },
  { id: "event-driven", label: "Event-Driven CQRS",         description: "Command Query Responsibility Segregation" },
  { id: "hybrid",       label: "Hybrid Multi-Protocol",     description: "REST + WebSocket + GraphQL unified" },
];

export const AI_MODELS = [
  { id: "llama-3.3-70b-versatile", label: "GLM-4 Flash", badge: "FASTEST",  provider: "groq",   description: "Powered by Groq · Llama 3.3 70B" },
  { id: "llama3-70b-8192",         label: "GLM-4 Plus",  badge: "POWERFUL", provider: "groq",   description: "Powered by Groq · LLaMA 3 70B" },
  { id: "llama3-8b-8192",          label: "LLaMA 3 8B",  badge: "FAST",     provider: "groq",   description: "Powered by Groq · LLaMA 3 8B" },
  { id: "mixtral-8x7b-32768",      label: "Mixtral 8x7B",badge: "BALANCED", provider: "groq",   description: "Powered by Groq · Mixtral 8x7B" },
  { id: "gpt-4o-mini",             label: "GPT-4o Mini", badge: "FAST",     provider: "openai", description: "OpenAI · GPT-4o Mini" },
  { id: "gpt-4o",                  label: "GPT-4o",      badge: "POWERFUL", provider: "openai", description: "OpenAI · GPT-4o" },
];

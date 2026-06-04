import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const templates = [
    {
      id: "fleet-management", name: "Fleet Management", industry: "Logistics",
      entity: "Fleet Management E-commerce",
      context: "A Next.js Shopify storefront selling commercial vehicle parts and extended service contracts: https://example-fleet.com",
      masterObjective: "Build a real-time fleet tracking and management platform with GPS monitoring, predictive maintenance scheduling, fuel optimization, and SLA-backed service contract management for commercial vehicle operators.",
      protocol: "WebSocket", creativity: 0.7,
      intelligenceLayers: { mathDominance: true, monteCarlo: true },
    },
    {
      id: "grocery-fresh-food", name: "Grocery / Fresh Food", industry: "Food & Beverage",
      entity: "Grocery E-commerce",
      context: "A standard Shopify grocery store with perishable goods and same-day delivery: https://example-grocery.com",
      masterObjective: "Build a fresh food inventory management and delivery platform with expiration tracking, demand forecasting, dynamic pricing, and route optimization for same-day perishable delivery.",
      protocol: "REST", creativity: 0.6,
      intelligenceLayers: { mediaOracle: true, fractalEconomy: true },
    },
    {
      id: "medical-device", name: "Medical Device", industry: "Healthcare",
      entity: "Bio-Medical Device Distributor",
      context: "A WooCommerce site selling FDA-regulated Class II medical devices to hospital procurement: https://example-meddevice.com",
      masterObjective: "Build a medical device compliance and monitoring platform with FDA audit trails, 21 CFR Part 11 compliance, UDI tracking, hospital procurement workflows, and post-market surveillance dashboards.",
      protocol: "GraphQL", creativity: 0.5,
      intelligenceLayers: { apexDefense: true, zkVerification: true, regenerativeSovereignty: true },
    },
    {
      id: "real-estate-saas", name: "Real Estate SaaS", industry: "PropTech",
      entity: "Commercial Real Estate SaaS",
      context: "A React + Supabase platform for property managers tracking maintenance and lease lifecycle: https://example-cre.com",
      masterObjective: "Build a commercial real estate property management SaaS with tenant portals, lease lifecycle management, AI-powered maintenance request routing, financial reporting, and cap rate optimization analytics.",
      protocol: "GraphQL", creativity: 0.7,
      intelligenceLayers: { singularityIntelligence: true, mediaOracle: true },
    },
    {
      id: "automotive-parts", name: "Automotive Parts", industry: "Manufacturing",
      entity: "OEM Automotive Parts Marketplace",
      context: "A Vue.js marketplace for OEM and aftermarket parts with VIN-based fitment lookup: https://example-autoparts.com",
      masterObjective: "Build an automotive parts catalog and supply chain management system with VIN decoder, fitment compatibility engine, real-time inventory across 200+ warehouses, dynamic pricing, and B2B dealer portals.",
      protocol: "REST", creativity: 0.6,
      intelligenceLayers: { mathDominance: true, fractalEconomy: true },
    },
    {
      id: "energy-industrial", name: "Energy / Industrial", industry: "Energy",
      entity: "Industrial IoT Asset Platform",
      context: "A Next.js + AWS IoT platform for oil & gas operators monitoring pump-jack uptime: https://example-iot.com",
      masterObjective: "Build an energy monitoring and industrial IoT management platform with real-time sensor telemetry, predictive failure detection using ML anomaly detection, SCADA integration, and regulatory compliance reporting.",
      protocol: "WebSocket", creativity: 0.7,
      intelligenceLayers: { monteCarlo: true, mathDominance: true, singularityIntelligence: true },
    },
    {
      id: "fintech-banking", name: "FinTech Banking", industry: "Finance",
      entity: "Digital Banking Platform",
      context: "A neobank platform with full KYC/AML compliance, multi-currency accounts, and open banking APIs: https://example-fintech.com",
      masterObjective: "Build a digital banking platform with KYC/AML compliance workflows, real-time fraud detection, multi-currency wallets, open banking API integration (PSD2/PSD3), and AI-powered financial health scoring.",
      protocol: "GraphQL", creativity: 0.6,
      intelligenceLayers: { zkVerification: true, apexDefense: true, singularityIntelligence: true, monteCarlo: true },
    },
    {
      id: "edtech-lms", name: "EdTech LMS", industry: "Education",
      entity: "AI-Powered Learning Management System",
      context: "A Next.js + PostgreSQL LMS platform with adaptive learning paths, video courses, and assessment tools: https://example-edtech.com",
      masterObjective: "Build a learning management system with AI-powered adaptive learning paths, spaced repetition algorithms, real-time collaboration, instructor analytics, SCORM/xAPI compliance, and gamification mechanics.",
      protocol: "WebSocket", creativity: 0.8,
      intelligenceLayers: { mediaOracle: true, mathDominance: true },
    },
    {
      id: "healthtech-telemed", name: "HealthTech Telemedicine", industry: "Healthcare",
      entity: "Telemedicine & Remote Patient Monitoring",
      context: "A HIPAA-compliant telehealth platform with video consultations and RPM device integrations: https://example-telemed.com",
      masterObjective: "Build a telemedicine platform with HIPAA-compliant video consultations, remote patient monitoring device integration, AI-powered symptom triage, e-prescription workflows, and clinical outcome tracking.",
      protocol: "WebSocket", creativity: 0.5,
      intelligenceLayers: { apexDefense: true, zkVerification: true, regenerativeSovereignty: true },
    },
    {
      id: "ecommerce-marketplace", name: "E-Commerce Marketplace", industry: "Retail",
      entity: "Multi-Vendor E-Commerce Marketplace",
      context: "A React + Node.js multi-vendor marketplace with real-time inventory and vendor management: https://example-marketplace.com",
      masterObjective: "Build a multi-vendor marketplace with real-time inventory sync, dynamic pricing engine, seller reputation scoring, AI-powered product recommendations, dispute resolution workflows, and revenue share automation.",
      protocol: "REST", creativity: 0.7,
      intelligenceLayers: { monteCarlo: true, fractalEconomy: true, mediaOracle: true },
    },
    {
      id: "saas-analytics", name: "SaaS Analytics", industry: "Business Intelligence",
      entity: "Real-Time SaaS Analytics Dashboard",
      context: "A Next.js + ClickHouse analytics platform for SaaS companies tracking product usage and revenue metrics: https://example-analytics.com",
      masterObjective: "Build a real-time analytics platform with custom metric builders, cohort analysis, funnel visualization, anomaly detection, A/B test significance calculators, and automated insight generation using LLMs.",
      protocol: "WebSocket", creativity: 0.8,
      intelligenceLayers: { singularityIntelligence: true, mathDominance: true, mediaOracle: true },
    },
    {
      id: "devops-platform", name: "DevOps Platform", industry: "Developer Tools",
      entity: "CI/CD Pipeline Management Platform",
      context: "A Next.js + Kubernetes platform for managing CI/CD pipelines, deployment automation, and infrastructure observability: https://example-devops.com",
      masterObjective: "Build a CI/CD pipeline management platform with deployment automation, infrastructure-as-code templates, multi-cloud orchestration, real-time log streaming, incident correlation, and DORA metrics dashboards.",
      protocol: "WebSocket", creativity: 0.7,
      intelligenceLayers: { apexDefense: true, mathDominance: true, monteCarlo: true },
    },
  ];

  return NextResponse.json({ templates });
}

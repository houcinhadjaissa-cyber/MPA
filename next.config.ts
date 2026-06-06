import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  allowedDevOrigins: ["*.replit.dev", "*.worf.replit.dev", "*.repl.co", "*.picard.replit.dev"],
};

export default nextConfig;

import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "MPA — Master Plan Architect",
  description: "Surgical payload generation for every industry.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className="bg-[#1C1C1E] text-white antialiased"
        style={{ fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" }}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}

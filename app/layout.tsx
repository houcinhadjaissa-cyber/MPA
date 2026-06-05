import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MPA Terminal — Master Plan Architect",
  description:
    "Surgical prompt generation for every industry. MACH · Sovereign · Monte Carlo · ZK · Fractal · Media Oracle · APEX-DEFENSE",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="bg-[#0a0a0a] text-white antialiased"
        style={{ fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', 'Fira Code', monospace" }}
      >
        {children}
      </body>
    </html>
  );
}

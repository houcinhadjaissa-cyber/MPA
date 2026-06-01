import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MPA — Master Plan Architect",
  description: "Surgical payload generation for every industry.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface-black text-body-on-dark font-body antialiased">
        {children}
      </body>
    </html>
  );
}

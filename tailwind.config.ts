import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter:   ["Inter", "sans-serif"],
        display: ["SF Pro Display", "system-ui", "-apple-system", "sans-serif"],
        body:    ["SF Pro Text",    "system-ui", "-apple-system", "sans-serif"],
        mono:    ["SF Mono", "ui-monospace", "Menlo", "monospace"],
      },
      colors: {
        "surface-black": "#000000",
        "surface-tile-1": "#1C1C1E",
        "surface-tile-2": "#2C2C2E",
        "surface-tile-3": "#3A3A3C",
        "body-on-dark":  "#F5F5F7",
        "body-muted":    "#86868B",
        "primary-on-dark": "#2997FF",
        "success":  "#30D158",
        "error":    "#FF453A",
        "warning":  "#FFD60A",
      },
    },
  },
  plugins: [],
};

export default config;

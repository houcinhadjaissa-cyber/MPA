---
name: Next.js Vercel deployment constraint
description: Replit only allows next@16.x (custom build); Vercel needs next@14.2.22. Stack details for Vercel-safe builds.
---

## Rule
Replit's npm firewall blocks ALL standard Next.js versions (14.x, 15.x, and the public 16.x). Only Replit's internal `next@16.2.7` can be installed on Replit via `installLanguagePackages`. For Vercel, use `next@14.2.22` (exact pin) in package.json.

**Why:** Replit distributes a custom/patched Next.js 16.x build that is not on the public npm registry. Vercel uses the public registry. The "Exit handler never called!" crash on Vercel was caused by npm trying to download the non-existent Replit-custom next.

**How to apply:**
- Set `"next": "14.2.22"` (exact) in package.json for Vercel.
- Dev server on Replit uses whichever next is in node_modules (16.2.7) — no conflict since npm install is not run on Replit.
- If next gets accidentally removed from node_modules, restore with `installLanguagePackages({ language: "nodejs", packages: ["next@16.2.7"] })`.
- The `eslint` key in next.config.js gives a warning in next@16 (dev) but is VALID in next@14 (Vercel build).

## Vercel-Safe Stack (confirmed working)
- `next`: `14.2.22` (exact pin)
- `react` / `react-dom`: `^18.3.1`
- `tailwindcss`: `^3.4.16` (v3, NOT v4)
- `next.config.js` (NOT .ts or .mjs, use `module.exports`)
- `postcss.config.js` with `{ tailwindcss: {}, autoprefixer: {} }` (NOT `@tailwindcss/postcss`)
- `globals.css` with `@tailwind base; @tailwind components; @tailwind utilities;` (NOT `@import "tailwindcss"`)
- `tsconfig.json` with `"jsx": "preserve"` (next@16 forces it back to react-jsx, but preserve is correct for next@14 on Vercel)
- NO `output: "standalone"` in next.config.js (breaks standard Vercel deployment)
- NO `engines` field in package.json
- groq-sdk `^0.5.0` (API compatible with 1.x for basic chat.completions.create usage)

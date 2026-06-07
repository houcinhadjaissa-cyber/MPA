---
name: Next.js Vercel deployment constraint
description: Next.js 16.x is a Replit-internal build not on public npm; use next@15.3.3 in package.json for Vercel deployments.
---

## Rule
`next@16.x` (e.g. 16.2.7) exists ONLY in Replit's internal registry. Vercel cannot install it — results in "Exit handler never called!" npm crash. Always target `next@15.3.3` (or latest stable 15.x) in `package.json` for Vercel.

**Why:** Replit bundles a custom/canary Next.js build that is not published to the public npm registry. Vercel uses the public registry and cannot resolve the package.

**How to apply:**
- Set `"next": "15.3.3"` (exact pin) in package.json.
- Do NOT run `npm install` on Replit after changing next version — Replit's security firewall blocks downloading standard next@15.x. The existing node_modules (next@16.x) will run the dev server fine.
- Add `.npmrc` with `legacy-peer-deps=true` and `audit=false`.
- Add `vercel.json` with explicit `framework: "nextjs"` and `buildCommand: "npm run build"`.
- The `eslint` key in `next.config.ts` is valid in Next.js 15 but triggers a warning in Next.js 16. Safe to keep for Vercel compatibility.

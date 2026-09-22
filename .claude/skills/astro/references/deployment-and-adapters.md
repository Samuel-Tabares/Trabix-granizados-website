# Deployment and Rendering Modes

Open this when choosing or debugging static vs on-demand (SSR) rendering, picking a
deployment adapter, or diagnosing "works in dev, breaks in production" for request-dependent
code (cookies, redirects, `Astro.request`, streaming).

## Two rendering modes

| Mode | Config | Behavior |
|---|---|---|
| **Static** (default) | `output: 'static'` (implicit default) | Entire site pre-rendered to HTML at build time. No adapter required for pure static hosting. Fastest, cheapest, but no per-request logic. |
| **On-demand (server)** | `output: 'server'` | Every route rendered per-request by default. Use `export const prerender = true` on specific pages to keep them static within an otherwise-dynamic site. |
| **Hybrid (static default, opt-out per page)** | `output: 'static'` + `export const prerender = false` on specific routes | Most pages stay static; only the routes that need request-time logic opt into on-demand rendering. Usually the better default for mixed sites. |

## Adapters (required for any on-demand rendering)

On-demand rendering needs a server adapter matching the deploy target:

| Adapter | Target |
|---|---|
| `@astrojs/vercel` | Vercel (Functions/Edge) |
| `@astrojs/netlify` | Netlify Functions/Edge |
| `@astrojs/node` | Any Node.js host (VPS, Docker, etc.) |
| `@astrojs/cloudflare` | Cloudflare Pages/Workers |

```bash
npx astro add vercel   # installs the adapter and wires astro.config.mjs
```

Pure static sites need **no adapter at all** — most hosts (Vercel, Netlify, GitHub Pages,
Cloudflare Pages) serve a static `dist/` output directly.

## Common mistake: adding an adapter to "fix" a static-export bug

If a static build has a bug (missing page, broken data, wrong asset path), adding a server
adapter does not address the root cause — it changes the project's architecture from static
to server-rendered, with new implications (cold starts, function limits, hosting cost model).
Only add an adapter when a route genuinely needs request-time behavior: reading cookies,
personalizing per-visitor content, handling form POSTs server-side, or streaming HTML.

## Vercel-specific notes

- Static sites: push to a connected Git branch; Vercel auto-detects Astro, no config needed.
- On-demand rendering: `npx astro add vercel`, then Vercel deploys the adapter's
  Functions/Edge output automatically.
- `vercel.json` is only needed for overrides (custom headers, redirects not expressible in
  Astro config).
- CLI deploy: install Vercel CLI, run `vercel`; when prompted to override detected settings,
  decline — Astro auto-detection is reliable.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Cookies/redirects work in `astro dev` but not in the deployed static site | Static output has no server to run request-time code | Add a matching adapter and mark the route `export const prerender = false` (hybrid) or set `output: 'server'`. |
| Deployed site behaves like a Node/serverless function unexpectedly, cold-starts | An adapter was added when the site could have stayed fully static | Remove the adapter and set `output: 'static'` if no route actually needs on-demand rendering. |
| Build succeeds locally, adapter-specific errors only in CI/host | Adapter version mismatch with the platform's runtime, or missing platform-specific env vars | Re-run `npx astro add <adapter>` to resync versions; check the adapter's own platform requirements page. |

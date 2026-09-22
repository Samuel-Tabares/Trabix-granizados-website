---
name: astro
description: >
  Work with the Astro framework — initializing a new project, file-based routing, layouts
  and components, content collections, interactive "islands" with client directives,
  integrations (astro add), Tailwind CSS setup (v3 vs v4 differ), image optimization, and
  choosing/configuring a deployment adapter (static vs on-demand/SSR; Vercel, Netlify, Node,
  Cloudflare). Use for "start an Astro project", "add a page/route in Astro", "Astro content
  collections", "Astro islands not interactive", "astro add", "deploy Astro to X", or any
  Astro build/hydration/rendering error.
---

# Astro

Astro is a content-focused web framework: static HTML by default, with optional per-page
opt-in to interactivity (islands) and server rendering. Most bugs reported against Astro
projects trace back to one of three mismatches: **wrong rendering mode for the feature**,
**wrong Tailwind setup for the installed version**, or **missing hydration directive**.
Check those three before anything else.

## Initialize a new project

```bash
npm create astro@latest                                   # interactive wizard
npm create astro@latest -- --add react --add tailwind     # preselect integrations
npm create astro@latest -- --template <example-or-github-repo>
npx astro add <integration>                                # add one later
```

Requires **Node 22.12+** (odd-numbered versions like v23 are unsupported by the CLI).

## Project structure

| Path | Purpose |
|---|---|
| `src/pages/` | Required — file-based routing. `.astro`, `.md`, `.mdx` files become routes. |
| `src/components/` | Reusable `.astro` or framework components. |
| `src/layouts/` | Shared page shells (`<slot />` for page content). |
| `src/content.config.ts` | Content Collections definitions (Content Layer API). |
| `public/` | Copied verbatim, unprocessed — favicons, `robots.txt`, anything not needing build steps. |
| `astro.config.mjs` (or `.ts`/`.js`) | Integrations, `output` mode, adapter, build options. |

## Common tasks — where to look

| Task | Read |
|---|---|
| Model structured content (blog, docs, product list) | `references/content-collections.md` |
| Add an interactive component (cart, form, calendar) | `references/islands-and-client-directives.md` |
| Set up or debug Tailwind CSS | `references/styling-tailwind.md` |
| Choose/configure static vs SSR and a hosting adapter | `references/deployment-and-adapters.md` |
| Add a route: static `src/pages/about.astro`, dynamic `src/pages/blog/[slug].astro`, catch-all `[...slug].astro` | inline — no reference needed, standard file-based routing |
| Add an official integration (React, Vue, MDX, sitemap, partytown) | `npx astro add <name>`, updates `astro.config.mjs` automatically |
| Optimize an image | use `<Image />` / `<Picture />` from `astro:assets` for anything in `src/`; only use `public/` + plain `<img>` for assets that must be served byte-for-byte |
| Debug a hydration/build error | check the three mismatches above, then the matching reference's troubleshooting section |

## Known issues and workarounds

| Symptom | Cause | Fix |
|---|---|---|
| Tailwind classes silently not applying, or a build error naming `@astrojs/tailwind` | Wrong integration for the installed Tailwind major version | v4 → `@tailwindcss/vite` + `@import "tailwindcss";` in CSS. v3 → `@astrojs/tailwind`. Never both. See `references/styling-tailwind.md`. |
| Zod schema / "collection not found" errors on a new content collection | Using the pre-Astro-5 implicit `src/content/config.ts` pattern with no `loader` | Define collections in `src/content.config.ts` with an explicit `loader` (`glob`/`file`/custom). See `references/content-collections.md`. |
| Framework component renders but is inert — clicks/inputs do nothing | Missing `client:*` hydration directive | Add `client:load`/`client:idle`/`client:visible`/`client:media`/`client:only`. See `references/islands-and-client-directives.md`. |
| Imported a `public/` file expecting bundling/optimization | `public/` is copied as-is, never processed by Vite/Astro | Move the asset into `src/` and import it normally. |
| Duplicate integration entries in `astro.config.mjs` | Ran `astro add <name>` twice, or added it manually after `astro add` already ran | Check the `integrations: [...]` array before re-running `astro add`. |
| `Astro.request`, cookies, redirects, or streaming don't work in production | Site is statically output (`output: 'static'`, the default) but the code assumes server rendering | Add a matching adapter and either set `output: 'server'`, or keep `output: 'static'` (hybrid) and add `export const prerender = false` to the specific route. See `references/deployment-and-adapters.md`. |
| CLI or dev server fails to start / hangs | Node version below 22.12, or an odd-numbered Node release | Switch to an even-numbered Node LTS ≥ 22.12. |
| Large local images tank Lighthouse/LCP scores | Used plain `<img src="/foo.jpg">` for a `src/`-local image instead of the optimization pipeline | Import the image and render it with `<Image />`/`<Picture />` from `astro:assets`. |
| Live collection feels slow or adds unexpected per-request latency | `defineLiveCollection()` fetches at request time by design, opted into a build-time-collection use case | Use a regular (build-time) collection unless the data genuinely must be fresh on every request. |
| Config file confusion (`.mjs` vs `.ts` vs `.js`) across a team/repo | All three are valid for `astro.config.*`, but mixing them per-branch causes merge friction | Pick one format for the repo and stay consistent; behavior is identical. |

## Portability note

Astro's CLI, config, and APIs are the same across editors/agents — nothing here is
Claude-specific. Deployment specifics (adapter choice, platform config) are host-specific by
nature, not agent-specific.

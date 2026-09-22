# Styling — Tailwind CSS Setup (v3 vs v4)

Open this when setting up or debugging Tailwind in an Astro project. **The setup mechanism
changed materially between Tailwind v3 and v4** — using the wrong one is the single most
common Astro+Tailwind support question.

## Tailwind v4 (current default) — `@tailwindcss/vite`

Tailwind v4 dropped its PostCSS-plugin-based Astro integration in favor of a Vite plugin.
`@astrojs/tailwind` does **not** support Tailwind v4.

```bash
npx astro add tailwind   # Astro 5.2+: detects v4, wires up @tailwindcss/vite automatically
```

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

```css
/* src/styles/global.css */
@import "tailwindcss";
```

```astro
---
// any layout that wraps pages
import "../styles/global.css";
---
```

No `tailwind.config.js` is required by default in v4 — configuration (theme tokens, etc.) is
CSS-first via `@theme` blocks in the imported CSS file.

## Tailwind v3 (legacy) — `@astrojs/tailwind`

```bash
npx astro add tailwind   # on a project pinned to tailwindcss@3, installs the legacy integration
```

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [tailwind()],
});
```

Uses a standard `tailwind.config.js`/`.cjs`/`.mjs` (JS-based config), not CSS-first `@theme`.

## Do not mix

Installing both `@astrojs/tailwind` and `@tailwindcss/vite`, or installing `tailwindcss@4`
while keeping the v3-style integration, produces silent class-application failures or build
errors referencing the wrong package. Pick exactly one pair: `(v3, @astrojs/tailwind,
tailwind.config.js)` or `(v4, @tailwindcss/vite, @theme in CSS)`.

## Scoped `<style>` as an alternative

For one-off component styling that doesn't need utility classes, Astro components support
native scoped `<style>` blocks — no build config needed, and no Tailwind purge/content-glob
concerns since Astro scopes styles per-component automatically.

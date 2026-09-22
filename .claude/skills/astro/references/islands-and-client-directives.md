# Islands and Client Directives

Open this when adding an interactive UI framework component (React, Vue, Svelte, Solid,
Preact, Alpine) to an otherwise-static Astro page, or when a framework component "isn't
working" despite rendering.

## Installing a framework

```bash
npx astro add react   # or vue, svelte, solid, preact
```

Updates `astro.config.mjs` (`integrations: [react()]`) and installs the renderer package.

## The default is static, not interactive

Astro components render framework components to static HTML by default — **no JS ships, no
hydration happens**, unless a client directive says otherwise. This is the "islands
architecture": most of the page stays zero-JS; only explicitly hydrated components ("islands")
ship and run client-side JS.

## Client directives

| Directive | Hydrates | Use for |
|---|---|---|
| `client:load` | immediately on page load | above-the-fold, must-work-now widgets |
| `client:idle` | when the browser is idle (`requestIdleCallback`) | lower-priority widgets |
| `client:visible` | when scrolled into view (`IntersectionObserver`) | below-the-fold widgets |
| `client:media={query}` | only if a media query matches | mobile-only or desktop-only interactive UI |
| `client:only="react"` | client-only, skips server render entirely | components using browser-only APIs that would error during SSR |

```astro
---
import Cart from "../components/Cart.tsx";
---
<Cart client:visible />
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Component shows correct markup but buttons/inputs do nothing | No `client:*` directive | Add the directive matching desired hydration timing. |
| "document is not defined" or similar SSR crash | Component uses browser-only APIs during server render | Use `client:only="<framework>"` to skip server rendering entirely. |
| Component flashes unstyled or re-layouts on hydrate | Styles not scoped/loaded before hydration | Prefer Astro-native CSS/Tailwind for wrapper layout; keep framework component focused on behavior, not page layout. |
| Passing complex objects/functions as props to an island | Astro serializes props to HTML; functions and some objects don't survive serialization | Pass only serializable data as props; wire up callbacks inside the island itself. |
| Multiple islands need to share state | Islands are isolated by default — no automatic shared state across components | Use a small shared store (nanostores is Astro's commonly recommended option) rather than prop-drilling across islands. |

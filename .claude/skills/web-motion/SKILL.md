---
name: web-motion
description: >
  Design and build motion for web apps and websites — scroll choreography, hero
  entrances, text/SVG reveals, page transitions, smooth scroll, particle fields,
  and cinematic scroll-driven 3D (exploded views, camera shot lists, product
  assembly). Covers engine choice (GSAP, Motion, Three.js/WebGPU, Lenis, Rive,
  Lottie, native CSS scroll-driven animations), the fail-safe motion-layer
  architecture, device-tier gating, and performance budgets. Use when adding,
  choosing, reviewing, or debugging any animation, scroll effect, WebGL/WebGPU
  visual, or "make this page feel alive" request. For micro-interaction taste
  (durations, easing curves, springs, button/modal feel) read `emil-design-eng`
  instead; for whole-page visual design read `design-taste-frontend`.
metadata:
  version: 1.0.0
  research_snapshot: 2026-08-16
---

# Web Motion

Motion is a **budget**, not a feature. Every animation spends attention, battery,
bytes and risk. This skill is about spending that budget on the two or three
moments that carry the story, and making everything else cost zero.

Research snapshot **2026-08**. Version numbers and browser-support claims below were
verified on that date — see [Verified versions](#verified-versions). If this file is
more than ~4 months old, re-verify before quoting them; this space moves fast and
stale confidence is the main failure mode here.

---

## Router

| Open when you need to... | Read |
|---|---|
| pick an engine / library, or justify one against alternatives | `references/engines.md` |
| build scroll-driven sequences: pin, scrub, snap, sticky-stack, horizontal pan, Lenis wiring, cleanup | `references/scroll-choreography.md` |
| build the cinematic class — a 3D object that opens, explodes, assembles, or is orbited by a camera as you scroll | `references/cinematic-3d.md` |
| do the same effect **without** shipping a 3D engine (pre-rendered frames on canvas) | `references/frame-sequence.md` |
| animate headlines, paragraphs, counters, SVG line-draw, morphs | `references/text-svg-reveals.md` |
| do it with zero JS: `animation-timeline`, View Transitions, `@starting-style` | `references/native-css.md` |
| diagnose jank, flashes of hidden content, dead triggers, memory leaks | `references/troubleshooting.md` |
| drop in a working motion layer and start from a known-good base | `assets/motion-layer/` |

**Route away from this skill when:**

- The question is *"how long / which easing / does this button feel right"* → `emil-design-eng`.
  That skill owns micro-interaction taste. Do not re-derive duration tables here.
- The question is *"how should this page look"* → `design-taste-frontend` (its §5 has the
  motion-intensity dials and forbidden patterns; this skill assumes those are already respected).
- The user wants a chart to animate → `dataviz` first, motion second.

---

## Step 0 — Pick the tier before writing any code

Most bad web motion is a tier mismatch: a brochure site carrying a 3 MB 3D scene, or a
product story told with fade-ups. Name the tier out loud, then build only that tier.

| Tier | What it is | Cost | Reach for it when |
|---|---|---|---|
| **0 — Static** | No motion beyond hover/focus | 0 KB | Dashboards, docs, admin, anything task-driven where users are 50×/day |
| **1 — Interface motion** | Hover, press, modals, toasts, route crossfade | 0–15 KB | Any product UI. Usually pure CSS + View Transitions |
| **2 — Editorial motion** | Hero entrance, scroll reveals, text masks, parallax, counters, smooth scroll | ~50–70 KB | Marketing sites, landing pages, portfolios. **This is the default for a "make it feel premium" brief** |
| **3 — Ambient 3D** | A decorative WebGL field behind the hero; particles, waves, links | +120 KB, lazy | The brand has a metaphor worth rendering. Must be gated and disposable |
| **4 — Cinematic 3D** | The product *is* the animation: it opens, explodes, assembles, is orbited on scroll | 1–6 MB, weeks of work | The object is the story (hardware, watches, devices, architecture). Needs real 3D assets and a real budget |

Tier 4 is what "the watch that opens up and shows its internals as you scroll" is.
It is a **production**, not a component. Before agreeing to it, confirm three things exist:
a real 3D model (or the budget to make one), a mobile plan, and someone who will own the
asset pipeline. If any is missing, do Tier 4 with pre-rendered frames instead
(`references/frame-sequence.md`) — same visual result, a fraction of the risk.

**Escalate one tier at a time.** A Tier-2 site that nails its hero entrance beats a
Tier-4 site that stutters.

---

## The four non-negotiables

These apply at every tier, in every framework. Everything else in this skill is a
recommendation; these are rules.

### 1. Content never depends on the animation running

The single most expensive bug in this domain is a page that stays blank because a
script failed. A blocked CDN, an ad-blocker, a bundle error, an unsupported browser,
or `prefers-reduced-motion` must all degrade to *"static but fully readable"* — never
to *"stuck invisible."*

The contract:

- **Pre-hide only what is above the fold**, and only under an `html.js` class that JS
  itself adds.
- Everything below the fold animates with `gsap.from()` / `view()` timelines, which
  start from the *natural* state — so if JS never runs, the element is already correct.
- An inline `<head>` script adds `.js` **and arms a timeout** that removes it. The
  motion init cancels that timeout. If init never happens, the page un-hides itself.

```html
<!-- in <head>, inline, before any stylesheet that hides things -->
<script>
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("js");
    window.__motionFallback = setTimeout(
      () => document.documentElement.classList.remove("js"),
      2200
    );
  }
</script>
```

Verify it, don't assume it. See [Verification](#verification).

### 2. `prefers-reduced-motion` turns motion off, not content off

Reduced motion is not "faster animation." It means: no parallax, no scroll-hijack, no
infinite loops, no 3D fields, no scrubbed cameras. Content appears in its final state,
immediately. Keep opacity crossfades under ~100 ms if you keep anything at all.

```js
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduced()) return; // before any setup, not sprinkled inside it
```

### 3. Expensive motion is capability-gated, not feature-gated

Never ask "does this browser support WebGL." Ask "should this device be spending
battery on decoration." Gate *before the dynamic import*, so weak devices never even
download the chunk:

```js
function affordsWebGL() {
  if (innerWidth < 900) return false;              // decoration is invisible on phones anyway
  const c = navigator.connection;
  if (c?.saveData) return false;                    // user explicitly asked for less
  if (c?.effectiveType && /2g/.test(c.effectiveType)) return false;
  if (typeof navigator.deviceMemory === "number" && navigator.deviceMemory < 4) return false;
  return true;
}
```

Pair it with an `IntersectionObserver` + `document.hidden` that stops the render loop
when the canvas is off-screen or the tab is backgrounded. A loop that runs unseen is a
pure battery tax.

### 4. Every effect has a teardown

Scroll triggers, split-text DOM surgery, RAF loops, GPU buffers, and event listeners
all leak. In SPAs and View-Transitions sites they leak *per navigation*, which is how a
smooth site becomes unusable after six clicks.

Always ship an `initMotion()` / `destroyMotion()` pair. In React use `useGSAP({ scope })`,
which reverts automatically on unmount. In Three.js, `dispose()` geometry, materials,
textures **and** the renderer, and remove the canvas.

---

## Engine picker (short form)

Full reasoning, alternatives, and gotchas: `references/engines.md`.

| Situation | Reach for |
|---|---|
| Hover/press/modal/toast feel | Plain CSS transitions. ~80% of UI motion needs zero JS |
| Route or state crossfade | View Transitions API (`document.startViewTransition`) |
| Scroll reveal, no gestures, no custom interpolation | Native CSS `animation-timeline: view()` behind `@supports` |
| Scroll choreography, timelines, pinning, text splitting | **GSAP** + ScrollTrigger. Same API in every framework |
| React component transitions, layout/shared-element, gestures, drag | **Motion for React** (`motion/react`) |
| Momentum smooth scroll | **Lenis** standalone; GSAP `ScrollSmoother` if already on GSAP |
| Ambient 3D field / particles / shader background | **Three.js**, dynamically imported, capability-gated |
| Scroll-driven 3D product story | Three.js (or R3F) + GSAP ScrollTrigger scrub → `references/cinematic-3d.md` |
| The same story without a 3D runtime | Pre-rendered frame sequence on canvas → `references/frame-sequence.md` |
| Designer-authored interactive graphic with states | **Rive** (~200 KB wasm, but the file is 10–15× smaller than Lottie) |
| Designer-authored linear illustration/icon | **Lottie / dotLottie** (~50 KB runtime) |

**Do not mix two smooth-scroll layers.** Lenis *and* ScrollSmoother on the same page is
a guaranteed scroll-position fight. Pick one.

---

## The house motion layer

This is the pattern extracted from `elipsis`, `fundacion-rehabilitacion` and
`growup-website`. It is the default shape for Tier 2–3 work. Working files are in
`assets/motion-layer/`.

Three files, one contract:

```
motion.css   pre-hide (above-fold only) + page transitions + reduced-motion kill switch
motion.ts    orchestration: Lenis, hero timeline, reveals, parallax, counters, tilt
hero-field.ts  the WebGL scene — separate chunk, dynamic import, never on the critical path
```

**Markup is declarative.** The orchestrator reads attributes; pages never import GSAP:

| Attribute | Effect |
|---|---|
| `data-hero` | Marks the hero for the entrance timeline |
| `data-split` | Words rise from behind a mask when scrolled into view |
| `data-reveal` | Fade + rise. `data-reveal="stagger"` staggers direct children |
| `data-parallax="12"` | Element drifts inside its frame; the number is the depth |
| `data-tilt` | Cursor-follow 3D tilt (fine-pointer only) |
| `data-hero-field="helix"` | Mounts a named WebGL variant behind the hero |

Why attributes and not per-page code: a designer or a copy edit can move an effect
without touching the motion layer, and the motion layer stays one auditable file. When
JS is absent the attributes are inert — which is exactly rule #1.

**Two details that are easy to get wrong:**

- **Lenis is created once and driven by GSAP's ticker**, not its own RAF. Two clocks
  produce visible micro-stutter:
  ```js
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
- **With View Transitions / SPA navigation the `<head>` persists but the DOM is
  replaced.** Call `destroyMotion()` on before-swap and `initMotion()` on after-swap.
  Without it, ScrollTrigger accumulates dead triggers and SplitText leaves the previous
  page's shredded DOM behind.

**Brand metaphor over library preset.** The WebGL field in each project encodes
something: points that link and release for a foundation about rebuilding bonds; a
double helix for a clinical-research site. A Vanta preset would have been three lines
of code and said nothing. If the effect can't be justified in one sentence about the
brand, it should not be a custom scene — use a preset or drop it.

---

## Budgets

Quote these when someone asks for "more animation."

| Metric | Target | Why |
|---|---|---|
| Motion JS on a marketing page | ≤ 70 KB gzip (GSAP + ScrollTrigger + SplitText + Lenis) | Anything more competes with the content it decorates |
| Three.js scene | Lazy chunk only, ≥ 900 px viewport, gated by `affordsWebGL()` | ~120 KB gzip is a gift, not an entitlement |
| Draw calls per frame | < 100 | Draw calls, not triangles, are what kills frame rate |
| `devicePixelRatio` | `Math.min(devicePixelRatio, 2)` | Retina × 3 quadruples fragment work for no visible gain |
| glTF model | < 3 MB after Draco/meshopt + KTX2 | Above that, mobile LCP collapses |
| Frame sequence (Tier 4 alt) | 60–150 frames desktop, ~⅔ on mobile, WebP q80 | 60 frames @1080p ≈ 3–5 MB in WebP vs 15–20 MB in PNG |
| Total stagger time | ≤ 500 ms | 10 items × 50 ms. More items → shorter per-item delay, not a longer wait |
| LCP / CLS | < 2.5 s / < 0.1 | Motion must not push either. Reserve space before animating |

---

## Verification

Motion work is not done when it looks right on your machine. Three checks, all cheap:

1. **Kill the JS.** Block the motion bundle (`page.route('**/motion*.js', r => r.abort())`
   in Playwright, or DevTools request blocking) and reload. Every heading must have
   `opacity: 1` and `visibility: visible`. This is the difference between "static but
   legible" and "blank page."
2. **Emulate reduced motion.** DevTools → Rendering → *Emulate CSS prefers-reduced-motion*.
   Nothing should move; nothing should be missing.
3. **Scroll for real.** `element.scrollIntoView()` and `window.scrollTo()` do not drive
   Lenis/ScrollSmoother the way wheel input does — programmatic jumps produce false
   negatives on ScrollTrigger. Loop `mouse.wheel()` instead.

Then check `renderer.info.render.calls` and `renderer.info.memory` if a 3D scene is
present: if either climbs across navigations, teardown is incomplete.

> Do not take screenshots to verify unless explicitly asked. Build output, console logs,
> and reading the code are the default evidence.

---

## Verified versions

Checked 2026-08-16 against the npm registry. Re-verify before quoting.

| Package | Version |
|---|---|
| `gsap` | 3.15.0 |
| `@gsap/react` | 2.1.2 |
| `three` | 0.185.1 |
| `lenis` | 1.3.26 |
| `motion` | 13.1.0 |
| `@react-three/fiber` | 9.7.0 |
| `@react-three/drei` | 10.7.8 |
| `@rive-app/canvas` | 2.40.0 |
| `lottie-web` | 5.13.0 |

**Two claims circulating in 2026 that are wrong — do not repeat them:**

- *"ScrollTrigger 4.0"* — does not exist. GSAP is on **3.x** (3.15.0). Several
  trend articles invented this.
- *"GSAP plugins are paid"* — false since April 2025. GSAP went fully free, core and
  every plugin (SplitText, ScrollSmoother, DrawSVG, MorphSVG, Flip, Physics2D…), after
  Webflow acquired GreenSock. Anything claiming a Club GreenSock membership is pre-2025.

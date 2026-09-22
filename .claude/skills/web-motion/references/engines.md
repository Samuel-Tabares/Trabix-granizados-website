# Engines — choosing and justifying

Decision reference for every motion runtime worth considering in 2026, with the
tradeoff that actually decides each one. Versions verified 2026-08-16.

---

## Full decision table

| Situation | Reach for | Weight (gzip) |
|---|---|---|
| Hover, press, focus, simple state change | Plain CSS transitions | 0 |
| Scroll reveal, no gestures, no interpolation against input | Native CSS `animation-timeline: view()` | 0 |
| Route or state crossfade, shared elements between pages | View Transitions API | 0 |
| Scroll choreography, timeline sequencing, pinning, text splitting | **GSAP** + ScrollTrigger | ~25 KB core, ~13 KB ScrollTrigger |
| React component enter/exit, layout & shared-element, drag/gesture | **Motion for React** (`motion/react`) | ~34 KB, tree-shakes |
| Vanilla/Vue/Svelte micro-interactions, not scroll-heavy | **Motion** vanilla build | ~12 KB |
| Simple tweens/SVG/stagger where GSAP is overkill | **Anime.js** | ~9 KB |
| Momentum smooth scroll | **Lenis** | ~4 KB |
| Momentum smooth scroll, already on GSAP | GSAP **ScrollSmoother** | ~8 KB |
| 3D scene, particles, shaders | **Three.js** | ~120 KB, lazy |
| 3D inside React | **React Three Fiber** + drei | +~30 KB |
| 3D inside Vue / Svelte | TresJS / Threlte | — |
| 2D interactive graphic with states, designer-authored | **Rive** | ~200 KB wasm |
| 2D linear illustration/icon, designer-authored | **Lottie / dotLottie** | ~50 KB |
| 3D hero built in a design tool, no pipeline | **Spline** | heavy, hosted |
| Ready-made decorative background preset | **Vanta.js** | Three.js + preset |
| Zero-config class-based scroll reveals | AOS | ~14 KB |

---

## GSAP

The default for anything scroll-choreographed. Not a React library despite the pairing —
it just needs a DOM node, so the same code works in Astro, Vue, Svelte, WordPress or a
plain `<script>` tag.

**GSAP is 100% free since April 2025** — core *and every plugin* (SplitText,
ScrollSmoother, DrawSVG, MorphSVG, Flip, ScrambleText, Physics2D, Draggable, Inertia…)
after Webflow acquired GreenSock. They used to live behind a paid Club GreenSock private
registry. Any source claiming a plugin is paid is pre-2025 and stale; verify at
gsap.com before repeating it.

- **npm:** `gsap` — plugins import from `gsap/ScrollTrigger`, `gsap/SplitText`, etc.
- **CDN:** `https://cdn.jsdelivr.net/npm/gsap@<version>/dist/<Plugin>.min.js`.
  **Pin the identical version across core and every plugin** — mixed minors can break
  `registerPlugin` silently. Curl each URL to confirm it 200s before shipping; plugin
  availability shifts between versions faster than docs update.
- **React:** `@gsap/react`'s `useGSAP({ scope })`. Auto-reverts on unmount.

**Version reality check:** GSAP is on **3.15.0**. There is no ScrollTrigger 4.0 —
several 2026 trend articles assert one. It does not exist.

## Motion (formerly Framer Motion)

The 2024 rebrand made it framework-agnostic: there is a vanilla/Vue/Svelte build
alongside the React one. "It's React-only" is a stale assumption.

Reach for it over GSAP when the work is **component-shaped**: `AnimatePresence` for
exit animations React can't otherwise do, `layout` / `layoutId` for shared-element and
list-reorder transitions, `useSpring` / `useMotionValue` for gesture and drag physics,
`useReducedMotion()` for the accessibility gate.

Reach for GSAP over it when the work is **timeline-shaped**: scroll scrubbing, precise
sequencing, pinning, text splitting.

They coexist fine in one project. Using both for the same job doesn't.

## Three.js

The de facto 3D scene graph. **ES modules only since r125** — there is no UMD
`three.min.js` for modern versions. `<script type="module">` importing
`three@<v>/build/three.module.js`, or npm.

Inside a component framework, **use the wrapper, not raw Three.js**: React Three Fiber,
TresJS (Vue), Threlte (Svelte). Fighting the render loop against a framework's
reconciler is the classic mistake — you end up re-rendering the tree 60×/second.

For a static site with no framework, raw Three.js is correct; no wrapper needed.

**WebGPU:** see `cinematic-3d.md` for the migration reality. Short version — different
entry point (`three/webgpu`), async `await renderer.init()`, custom GLSL must be ported
to TSL, and Three's own docs still call the renderer experimental. Low risk with
standard materials, real work with custom shaders.

**Lighter than full Three.js** for one decorative effect: **Vanta.js** presets (waves,
net, fog, birds) when a generic look is acceptable; **OGL** when you want raw WebGL with
a fraction of the API surface. Hand-rolled Three.js when the effect must hit an exact
brand color or motion a preset won't.

## Lenis vs ScrollSmoother

| | Lenis | ScrollSmoother |
|---|---|---|
| Dependency | none | GSAP |
| DOM requirement | none | `#smooth-wrapper` > `#smooth-content` |
| `position: fixed` children | fine | **break** — the wrapper's transform creates a containing block; keep fixed/sticky elements outside it |
| Sync with ScrollTrigger | wire manually via `lenis.on("scroll", ScrollTrigger.update)` | automatic |
| Built-in scroll effects (`data-speed`) | no | yes, with `effects: true` |

Default to Lenis. Choose ScrollSmoother when you're already fully on GSAP and want
`data-speed` parallax for free.

**Never run both.** And skip both entirely on product UIs, long data tables, or anything
where find-in-page matters.

## Rive vs Lottie vs Spline

Three different jobs that get confused with each other.

| | Rive | Lottie / dotLottie | Spline |
|---|---|---|---|
| What it is | Interactive 2D graphics with a **state machine** | Vector animation exported from After Effects | 3D scenes from a design tool |
| Runtime | ~200 KB wasm | ~50 KB (dotLottie) | heavy, typically hosted |
| File size | 10–15× smaller than equivalent Lottie | baseline | n/a |
| Interactivity | Real: inputs, triggers, data-driven state | dotLottie state machines added late 2025, but still fundamentally *playback control* | Basic; no state machines, no skeletal animation, no mesh deformation |
| Best for | Toggles, mascots, onboarding, animated logos that respond | Icons, spot illustrations, loaders | A decorative 3D hero with no pipeline |
| Wrong for | Anything a CSS transition can do | Complex conditional behaviour | Precision product storytelling |

The 200 KB wasm is the whole argument against Rive for a single icon — at that point
Lottie or CSS wins. It's the whole argument *for* Rive once you have three or more
stateful graphics.

## Native CSS

`animation-timeline: scroll()` / `view()`, View Transitions, `@starting-style` — see
`native-css.md`. These are genuinely free (compositor thread, zero JS) and should be the
first thing checked, not the last. They can't do gestures or interpolate against
arbitrary input, so they complement a JS engine rather than replace it.

---

## How to justify a choice

When recommending an engine, state the tradeoff, not the preference:

> "GSAP + ScrollTrigger, ~38 KB. Motion would be lighter for the hover states but has no
> equivalent to ScrollTrigger's pinning for the section stack, and running both engines
> costs more than the difference. Native `view()` timelines handle the three simple
> reveals — I'll use those and keep GSAP for the pinned sequence."

Bad justification is "GSAP is the industry standard." Every ScrollTrigger, marquee and
pinned section needs a one-sentence reason. If you can't write it, drop the animation.

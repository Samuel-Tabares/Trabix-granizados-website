# Motion layer — known-good starting point

A Tier-2/3 motion layer extracted from three shipped projects. Copy these four files,
wire the two entry points, and you have hero entrance, scroll reveals, parallax,
counters, cursor tilt, an optional WebGL field, page transitions, and a fail-safe
contract that keeps the page readable when any of it breaks.

```
head-inline.html   paste into <head>, inline, before stylesheets
motion.css         pre-hide + page transitions + reduced-motion kill switch
motion.js          orchestration — the only file that imports GSAP
hero-field.js      WebGL scene — separate chunk, dynamically imported, optional
```

## Install

```bash
npm i gsap lenis three
```

`three` is only needed if you use the hero field. It is dynamically imported, so it
lands in its own chunk and is never on the critical path.

For a no-build site, load GSAP from CDN instead and drop the `import` lines — **pin the
identical version across core and every plugin**.

## Wire it

```html
<!-- head-inline.html goes here, inline, first -->
<link rel="stylesheet" href="/motion.css" />
```

```js
import { initMotion, destroyMotion } from "./motion.js";

// Plain site
initMotion();

// Astro View Transitions
document.addEventListener("astro:after-swap", initMotion);
document.addEventListener("astro:before-swap", destroyMotion);

// Any SPA router: init on mount, destroy on unmount. In React use useGSAP({ scope }).
```

## Markup contract

| Attribute | Effect |
|---|---|
| `data-hero` | Runs the entrance timeline on this section |
| `data-split` | Words rise from behind a mask when scrolled into view |
| `data-reveal` | Fade + rise. `data-reveal="stagger"` staggers direct children |
| `data-parallax="12"` | Drifts inside its frame; number = depth |
| `data-tilt` | Cursor-follow 3D tilt (fine pointer only) |
| `data-hero-field` | Mounts the WebGL field into this element |
| `.count` + `data-count="12"` | Counts up once, in view |

The hero timeline looks for `.hero__eyebrow`, `.hero__title`, `.hero__lead`,
`.hero__actions`, `.hero__stat`, `.hero__badge`, `.hero__bg > *`. Rename to match your
project in one place (`heroEntrance`) — or rename your classes.

## The rules baked in

1. `motion.css` pre-hides **only** the hero, and only under `html.js`. Everything else
   uses `gsap.from()`, which starts from the natural state.
2. `head-inline.html` arms a 2.2 s timeout that removes `.js`. `initMotion()` cancels it.
   If the bundle never loads, the page un-hides itself.
3. Under `prefers-reduced-motion` the `.js` class is never added and `initMotion()`
   returns immediately.
4. The WebGL field is gated by `affordsWebGL()` **before** the dynamic import, so weak
   devices never download Three.js.
5. `destroyMotion()` kills triggers, reverts splits, and disposes GPU resources.

## Verify before shipping

```js
// Playwright
await page.route("**/motion*.js", (r) => r.abort());
await page.goto(url);
await expect(page.locator("h1")).toBeVisible();   // must pass
```

Then DevTools → Rendering → *Emulate prefers-reduced-motion: reduce* and confirm
nothing moves and nothing is missing.

## Customising the WebGL field

`hero-field.js` ships one variant (`links` — points that connect when near and release
as they drift). **Replace it with something that means something for the brand.** A
generic particle preset says nothing; the point of hand-rolling it instead of using
Vanta is that the motion can carry the metaphor. Past variants: a double helix for a
clinical-research site, bridging links for a rehabilitation foundation.

Keep the safety envelope when you change it: DPR capped at 2, fewer points on small
screens, `IntersectionObserver` pause, full disposal in the returned cleanup.

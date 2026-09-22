# Troubleshooting

Symptom → cause → fix. Ordered by how often each actually happens.

---

## Content is invisible / the page is blank

**Cause:** CSS pre-hid an element and the JS that was supposed to reveal it never ran —
bundle error, blocked CDN, ad-blocker, hydration failure, or an exception earlier in the
init function.

**Fix:** the fail-safe contract in SKILL.md §1. Pre-hide only above-the-fold content,
only under `html.js`, and arm a `setTimeout` in the inline `<head>` script that removes
`.js` after ~2.2 s. Below the fold, use `gsap.from()` so the resting state *is* the
correct state.

**Test it:** block the motion bundle and reload. Every heading must be
`opacity: 1; visibility: visible`.

## Flash of animated content (FOAC) — content appears, then jumps and animates in

**Cause:** the reveal is set up after first paint, so the browser paints the natural
state before JS hides it.

**Fix:** the pre-hide must come from CSS in the initial stylesheet, not from
`gsap.set()` in a deferred script. That's exactly why the `html.js` class exists — the
inline head script adds it before any paint.

## Reveals fire at the wrong scroll position

**Causes, in order of likelihood:**

1. Layout changed after the triggers were computed — web fonts swapped, images loaded
   without reserved dimensions, lazy content expanded. → `ScrollTrigger.refresh()` after
   the change, and reserve space (`aspect-ratio`, `width`/`height` attributes) so it
   doesn't happen at all.
2. Triggers created out of document order with pinning involved. → create top-to-bottom
   or set `refreshPriority`; refresh runs in creation order.
3. Dead triggers from a previous SPA navigation. → see next entry.

## Everything degrades after a few navigations

**Cause:** no teardown. ScrollTriggers accumulate, SplitText leaves shredded DOM, RAF
loops keep running, WebGL buffers are never disposed.

**Fix:** an `initMotion()` / `destroyMotion()` pair called on the router's swap events.
In React, `useGSAP({ scope })` handles it. Confirm with `ScrollTrigger.getAll().length`
in the console after a few navigations — it should not grow.

## Scroll position fights itself / stutters

**Causes:**

- Two smooth-scroll layers (Lenis **and** ScrollSmoother). Pick one.
- Lenis running its own RAF instead of GSAP's ticker. Drive it from
  `gsap.ticker.add(t => lenis.raf(t * 1000))` and set `gsap.ticker.lagSmoothing(0)`.
- `scroll-behavior: smooth` in CSS on top of a JS smooth scroller. Set it to `auto`.

## `position: fixed` element is anchored to the wrong thing

**Cause:** ScrollSmoother's `#smooth-content` has a transform, which creates a new
containing block, so `fixed` descendants position against *it* instead of the viewport.

**Fix:** move fixed and sticky elements outside `#smooth-wrapper`, as earlier siblings.

## Playwright/programmatic scroll tests report false negatives

**Cause:** `scrollIntoView()` and `window.scrollTo()` don't drive Lenis/ScrollSmoother's
internal position the way wheel input does.

**Fix:** loop `page.mouse.wheel(0, 300)` with small waits instead of jump-scrolling.

## Jank / dropped frames

Open DevTools → Performance, record 5 s of the offending scroll, look at the flame chart:

| What you see | Cause | Fix |
|---|---|---|
| Long purple *Layout* bars | Animating `width`, `height`, `top`, `left`, margins, or reading `getBoundingClientRect()` inside the loop | Move to `transform`/`opacity`; cache measurements outside the loop; use FLIP for real layout changes |
| Long green *Paint* bars | Large `filter`/`box-shadow`/`backdrop-filter` areas, grain overlays on scrolling containers | Bound the effect to a small or `position: fixed` `pointer-events: none` layer; add `contain: paint` |
| Sawtooth memory graph | Allocating objects inside the render loop | Hoist scratch vectors/objects; never `new` per frame |
| Long yellow *Scripting* on every scroll event | A `window.addEventListener("scroll")` handler, or React state updated per frame | ScrollTrigger / IntersectionObserver / motion values instead |
| Fine on desktop, dies on mobile | DPR ×3, uncapped particle count, real-time shadows | Cap DPR at 2, tier the scene, bake lighting |

`will-change: transform` helps *sparingly* — apply it on `:hover` or an `.is-animating`
class, never pre-emptively across the page. Every promoted layer costs GPU memory, and a
page full of them is slower than one with none.

---

## Three.js specific

| Symptom | Cause |
|---|---|
| Blank canvas, no console error, WebGPU | Missing `await renderer.init()` |
| Model loads as an untextured blob | `KTX2Loader` or `MeshoptDecoder`/`DRACOLoader` not registered on the `GLTFLoader` |
| Memory climbs every navigation | Geometry/material/texture/renderer not disposed. Watch `renderer.info.memory` |
| Frame rate scales badly with object count | Draw calls, not triangles. Check `renderer.info.render.calls`; target < 100. Merge static geometry, share materials, `InstancedMesh` |
| Blurry on Retina | Canvas backing store not scaled by DPR |
| Battery drain complaints | No `IntersectionObserver` pause and no `document.hidden` check |
| Custom shader broke on WebGPU | GLSL isn't portable; port to TSL / node materials |
| Works locally, fails on a client's machine | Old GPU, hospital/corporate network, or software rendering. This is why the capability gate exists |

**Disposal checklist:**

```js
geometry.dispose();
material.dispose();
texture.dispose();
texture.source.data.close?.();   // GLTF ImageBitmap textures
renderer.dispose();
renderer.domElement.remove();
```

---

## Reduced motion "isn't working"

Usually it is — the bug is that motion was disabled but the *pre-hidden* state wasn't.
The reduced-motion branch must run **before** anything is hidden, and must also prevent
the `html.js` class from being added at all. Verify with DevTools → Rendering → *Emulate
CSS prefers-reduced-motion: reduce*.

---

## "It feels cheap" (no technical bug)

Diagnose in this order:

1. **Too much.** Every section fading up is the generated-work tell. Cut to the two or
   three moments that carry the story.
2. **Wrong easing.** Built-in CSS easings are too weak; `ease-in` on anything entering
   makes the whole UI feel sluggish. See `emil-design-eng` for curves — that skill owns
   this and this one deliberately doesn't duplicate it.
3. **Uniform timing.** Everything at the same duration reads mechanical. Vary by role:
   feedback fast, entrances slower, exits ~75% of entrances.
4. **Motion with no reason.** If you can't say in one sentence what an animation
   communicates — hierarchy, narrative, feedback, state change — delete it.

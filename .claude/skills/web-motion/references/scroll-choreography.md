# Scroll choreography

GSAP ScrollTrigger grammar, the four canonical scroll patterns, smooth-scroll wiring,
and the cleanup rules that keep it all from rotting.

---

## The grammar

```js
gsap.registerPlugin(ScrollTrigger);   // once, before anything else

gsap.to(el, {
  y: -100,
  scrollTrigger: {
    trigger: el,        // required
    start: "top 85%",   // [trigger edge] [viewport edge]
    end: "bottom top",
    scrub: true,        // OR toggleActions — never both
    pin: false,
    markers: true,      // dev only. Shipping these is a visible bug
  },
});
```

`start: "top 85%"` reads: *when the trigger's top reaches 85% down the viewport*.
That's the workhorse reveal position — the element is comfortably visible but the
motion still has somewhere to go.

**`scrub` vs `toggleActions` is a fork, not a pair:**

| | Use when |
|---|---|
| `scrub: true` / `scrub: 1` | The scroll **is** the timeline. Parallax, progress, camera moves, horizontal pans. `1` adds one second of smoothing lag — almost always nicer than rigid `true` |
| `toggleActions: "play none none reverse"` | The scroll is a **trigger**. Reveals, counters, entrances — the animation has its own duration and easing |

Setting both makes `toggleActions` silently ineffective.

---

## Non-negotiable rules

| Rule | Why |
|---|---|
| Attach ScrollTrigger to the **timeline**, never to child tweens inside it | Child triggers fire independently and the timeline's sequencing is lost |
| Call `ScrollTrigger.refresh()` after layout changes | Fonts, images, lazy content and 3D models all change measurements after the triggers were computed |
| Create triggers top-to-bottom, or set `refreshPriority` | Refresh runs in **creation order**. Out-of-order creation with pinning produces positions that drift on resize |
| `ease: "none"` on `containerAnimation` horizontal tweens | Any other easing desynchronises the horizontal position from scroll |
| Kill everything on teardown | `ScrollTrigger.getAll().forEach(t => t.kill())` |
| Never `window.addEventListener("scroll", …)` for animation | Runs every frame, unbatched, main-thread. Use ScrollTrigger, IntersectionObserver, `useScroll()`, or CSS `view()` timelines |

**React:** use `useGSAP()` from `@gsap/react` with a `scope` ref. It auto-reverts on
unmount and kills ScrollTriggers for you. Selector strings without `scope` will match
elements in other components — this is the most common React-GSAP bug.

```js
useGSAP(() => {
  gsap.to(".card", { y: -40, scrollTrigger: { trigger: ".card" } });
}, { scope: containerRef });
```

Animations created inside **event handlers** run after `useGSAP` finished and won't be
cleaned up — wrap them in `contextSafe()`.

---

## Pattern 1 — Reveal (the default, and the one to use sparingly)

```js
document.querySelectorAll("[data-reveal]").forEach((el) => {
  const targets = el.dataset.reveal === "stagger" ? [...el.children] : [el];
  gsap.from(targets, {
    opacity: 0, y: 34, duration: .85, ease: "power3.out", stagger: .09,
    scrollTrigger: { trigger: el, start: "top 88%" },
  });
});
```

`gsap.from()` is deliberate: the element's resting state is its natural state, so if the
script never runs the content is already correct. `gsap.to()` from a CSS-hidden state is
the pattern that produces blank pages.

**Fade-up-on-every-section is the tell of generated work.** Sibling stagger inside a
grid or list is legitimate rhythm. A whole page where each section fades up in turn is
not choreography, it's a default. Reserve it for sections that earn it, and cap total
stagger time at ~500 ms.

## Pattern 2 — Sticky stack

Cards stack and pin at the top of the viewport as you scroll past them.

```js
const cards = gsap.utils.toArray(".card");
cards.forEach((card, i) => {
  ScrollTrigger.create({
    trigger: card,
    start: "top top",            // ← the single most common bug is "top center" here
    end: () => `+=${window.innerHeight}`,
    pin: true,
    pinSpacing: i === cards.length - 1,
    scrub: true,
  });
  if (i < cards.length - 1) {
    gsap.to(card, {
      scale: .92, opacity: .5, ease: "none",
      scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true },
    });
  }
});
```

If it fires halfway through the scroll instead of pinning at the viewport top, the cause
is always `start: "top center"` or `"top 80%"` instead of `"top top"`.

## Pattern 3 — Horizontal pan

```js
const track = document.querySelector(".track");
const pan = gsap.to(track, {
  x: () => -(track.scrollWidth - innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".pan-section",
    start: "top top",
    end: () => `+=${track.scrollWidth - innerWidth}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,   // recompute the function-based values on resize
  },
});

// Anything animating *inside* the horizontal track needs containerAnimation
gsap.from(".track .slide h2", {
  opacity: 0, y: 40,
  scrollTrigger: { trigger: ".track .slide h2", containerAnimation: pan, start: "left 80%" },
});
```

Same failure mode: without `start: "top top"` the pan begins before the section is
pinned and users see half a slide slide past.

Horizontal scroll-hijack is a strong choice with a real accessibility cost — keyboard
and screen-reader users navigate a track that doesn't respond to focus the way a normal
page does. Use it at most once per site, and make the content reachable another way.

## Pattern 4 — Scrub a media timeline

Camera moves, exploded views, frame sequences, progress bars — see `cinematic-3d.md`
and `frame-sequence.md`. The shape is always: one long `scrub` timeline over a tall
runway, a `position: sticky` viewport-height stage, and a render loop that reads
animated proxy values.

---

## Smooth scroll

Momentum scrolling changes the *feel* of a whole site more than any single animation.
It also breaks things. Two options; never both.

### Lenis (default choice)

Independent of GSAP, lighter, works with any engine.

```js
const lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
document.documentElement.style.scrollBehavior = "auto";
```

Driving Lenis from GSAP's ticker rather than its own RAF is what removes the micro-stutter
you get from two independent clocks. `lagSmoothing(0)` stops GSAP from "catching up"
after a frame drop, which with a scrubbed timeline reads as a jump.

Create it **once** and let it survive SPA navigations. Skip creation entirely under
reduced motion.

### ScrollSmoother (only if already on GSAP)

Same-vendor sync with ScrollTrigger, but it demands a DOM wrapper:

```html
<div id="smooth-wrapper"><div id="smooth-content">…</div></div>
```

Its internal transform creates a new containing block, so **anything `position: fixed`
must live outside the wrapper**, or it will anchor to the wrapper instead of the
viewport. Sticky headers are safest as an earlier sibling outside the wrapper too.

### Both are wrong when

The site is a product UI, has long scrollable data tables, or relies on browser
find-in-page. Momentum scroll fights all three. It belongs on editorial and marketing
surfaces.

---

## Teardown

```js
export function destroyMotion() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  splits.forEach((s) => s.revert());     // SplitText shredded the DOM; put it back
  splits = [];
  fieldCleanup?.();                       // disposes the WebGL scene
  fieldCleanup = null;
}
```

Call it on `astro:before-swap`, router `beforeunload`, Barba `leave`, or React unmount.
Symptoms of missing teardown: reveals that fire at the wrong scroll position after a
navigation, text that renders duplicated or pre-split, and a frame rate that degrades
with every page view.

---

## FLIP — when layout itself is the animation

`Flip` (free, GSAP core plugin) animates between two layout states without animating
layout properties. Reach for it when an element moves between containers, a grid
re-sorts, or a card expands into a detail view.

```js
const state = Flip.getState(".item");   // First
container.appendChild(item);            // Last — make the real DOM/layout change
Flip.from(state, {                      // Invert + Play
  duration: .6, ease: "power2.inOut", absolute: true, nested: true,
});
```

`absolute: true` makes elements `position: absolute` during the flip, which is what makes
it survive flexbox and grid reflow. Unlike hand-rolled FLIP, GSAP's handles scaled and
rotated ancestors correctly.

In React, `layout` / `layoutId` from Motion do the same job idiomatically. Don't wrap
static content in `layout` "for safety" — it costs measurement work every render.

# Text, numbers and SVG

The reveals that carry most of a marketing page's perceived quality, and the accessibility
traps in each.

---

## Masked word reveal

The signature editorial headline effect: words rise from behind their own baseline
rather than floating in from nowhere.

```js
const split = SplitText.create(title, { type: "words,lines", mask: "words" });
gsap.set(title, { opacity: 1, visibility: "visible" });   // was pre-hidden for measurement
gsap.from(split.words, {
  yPercent: 118,          // >100 so the word starts fully below its mask
  opacity: 0,
  duration: 1.05,
  ease: "power4.out",
  stagger: 0.045,
});
```

`mask: "words"` (GSAP 3.13+) wraps each word in an `overflow: hidden` container for you.
Before that option existed everyone hand-rolled the wrapper; if you see that in old code,
it can be deleted.

**Why `yPercent: 118` and not `100`:** descenders. At exactly 100% the tails of *g*, *y*,
*p* peek below the mask for the first frames.

**Why the element must be `visibility: hidden` first, not `opacity: 0`:** SplitText needs
the text laid out and measurable before it can shred it. `visibility: hidden` preserves
layout; `display: none` breaks the split. Reveal it in the same tick you mount the tween.

### Accessibility

SplitText replaces the text node with dozens of `<div>`s. Modern versions set
`aria-label` on the container and hide the fragments from the accessibility tree — verify
this in your version rather than assuming. Then:

- **Always `split.revert()` on teardown.** Otherwise navigation leaves the previous
  page's shredded DOM and screen readers announce it character by character.
- Never split body copy. Headlines and short lines only — splitting a paragraph is both
  an a11y problem and a layout-thrash problem.
- Under reduced motion, don't split at all. Skip the whole path.

### Character-level splits

`type: "chars"` with `stagger: 0.02` is the "cinematic title" look. It is also the most
overused effect on the web right now. Use it once per site at most, and never on
anything the user needs to read quickly.

---

## Counters

```js
const el = document.querySelector(".count");
const end = Number(el.dataset.count);
const obj = { v: 0 };
gsap.to(obj, {
  v: end,
  duration: 1.6,
  ease: "power2.out",
  snap: { v: 1 },
  onUpdate: () => (el.textContent = String(Math.round(obj.v))),
  scrollTrigger: { trigger: el, start: "top 92%", once: true },
});
```

```css
.count { font-variant-numeric: tabular-nums; }
```

`tabular-nums` is not optional — without it the element's width changes on every digit
and the whole line jitters. This is the single most common counter bug.

`once: true` matters too: a number that re-counts every time you scroll past reads as a
glitch, not an effect.

**Put the real number in the HTML** (`<span class="count" data-count="12">12</span>`) so
the correct value is there with JS disabled, and animate *from* zero — never render an
empty element that JS fills in.

---

## SVG line draw

```js
gsap.registerPlugin(DrawSVGPlugin);
gsap.set(path, { drawSVG: "0%" });
gsap.to(path, {
  drawSVG: "100%",
  duration: 1,
  ease: "power2.inOut",
  scrollTrigger: { trigger: path.closest("li, article"), start: "top 88%" },
});
```

DrawSVG is free since 2025. The manual alternative is `stroke-dasharray` /
`stroke-dashoffset` with `getTotalLength()` — works fine, needs no plugin, and is worth
using when GSAP isn't already in the bundle:

```js
const len = path.getTotalLength();
path.style.strokeDasharray = len;
path.style.strokeDashoffset = len;
// then animate strokeDashoffset to 0 with CSS or WAAPI
```

Only works on stroked paths. Filled icons need a mask or clip-path reveal instead.

## SVG morph

`MorphSVGPlugin` (also free) interpolates between two path shapes even with different
point counts. The quality of a morph is almost entirely determined by how similar the
two paths' point ordering is — if it twists weirdly, fix the source paths in the vector
editor before fiddling with `shapeIndex`.

Morph sparingly. It draws a lot of attention for what is usually a decorative change.

---

## Text scramble / decode

```js
gsap.to(link, {
  duration: 0.6,
  ease: "none",
  scrambleText: { text: link.textContent, chars: "upperCase", revealDelay: 0.1, speed: 0.4 },
});
```

Fine on nav links and short labels as a hover flourish. Never on content the user is
reading, and never on anything a screen reader will announce mid-scramble — set it on an
`aria-hidden` visual layer if the label matters.

---

## Magnetic buttons and cursor tilt

```js
if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;   // gate first

const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" });
const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });

card.addEventListener("pointermove", (e) => {
  const r = card.getBoundingClientRect();
  rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
  ry(((e.clientX - r.left) / r.width - 0.5) * 7);
});
card.addEventListener("pointerleave", () => { rx(0); ry(0); });
```

Three rules:

- **`gsap.quickTo`, never `gsap.to` per event.** `quickTo` reuses one tween instance;
  creating a tween per pointermove allocates dozens of objects per second.
- **Gate on `(hover: hover) and (pointer: fine)`.** On touch there is no cursor, so this
  is dead code that still ships and still listens.
- **Keep the angle under ~8°.** Past that it stops reading as depth and starts reading
  as a broken transform.

The same `quickTo` pattern is what makes a custom cursor feel right: a fast dot
(~0.1 s) and a slower ring (~0.35 s) trailing it.

In React, the equivalent is `useMotionValue` + `useSpring` — and the hard rule there is
that pointer values must never touch `useState`.

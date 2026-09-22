# Native CSS motion — the free tier

Three browser features that do real work with zero JavaScript, on the compositor thread.
Check these before reaching for a library. Support status verified 2026-08.

---

## Scroll-driven animations

Two timeline types:

- **`scroll()`** — tracks a scroll container's own position, 0–100%. Progress bars,
  parallax backgrounds, sticky-header state.
- **`view()`** — tracks an element's position as it crosses the scrollport. Reveals,
  fade-ins, image wipes.

```css
/* Reading progress bar — the whole feature, no JS */
@supports (animation-timeline: scroll()) {
  .progress-bar {
    transform-origin: 0 50%;
    animation: grow linear both;
    animation-timeline: scroll(root block);
  }
}
@keyframes grow { to { transform: scaleX(1); } }
```

```css
/* Reveal as the element crosses the viewport */
@supports (animation-timeline: view()) {
  .reveal {
    animation: rise linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 35%;   /* start / end along the crossing */
  }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(28px); }
}
```

`animation-range` is the expressive part: `entry`, `exit`, `cover`, `contain`, each
0–100%, describing where in the element's journey across the viewport the animation
runs.

**Support:** Chrome/Edge 115+, Safari 18+, Firefox 132+ — roughly 84% globally as of
mid-2026. A polyfill exists but costs more than it saves for decoration.

**Always gate with `@supports`.** Unsupported browsers should get *nothing* — the static
final state — never a half-applied broken state. This is the same fail-safe rule as
everywhere else in this skill.

**What it can't do:** respond to gestures, interpolate against pointer position, or run
custom easing driven by user input. It's a timeline, not an engine. When the effect
needs to react to anything other than scroll position, you need JS.

**Where it genuinely wins over ScrollTrigger:** progress bars, simple reveals, sticky
image wipes, `steps()` sprite-sheet sequences. It runs off the main thread, so it stays
smooth while JS is busy — which ScrollTrigger cannot promise.

---

## View Transitions API

Native crossfade (and shared-element morph) between two DOM states — no library.

### Same-document

Broad support: Chrome/Edge 111+, Firefox 133+, Safari 18+.

```js
// Wrap any state change that swaps content
document.startViewTransition(() => renderNewLanguage());
```

```css
::view-transition-old(root) { animation: fade-out .28s ease-in-out both; }
::view-transition-new(root) { animation: fade-in  .42s ease-out both; }
```

Shared elements morph automatically when they carry the same `view-transition-name`
across both states:

```css
.card-hero { view-transition-name: hero; }   /* must be unique per rendered state */
```

Duplicate `view-transition-name` values in the same snapshot silently abort the whole
transition. This is the most common bug.

### Cross-document (MPA)

```css
@view-transition { navigation: auto; }
```

**Support is uneven as of 2026-08:** Chromium and Safari 18.2+ ship it; Firefox is still
in development / behind a flag. Treat it strictly as progressive enhancement — without
it users get a normal navigation, which is fine.

Also note: the two documents must be same-origin, and the transition only fires on
regular navigations (not reloads or cross-origin).

### With a framework router

Astro, Next and others expose their own hooks. The critical detail is that the `<head>`
persists while the DOM is replaced, so **any motion layer must be torn down and
re-initialised per navigation** — see `scroll-choreography.md` § Teardown.

---

## `@starting-style`

Animate an element's *entry* — including elements entering from `display: none`, popovers
and dialogs, which previously required a JS class dance.

```css
.toast {
  opacity: 1;
  translate: 0 0;
  transition: opacity .2s, translate .2s, display .2s allow-discrete;
}
@starting-style {
  .toast { opacity: 0; translate: 0 8px; }
}
```

`transition-behavior: allow-discrete` (or the `allow-discrete` keyword in shorthand) is
what lets `display` participate, so the element stays rendered until the exit transition
finishes. Without it the element vanishes instantly and only the entry animates.

---

## `prefers-reduced-motion`

The blanket kill switch. Put it last so it wins.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  .hero-field, .progress-bar { display: none; }
  ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
}
```

Note what this does *not* do: it doesn't hide content. Elements land in their final
state instantly. Any pre-hiding done for animation purposes must be conditioned on the
same query (or on the `html.js` class that is never added under reduced motion).

---

## Related: `prefers-reduced-transparency`

If the design uses glass / `backdrop-filter`, provide a solid-fill fallback under
`@media (prefers-reduced-transparency: reduce)`. Same principle: the effect is optional,
the legibility isn't.

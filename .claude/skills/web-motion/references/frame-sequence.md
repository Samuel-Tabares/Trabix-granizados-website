# Frame sequences — cinematic 3D without a 3D engine

The Apple product-page technique: pre-render the animation to images, then draw one
frame per scroll position onto a canvas. It looks like video, responds like a scrollbar,
and ships no 3D runtime.

**Recommend this over real-time 3D whenever the object doesn't need to be interactive.**
It is usually the better engineering decision: the visual ceiling is your renderer
(Blender, Cinema4D, Octane — not a browser), the runtime is ~50 lines, and there is no
asset pipeline, no shader portability question, and no GPU tier to detect.

| | Frame sequence | Real-time 3D |
|---|---|---|
| Visual quality | Whatever your offline renderer can do — ray tracing, caustics, DOF | Constrained by real-time budget |
| Runtime code | ~50 lines | Scene graph, loaders, materials, lights, disposal |
| Payload | 2–6 MB of images | 1–3 MB model + ~120 KB Three.js + textures in VRAM |
| Interactivity | None. Scroll only | Hover parts, click to isolate, drag to orbit, configure |
| Responsive framing | Fixed. Needs re-renders per aspect ratio | Free |
| Mobile risk | Low — it's just images | High — needs a tier strategy |

**The dividing question:** *does the user need to do anything to the object other than
scroll?* No → frames. Yes → `cinematic-3d.md`.

---

## Why not just a `<video>` with `currentTime` scrubbing

The obvious idea, and it fails in production:

- Seeking is not frame-accurate; browsers snap to keyframes, so scrubbing stutters.
- Autoplay and preload policies differ per browser and are hostile on mobile.
- iOS Safari has historically refused reliable programmatic scrubbing.
- Inter-frame compression means a random seek can require decoding a long GOP.

Teams reliably discover this after building it. Trading compactness for control is the
correct call: more bytes, but predictable behaviour on every device.

---

## Producing the frames

```bash
# Extract at 30 fps
ffmpeg -i render.mov -vf fps=30 frames/%04d.png

# Convert to WebP — this is where the 90% saving happens
for f in frames/*.png; do cwebp -q 80 "$f" -o "${f%.png}.webp"; done
```

| Decision | Take |
|---|---|
| **Format** | WebP q80. ~60 frames @1920×1080 ≈ 3–5 MB, vs 15–20 MB as PNG. AVIF is smaller still but decodes slower — bad trade when you decode on scroll |
| **Frame count** | 60–150 desktop. Real productions go to ~1,200 for long-form, but that is a bandwidth decision, not a quality one |
| **Mobile count** | ~⅔ of desktop, rendered at a smaller resolution and a taller scroll offset |
| **Resolution** | Render at the largest size the stage will occupy, not full-screen. A hero at 60vh doesn't need 1080p |
| **Sprite sheet** | Packing all frames into one WebP sheet cuts a few more % and collapses N requests into 1. Worth it above ~80 frames; watch the max texture/decode size |

---

## Runtime

```js
const canvas = document.querySelector("#seq");
const ctx = canvas.getContext("2d");
const COUNT = 90;
const src = (i) => `/frames/${String(i + 1).padStart(4, "0")}.webp`;

const cache = new Map();
const load = (i) => {
  if (cache.has(i)) return cache.get(i);
  const img = new Image();
  img.src = src(i);
  cache.set(i, img);
  return img;
};

function fit() {                       // DPR-correct sizing — skip this and Retina looks blurry
  const dpr = Math.min(devicePixelRatio, 2);
  const r = canvas.getBoundingClientRect();
  canvas.width = r.width * dpr;
  canvas.height = r.height * dpr;
}
new ResizeObserver(fit).observe(canvas);
fit();

function draw(i) {
  const img = cache.get(i);
  if (!img?.complete || !img.naturalWidth) return;   // never clear before you can redraw
  // object-fit: cover, by hand
  const s = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
  const w = img.naturalWidth * s, h = img.naturalHeight * s;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
}

// Staged preload: first 10 immediately so frame 0 is instant, rest in the background
for (let i = 0; i < 10; i++) load(i);
requestIdleCallback?.(() => { for (let i = 10; i < COUNT; i++) load(i); });

const state = { frame: 0 };
let last = 0;

gsap.to(state, {
  frame: COUNT - 1,
  ease: "none",
  snap: "frame",
  scrollTrigger: { trigger: "#stage", start: "top top", end: "bottom bottom", scrub: .5 },
  onUpdate: () => {
    const i = Math.round(state.frame);
    if (i === last) return;            // don't redraw the same frame
    const dir = i > last ? 1 : -1;
    for (let k = 1; k <= 5; k++) load(Math.min(COUNT - 1, Math.max(0, i + dir * k)));
    last = i;
    draw(i);
  },
});
```

Key points, each of which is a bug if omitted:

- **Canvas, not `<img src>` swapping.** No DOM reflow, no layout invalidation per frame.
- **DPR-correct sizing** or every frame is soft on Retina.
- **Staged preload:** first ~10 frames eagerly so the first paint is instant, remainder
  in the background without blocking.
- **Directional look-ahead:** 5 frames in the direction of travel. Cheap, and it removes
  almost all visible gaps.
- **Guard `img.complete`** before drawing, and never `clearRect` unless you're about to
  draw — otherwise fast scrolling flashes the background.
- **Skip redundant redraws** when the rounded frame index hasn't changed.

Layout is the same as the 3D case: a tall `#stage` runway with a `position: sticky`,
`height: 100vh` canvas inside it. Scroll length sets the pace — roughly 8–15 px of
scroll per frame feels natural.

---

## Fallbacks

- **Reduced motion:** render the single most representative frame as a static `<img>`.
  The story is still told, just not animated.
- **No JS:** put that same frame in the markup as the canvas's fallback content so the
  page is never empty.
- **Slow network / `saveData`:** load a shorter sequence (every 3rd frame) or drop to
  the static image. Decide before starting the preload.

---

## Related native approach

For simple cases you can do this with almost no JS using CSS scroll-driven animations
and `steps()` on a sprite sheet's `background-position`. It runs off the main thread and
degrades to frame 1. Worth checking when the sequence is short and the framing is fixed
— see `native-css.md`.

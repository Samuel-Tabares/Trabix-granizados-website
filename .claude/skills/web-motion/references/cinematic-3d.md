# Cinematic scroll-driven 3D

The Tier-4 class: an object that opens, explodes, assembles, rotates or is orbited by a
camera while the user scrolls. Watches showing their movement, phones separating into
layers, engines assembling, buildings sectioning.

Read `frame-sequence.md` first if the object never needs to react to anything except
scroll. Real-time 3D is only worth its cost when you need **interactivity** (hover a
part, click to isolate, drag to orbit), **configuration** (colorways, variants), or
**resolution independence** the pre-render can't give you.

---

## The mental model: it's a shot list, not an animation

The mistake is thinking of this as "animate the model." It isn't. The model mostly sits
still. What moves is a **camera on a dolly**, and the scroll bar is the **timecode**.

Think of a film sequence: you write down four or five shots — wide establishing,
push-in to the crown, cut to the exploded interior, pull back to hero — and the scroll
distance between them is how long each shot lasts. Everything else is interpolation.

Structure it that way in code and the whole thing becomes editable by a non-programmer:

```js
const SHOTS = [
  { at: [0,   20], camera: [0, 0.2, 6],   target: [0, 0, 0],    ease: "none" },
  { at: [20,  45], camera: [1.8, 0.4, 3], target: [0, 0.1, 0],  ease: "power1.inOut" },
  { at: [45,  75], camera: [0, 1.6, 4.5], target: [0, 0, 0],    ease: "power2.inOut" },
  { at: [75, 100], camera: [0, 0.1, 7],   target: [0, 0, 0],    ease: "none" },
];
```

Retiming the story = editing numbers in this array. No timeline surgery.

---

## Core rig

```js
gsap.registerPlugin(ScrollTrigger);

// Plain mutable objects, NOT the camera itself. The render loop reads them.
const camPos = { x: 0, y: 0.2, z: 6 };
const camTarget = { x: 0, y: 0, z: 0 };

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#stage",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,          // 1s of smoothing lag. `true` = rigid, often too twitchy for 3D
  },
});

SHOTS.forEach(({ at: [from, to], camera, target, ease }) => {
  const start = from / 100;
  const dur = (to - from) / 100;
  tl.to(camPos,    { x: camera[0], y: camera[1], z: camera[2], duration: dur, ease }, start);
  tl.to(camTarget, { x: target[0], y: target[1], z: target[2], duration: dur, ease }, start);
});

// One place applies the values, every frame.
renderer.setAnimationLoop(() => {
  camera.position.set(camPos.x, camPos.y, camPos.z);
  camera.lookAt(camTarget.x, camTarget.y, camTarget.z);
  renderer.render(scene, cam);
});
```

**Why animate a proxy object instead of `camera.position` directly:** the timeline stays
pure data, the render loop stays the single writer, and interpolation never fights with
anything else that wants to nudge the camera (mouse parallax, an intro flourish, a
"reset view" button). It is the same reason you don't let two systems own one variable.

**Why `ease: "none"` on most segments:** with `scrub`, the *scroll* is already the
easing. Adding a curve on top makes the object appear to lag behind and then catch up.
Reserve real easing for shot-to-shot transitions where you want a deliberate settle.

### Layout

```
#stage        position: relative; height: 600vh;   ← scroll runway
  canvas      position: sticky; top: 0; height: 100vh; z-index: 0
  .captions   position: relative; z-index: 10; pointer-events: none
```

`position: sticky` on the canvas is preferable to ScrollTrigger's `pin` here — no pin
spacer, no layout shift, no refresh ordering to worry about. Use `pin` only when you
need pinning *inside* a larger pinned composition.

Runway length is the pacing dial: ~100vh per shot is a comfortable default. Under 60vh
per shot the sequence feels rushed; over 200vh users think the page is broken.

---

## The exploded view specifically

An exploded view is not one animation. It is **N part-animations sharing one progress
value**, each with its own direction vector and a small stagger.

Author the offsets in the 3D file, not in code. In Blender, place an empty at each
part's exploded position; export both. Then:

```js
parts.forEach((part, i) => {
  const home = part.userData.home;       // captured at load
  const out  = part.userData.exploded;   // from the empty
  tl.to(part.position, {
    x: out.x, y: out.y, z: out.z,
    duration: 0.35,
    ease: "power2.inOut",
  }, 0.30 + i * 0.012);   // small stagger — parts peel apart, not jump together
});
```

Two things that separate a good exploded view from a demo:

- **Stagger from the outside in.** Sort parts by distance from the object's centre and
  release the outermost first. It reads as disassembly; simultaneous release reads as
  an explosion (which is the wrong metaphor for a precision object).
- **Rotate slightly while separating.** A few degrees of local rotation per part makes
  the separation feel physical instead of like a diagram. Keep it under ~8°.

For labels/callouts on parts: project the part's world position to screen space each
frame and position an absolutely-placed DOM node. DOM text stays crisp, selectable and
accessible; text rendered into WebGL is none of those.

```js
const v = new THREE.Vector3();
part.getWorldPosition(v).project(camera);
label.style.transform =
  `translate(-50%,-50%) translate(${(v.x * .5 + .5) * w}px, ${(-v.y * .5 + .5) * h}px)`;
label.style.opacity = v.z < 1 ? 1 : 0;   // hide when behind the camera
```

---

## Asset pipeline — where these projects actually die

The animation is a week. The asset pipeline is the other three. Budget accordingly.

**Target: < 3 MB total for the model.** Above that, mobile LCP collapses and the whole
effect becomes a liability.

```bash
npm i -g @gltf-transform/cli

gltf-transform optimize in.glb out.glb \
  --compress meshopt \        # or draco
  --texture-compress ktx2 \
  --texture-size 2048
```

| Decision | Take | Why |
|---|---|---|
| **Draco vs meshopt** | meshopt by default | Similar ratios with gzip, much faster decode, and it preserves morph targets and animation data that Draco discards. Draco still wins on raw ratio for huge static meshes |
| **KTX2 textures** | Always | A 200 KB PNG can occupy 20 MB+ of VRAM. KTX2 cuts GPU memory ~10× because it stays compressed on the GPU |
| **UASTC vs ETC1S** | UASTC for normal/detail maps, ETC1S for everything else | UASTC = quality, ETC1S = size. Using UASTC everywhere is the common overspend |
| **Texture size** | 2048 max, 1024 on mobile tier | Nobody sees 4K on a hero object at 40% viewport height |
| **Baked lighting** | Bake to texture wherever possible | Real-time lights and shadows are the top frame-rate cost in these scenes |
| **Draw calls** | < 100 | Merge static geometry, share materials, `InstancedMesh` for repeats. Triangle count matters far less |

Both loaders must be registered or the file silently fails to parse:

```js
const loader = new GLTFLoader()
  .setMeshoptDecoder(MeshoptDecoder)
  .setKTX2Loader(new KTX2Loader().setTranscoderPath("/basis/").detectSupport(renderer));
```

---

## Device tiers — decide before the first byte

A single build that works everywhere does not exist at this tier. Detect, then serve:

| Tier | Signal | What ships |
|---|---|---|
| Full | ≥ 1200 px, `deviceMemory ≥ 8`, no `saveData` | Full model, 2K textures, shadows, post-processing |
| Lite | ≥ 900 px, `deviceMemory ≥ 4` | Same model, 1K textures, no shadows, no post, dpr capped at 1.5 |
| Fallback | phone, `saveData`, 2G, reduced motion, or no WebGL | **Frame sequence or a static hero image + the same copy.** Not a broken canvas |

The fallback must preserve the visual language and the conversion path. A phone user
should get a shorter, quieter version of the same story — not a hole in the page.

Decide the tier **before** the dynamic import, so lower tiers never download the chunk.

---

## Performance rules specific to this pattern

- **Cap DPR:** `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`. On the Lite tier, 1.5.
- **`renderer.setAnimationLoop()`**, not hand-rolled `requestAnimationFrame` — correct
  lifecycle, and it's the only loop that works in WebXR.
- **Never allocate inside the loop.** No `new THREE.Vector3()` per frame. Hoist scratch
  objects; per-frame allocation means per-frame GC, which is exactly the stutter users
  blame on "the 3D."
- **In React Three Fiber, mutate in `useFrame`; never `setState`.** State updates per
  frame re-render the tree 60×/s. Motion values or refs only.
- **Pause off-screen and on `document.hidden`.** IntersectionObserver on the stage.
- **Preload before revealing.** Show a lightweight poster or blurred still until the
  model and textures are decoded; a Tier-4 hero that pops in half-loaded looks broken.
- **`ScrollTrigger.refresh()`** after the model loads if its size affects layout.

---

## WebGL or WebGPU?

`WebGPURenderer` is real and shipping, but treat the "just swap one import" framing with
care:

- Entry point is different: `import * as THREE from "three/webgpu"`.
- **Initialization is async.** `await renderer.init()` — forget it and you get a blank
  canvas with **no error message**. This is the #1 migration bug.
- **Custom GLSL does not carry over.** `ShaderMaterial` / `RawShaderMaterial` must be
  ported to node materials and **TSL** (Three Shading Language), which compiles to both
  WGSL and GLSL. No custom shaders → migration is close to trivial. Custom shaders →
  budget a week or more.
- `EffectComposer` passes are partially supported. Test each one.
- Three.js's own docs still describe the renderer as **experimental despite greatly
  improved maturity**. WebGPU itself has broad browser support with automatic WebGL2
  fallback through Three.js.

**Practical take:** for a scroll-driven product story with standard materials, WebGPU is
a low-risk upgrade with real gains on draw-call-heavy scenes (2–10× in specific cases,
not universally). For anything with hand-written shaders, stay on `WebGLRenderer` unless
you're committing to TSL. If the client base includes hospital networks, kiosks or old
corporate machines, WebGL remains the conservative correct answer — as documented in the
`elipsis` and `fundacion-rehabilitacion` projects.

---

## Alternatives worth naming before building this

- **Spline** — design-tool 3D, publishes an embeddable scene with scroll events. Fast to
  ship, no pipeline. Costs runtime weight and control; no state machines or skeletal
  animation. Good for a decorative hero, wrong for a precision product story.
- **Rive** — not 3D, but for a *2D* exploded/assembly diagram with interactive states it
  beats everything: designer-authored, state machine driven, files 10–15× smaller than
  Lottie, ~200 KB wasm runtime.
- **Frame sequence** — see `frame-sequence.md`. If the answer to "does the user need to
  interact with the object" is no, this is usually the better engineering decision and
  the one to recommend.

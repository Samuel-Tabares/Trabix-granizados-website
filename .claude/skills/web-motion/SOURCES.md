# Sources

What this skill was synthesised from. Research pass: **2026-08-16**.

## Own shipped work (the house pattern)

| Project | What was extracted |
|---|---|
| `~/Desktop/GROWUP/fundacion-rehabilitacion` | The canonical 3-file motion layer (`motion.css` / `motion.ts` / `hero-field.ts`), the `html.js` + 2.2 s fallback contract, `affordsWebGL()` tiering, `initMotion`/`destroyMotion` for View Transitions, Lenis-on-GSAP-ticker wiring, brand-metaphor WebGL ("bridges") |
| `~/Desktop/GROWUP/elipsis` | Multi-variant WebGL field selected per page via `data-hero-field` (helix / network / molecule / waves / drift), tuning via data attributes, hand-tracked elapsed time to survive Three.js version churn, the documented WebGL-over-WebGPU rationale for hospital networks |
| `~/Desktop/GROWUP/growup-website` | CDN/no-build GSAP setup, ScrollSmoother wrapper contract, ScrambleText nav hover, DrawSVG icon draw-in, magnetic CTAs, `quickTo` custom cursor, counters with prefix/suffix parsing |

## Skills reviewed (12)

| Skill | Source | Taken / rejected |
|---|---|---|
| `gsap-skills` (8 sub-skills: core, timeline, scrolltrigger, plugins, utils, react, performance, frameworks) | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) — official | **Taken:** ScrollTrigger rules (scrub XOR toggleActions, trigger-on-timeline-not-children, refresh ordering, `ease:"none"` with containerAnimation), `useGSAP` scope/contextSafe, cleanup patterns |
| `web-animation-skills` (9 skills incl. gsap-web, 60fps, page-transition, accessible-animation, svg, lottie) | [iart-ai/web-animation-skills](https://github.com/iart-ai/web-animation-skills) | **Taken:** the GSAP+Lenis+SplitText+Flip bundle framing. **Rejected:** "animate only transform/opacity" as an absolute — too blunt, see impeccable's materials nuance |
| `claudedesignskills` (22 skills incl. threejs-webgl, react-three-fiber, babylonjs, pixijs, locomotive, barba, spline, rive, blender-web-pipeline) | [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills) | **Taken:** breadth of the engine landscape, the authoring-tool tier (Blender/Spline/Rive). **Rejected:** its one-skill-per-library structure — 22 skills is a catalogue, not a decision aid |
| `motion-design` (LottieFiles) | [awesomeskill.ai](https://awesomeskill.ai/skill/lottiefiles-motion-design-skill-motion-design) | **Taken:** motion-personality archetypes as a framing idea. **Rejected:** Disney-principles layer — duplicates `emil-design-eng` |
| `design-motion-principles` | [awesomeskill.ai](https://awesomeskill.ai/skill/kylezantos-design-motion-principles-design-motion-principles) | **Taken:** the Create/Audit dual-mode idea |
| `ui-animation` | [awesomeskill.ai](https://awesomeskill.ai/skill/mblode-agent-skills-ui-animation) | **Taken:** asymmetric enter/exit timing, "skip animation for keyboard-initiated actions", `transition: all` ban |
| `impeccable / animate` | local — `~/.claude/skills-library/impeccable/reference/animate.md` | **Taken:** the 100/300/500 duration rule, motion-materials nuance (blur/clip-path/masks are legitimate, not just transform+opacity), perceived-performance 80 ms threshold, stagger cap |
| `emil-design-eng` | local | **Deferred to.** Owns easing curves, durations, springs, component feel. This skill routes to it rather than duplicating |
| `design-taste-frontend` | local | **Deferred to.** Owns motion-intensity dials, forbidden patterns, sticky-stack/horizontal-pan skeletons |
| `web-animation-stack` | local (2026-07) | **Absorbed** into `references/engines.md`, then deleted 2026-08-16 — this skill replaces it |
| `Frontend UI Animator` | [mcpmarket.com](https://mcpmarket.com/tools/skills/frontend-ui-animator-1) | **Rejected:** React-only, audit→plan→implement flow with no depth on scroll or 3D |
| `emilkowal-animations` (43 rules) | [lobehub](https://lobehub.com/skills/pproenca-dot-skills-emilkowal-animations) | Overlaps `emil-design-eng` entirely; no additional content taken |

## Web sources (18)

**Technique**
1. [Codrops — How to Build Cinematic 3D Scroll Experiences with GSAP](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/) — the shot-list camera rig, proxy-object pattern, CustomEase set, quickSetter for UI
2. [Codrops — Scroll-Synchronized Animation for OPTIKKA: from HTML5 video to frame sequences](https://tympanus.net/codrops/2025/10/16/creating-smooth-scroll-synchronized-animation-for-optikka-from-html5-video-to-frame-sequences/) — why video scrubbing fails, ffmpeg pipeline, staged preload, 1182/880 frame tiering
3. [Builder.io — Recreating Apple-style 3D scroll animations](https://www.builder.io/blog/webgl-scroll-animation) — normalized scroll progress → rig, framerate-independent lerp
4. [Codrops — Scroll-Reactive 3D Gallery (velocity-driven)](https://tympanus.net/codrops/2026/03/09/building-a-scroll-reactive-3d-gallery-with-three-js-velocity-and-mood-based-backgrounds/)
5. [Codrops — Scroll-Revealed WebGL Gallery with GSAP, Three.js, Astro, Barba](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)
6. [Codrops — Shader.se's scroll-driven WebGPU pipeline](https://tympanus.net/codrops/2026/05/19/80s-business-tech-seamless-scene-transitions-inside-shader-ses-scroll-driven-webgpu-pipeline/)
7. [GSAP Vault — Apple-style scroll image sequences](https://gsapvault.com/blog/scroll-image-sequence-tutorial)

**Performance & pipeline**
8. [utsubo — 100 Three.js tips that actually improve performance (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips) — <100 draw calls, KTX2 ~10× VRAM saving, disposal, mobile shader precision
9. [utsubo — Migrate Three.js to WebGPU: the complete checklist](https://www.utsubo.com/blog/webgpu-threejs-migration-guide) — `three/webgpu`, `await renderer.init()`, GLSL→TSL
10. [glTF Transform](https://gltf-transform.dev/) — the `optimize` CLI
11. [Three.js GLTFLoader docs](https://threejs.org/docs/pages/GLTFLoader.html) — Draco/KTX2/Meshopt registration
12. [Three.js TSL docs](https://threejs.org/docs/pages/TSL.html) and [WebGPURenderer manual](https://threejs.org/manual/en/webgpurenderer.html) — the "still experimental" wording

**Platform**
13. [scroll-driven-animations.style](https://scroll-driven-animations.style/) — `scroll()` vs `view()`, `animation-range`
14. [MDN — View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
15. [CSS-Tricks — Cross-document view transitions: the gotchas nobody mentions](https://css-tricks.com/cross-document-view-transitions-part-1/)
16. [GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and [GSAP Flip docs](https://gsap.com/docs/v3/Plugins/Flip/)

**Landscape**
17. [Rive vs Lottie (2026)](https://www.rivemasterclass.com/blog/rive-vs-lottie) + [PkgPulse — Lottie vs Rive vs CSS 2026](https://www.pkgpulse.com/guides/lottie-vs-rive-vs-css-animations-web-animation-formats-2026) — file-size and runtime-weight numbers
18. [Svilenković — Scrollytelling trends 2026](https://svilenkovic.com/3d/scrollytelling-trends-2026) — device-tier-before-load strategy. **Contains a false claim ("ScrollTrigger 4.0") that this skill explicitly corrects.**

## Claims corrected during research

- **"ScrollTrigger 4.0"** — invented by trend articles. npm registry: `gsap@3.15.0`.
- **"GSAP plugins require Club GreenSock"** — false since April 2025.
- **"WebGPURenderer is production-ready since r171"** — the previous `web-animation-stack`
  skill said this. Three.js's own docs still describe the renderer as experimental. The
  nuanced version (trivial without custom shaders, a real port with them) is in
  `references/cinematic-3d.md`.
- **"Motion is React-only"** — false since the 2024 rebrand.
- **npm versions** verified live on 2026-08-16, not recalled.

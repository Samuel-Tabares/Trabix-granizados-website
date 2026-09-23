/* ============================================================================
   Trabix — capa de movimiento.

   Copiada de la skill `web-motion` (assets/motion-layer), que a su vez la
   extrajo de elipsis. Tier 2: motion editorial, sin 3D.

   El campo WebGL del original se quitó a propósito. Su gate `affordsWebGL()`
   devuelve false bajo 900px de ancho, y acá el trafico objetivo es celular casi
   entero (NFC, QR, anuncios click-to-WhatsApp). Serian ~120 KB que ningun
   usuario real llega a ver.

   Unico archivo que importa GSAP. Las paginas se quedan declarativas: marcan la
   intencion con data-attributes y nunca tocan una API de animacion.

   Contrato con motion.css: si initMotion() no corre, el timeout del script
   inline del <head> quita `html.js` y todo lo pre-oculto reaparece.
   ========================================================================== */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = "power3.out";

let lenis = null;
let splits = [];

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------------------------------------------------------------------------
   Smooth scroll. Created ONCE — it survives SPA / View Transitions navigations,
   which don't reload the page.

   Driven by GSAP's ticker rather than its own RAF: two independent clocks
   produce visible micro-stutter. lagSmoothing(0) stops GSAP catching up after a
   dropped frame, which on a scrubbed timeline reads as a jump.
   ------------------------------------------------------------------------- */
function initLenis() {
  if (lenis || reduced()) return;
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  document.documentElement.style.scrollBehavior = "auto";
}

/* ---------------------------------------------------------------------------
   1. Hero entrance — the one choreographed moment on the page.
   ------------------------------------------------------------------------- */
function heroEntrance(hero) {
  const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.12 });
  const eyebrow = hero.querySelector(".hero__eyebrow");
  const title = hero.querySelector(".hero__title");

  if (eyebrow) {
    tl.fromTo(eyebrow, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.6 });
  }

  if (title) {
    // mask:"words" clips each word so it rises from behind its own baseline
    // instead of floating in from nowhere. 118 rather than 100 clears descenders.
    const split = SplitText.create(title, { type: "words,lines", mask: "words" });
    splits.push(split);
    gsap.set(title, { opacity: 1, visibility: "visible" });
    tl.from(
      split.words,
      { yPercent: 118, opacity: 0, duration: 1.05, stagger: 0.045 },
      eyebrow ? "-=0.32" : 0,
    );
  }

  const bits = $$(".hero__lead, .hero__actions, .hero__badge", hero);
  if (bits.length) {
    tl.fromTo(bits, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 }, "-=0.6");
  }

  const stat = hero.querySelector(".hero__stat");
  if (stat) tl.fromTo(stat, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.45");

  // Background rises slower than the page: cheap, convincing depth.
  const photo = hero.querySelector(".hero__bg > *");
  if (photo) {
    gsap.to(photo, {
      yPercent: 12,
      scale: 1.07,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
  }
}

/* ---------------------------------------------------------------------------
   2. Section headings — words rise behind a mask as they enter.
   ------------------------------------------------------------------------- */
function headingReveals() {
  $$("[data-split]").forEach((el) => {
    const split = SplitText.create(el, { type: "words,lines", mask: "words" });
    splits.push(split);
    gsap.from(split.words, {
      yPercent: 112,
      opacity: 0,
      duration: 0.9,
      ease: EASE,
      stagger: 0.035,
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
}

/* ---------------------------------------------------------------------------
   3. Generic reveals. gsap.from() on purpose: the resting state is the natural
   state, so a script failure leaves correct content rather than a hole.

   Use sparingly — fade-up on every section is a default, not choreography.
   ------------------------------------------------------------------------- */
function reveals() {
  $$("[data-reveal]").forEach((el) => {
    const targets = el.dataset.reveal === "stagger" ? Array.from(el.children) : [el];
    gsap.from(targets, {
      opacity: 0,
      y: 34,
      duration: 0.85,
      ease: EASE,
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });
}

/* ---------------------------------------------------------------------------
   4. Parallax inside a frame. The parent is the trigger so the drift is
   measured against the frame, not the image's own (oversized) box.
   ------------------------------------------------------------------------- */
function parallax() {
  $$("[data-parallax]").forEach((el) => {
    const depth = Number(el.dataset.parallax) || 10;
    gsap.fromTo(
      el,
      { yPercent: -depth / 2, scale: 1.12 },
      {
        yPercent: depth / 2,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}

/* ---------------------------------------------------------------------------
   5. Counters. once:true — a number that re-counts on every pass reads as a
   glitch. Pair with font-variant-numeric: tabular-nums (see motion.css).
   ------------------------------------------------------------------------- */
function counters() {
  $$(".count").forEach((el) => {
    const end = Number(el.dataset.count ?? el.textContent ?? 0);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end,
      duration: 1.6,
      ease: "power2.out",
      snap: { v: 1 },
      onUpdate: () => (el.textContent = String(Math.round(obj.v))),
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
    });
  });
}

/* ---------------------------------------------------------------------------
   6. Cursor tilt. quickTo reuses one tween instance — creating a tween per
   pointermove allocates dozens of objects a second. Fine pointers only: on
   touch there is no cursor, so this would be dead code that still listens.
   ------------------------------------------------------------------------- */
function cardTilt() {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  $$("[data-tilt]").forEach((card) => {
    gsap.set(card, { transformPerspective: 900, transformOrigin: "center" });
    const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });

    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
      ry(((e.clientX - r.left) / r.width - 0.5) * 7);
    });
    card.addEventListener("pointerleave", () => {
      rx(0);
      ry(0);
    });
  });
}

/* ---------------------------------------------------------------------------
   Lifecycle
   ------------------------------------------------------------------------- */
export function initMotion() {
  clearTimeout(window.__motionFallback);

  if (reduced()) {
    document.documentElement.classList.remove("js");
    return;
  }
  document.documentElement.classList.add("js");

  initLenis();

  const hero = document.querySelector("[data-hero]");
  if (hero) heroEntrance(hero);

  headingReveals();
  reveals();
  parallax();
  counters();
  cardTilt();

  ScrollTrigger.refresh();
}

/* Call on route leave. Without this, ScrollTrigger accumulates dead triggers,
   SplitText leaves the previous page's shredded DOM, and the GPU never frees
   anything — a smooth site becomes unusable after a handful of navigations. */
export function destroyMotion() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  splits.forEach((s) => s.revert());
  splits = [];
}

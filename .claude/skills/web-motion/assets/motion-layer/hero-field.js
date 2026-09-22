/* ============================================================================
   Hero WebGL field — "links" variant.

   Points drift through a bounded volume and draw a line to each other when they
   come close enough, releasing it as they separate. Connections forming and
   dissolving — not a generic particle preset.

   REPLACE THIS WITH YOUR OWN METAPHOR. The reason to hand-roll instead of
   dropping in Vanta.js is that the motion can mean something for the brand.
   If it doesn't, use a preset and save the code.

   Safety envelope (keep this if you rewrite the scene):
     - devicePixelRatio capped at 2;
     - fewer points below 780px;
     - IntersectionObserver + document.hidden stop the loop;
     - a WebGL failure throws, and motion.js removes the canvas.

   WebGL, not WebGPU: this is decoration on a marketing surface, and a hero that
   fails to render is worse than one that renders a little less prettily. See
   references/cinematic-3d.md for when that trade flips.
   ========================================================================== */

import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DynamicDrawUsage,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";

/* --- brand knobs ---------------------------------------------------------- */
const PALETTE = [0xc7a35a, 0x80917a, 0xf5f0e7];
const WEIGHTS = [0.5, 0.3, 0.2]; // bias toward the accent colour
const LINE_COLOR = 0xc7a35a;

/* --- scene knobs ---------------------------------------------------------- */
const LINK_DIST = 12; // distance under which two points connect
const SPREAD = { x: 78, y: 46, z: 34 };

export function mountField(mount) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  mount.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(58, 1, 0.1, 220);
  camera.position.z = 62;

  const count = innerWidth < 780 ? 90 : 170;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = PALETTE.map((hex) => new Color(hex));

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * SPREAD.x;
    positions[i3 + 1] = (Math.random() - 0.5) * SPREAD.y;
    positions[i3 + 2] = (Math.random() - 0.5) * SPREAD.z;

    velocities[i3] = (Math.random() - 0.5) * 0.035;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.03;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.025;

    const r = Math.random();
    const c = palette[r < WEIGHTS[0] ? 0 : r < WEIGHTS[0] + WEIGHTS[1] ? 1 : 2];
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  const pointGeo = new BufferGeometry();
  pointGeo.setAttribute("position", new BufferAttribute(positions, 3));
  pointGeo.setAttribute("color", new BufferAttribute(colors, 3));

  const points = new Points(
    pointGeo,
    new PointsMaterial({
      size: 0.62,
      map: dotTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: AdditiveBlending,
      sizeAttenuation: true,
    }),
  );
  scene.add(points);

  /* Links are rewritten every frame. Reserve a sane worst case (6 neighbours
     each) and use drawRange to draw only the live ones — buffers are never
     reallocated mid-render. */
  const MAX_LINKS = count * 6;
  const linkPos = new Float32Array(MAX_LINKS * 6);
  const linkGeo = new BufferGeometry();
  const linkAttr = new BufferAttribute(linkPos, 3);
  linkAttr.setUsage(DynamicDrawUsage);
  linkGeo.setAttribute("position", linkAttr);

  const links = new LineSegments(
    linkGeo,
    new LineBasicMaterial({
      color: new Color(LINE_COLOR),
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
  );
  scene.add(links);

  let pointerX = 0;
  let pointerY = 0;
  let tiltX = 0;
  let tiltY = 0;

  const onPointer = (e) => {
    const r = mount.getBoundingClientRect();
    pointerX = (e.clientX - r.left) / r.width - 0.5;
    pointerY = (e.clientY - r.top) / r.height - 0.5;
  };
  mount.parentElement?.addEventListener("pointermove", onPointer, { passive: true });

  function resize() {
    const r = mount.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(mount);
  resize();

  function step() {
    const pos = pointGeo.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i3];
      pos[i3 + 1] += velocities[i3 + 1];
      pos[i3 + 2] += velocities[i3 + 2];

      // Bounce off the volume walls so density stays constant.
      if (Math.abs(pos[i3]) > SPREAD.x / 2) velocities[i3] *= -1;
      if (Math.abs(pos[i3 + 1]) > SPREAD.y / 2) velocities[i3 + 1] *= -1;
      if (Math.abs(pos[i3 + 2]) > SPREAD.z / 2) velocities[i3 + 2] *= -1;
    }
    pointGeo.attributes.position.needsUpdate = true;

    // O(n²) over 170 points ≈ 14k comparisons — irrelevant next to one draw
    // call. Past ~400 points this needs spatial partitioning instead.
    let v = 0;
    const limit = MAX_LINKS * 6;
    for (let i = 0; i < count && v < limit; i++) {
      const i3 = i * 3;
      for (let j = i + 1; j < count && v < limit; j++) {
        const j3 = j * 3;
        const dx = pos[i3] - pos[j3];
        const dy = pos[i3 + 1] - pos[j3 + 1];
        const dz = pos[i3 + 2] - pos[j3 + 2];
        if (dx * dx + dy * dy + dz * dz > LINK_DIST * LINK_DIST) continue;
        linkPos[v++] = pos[i3];
        linkPos[v++] = pos[i3 + 1];
        linkPos[v++] = pos[i3 + 2];
        linkPos[v++] = pos[j3];
        linkPos[v++] = pos[j3 + 1];
        linkPos[v++] = pos[j3 + 2];
      }
    }
    linkAttr.needsUpdate = true;
    linkGeo.setDrawRange(0, v / 3);

    points.rotation.y += 0.0006;
    links.rotation.y = points.rotation.y;

    // Lerped pointer tilt — following the cursor 1:1 feels mechanical.
    tiltX += (pointerY * 0.24 - tiltX) * 0.045;
    tiltY += (pointerX * 0.24 - tiltY) * 0.045;
    points.rotation.x = links.rotation.x = tiltX;
    points.rotation.z = links.rotation.z = tiltY * 0.28;

    renderer.render(scene, camera);
  }

  let running = false;
  const start = () => {
    if (running) return;
    running = true;
    renderer.setAnimationLoop(step);
  };
  const stop = () => {
    running = false;
    renderer.setAnimationLoop(null);
  };

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
    { threshold: 0 },
  );
  io.observe(mount);

  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);

  requestAnimationFrame(() => mount.classList.add("is-ready"));

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    mount.parentElement?.removeEventListener("pointermove", onPointer);
    pointGeo.dispose();
    linkGeo.dispose();
    points.material.map?.dispose();
    points.material.dispose();
    links.material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

/* Soft round dot generated in canvas — avoids a PNG request and guarantees the
   falloff uses exactly the colours we want. */
function dotTexture() {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.65)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new CanvasTexture(c);
}

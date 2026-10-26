import { frontRadius } from "./sand-renderer";

/**
 * Burst FX: what the eye reads as an explosion in the sand.
 *
 * Four layers per burst, all drawn on one 2D canvas for the few seconds of the
 * opening and then gone: a shock ring and a white flash, sparks with trails
 * (the fireworks), clods of earth thrown up that fall back with gravity, and
 * soft dust that blooms and drifts. The sand under it cracks and collapses in
 * the shader at the same moment (see sand-renderer).
 */

export interface BurstOptions {
  /** Impact strength, ~1 (a tap) to ~4 (the big bang). */
  power: number;
  /** Spark colour: warm for the ground, the brand blue for the final point. */
  tint?: "ember" | "brand";
  /** Seconds to wait before it goes off. */
  delay?: number;
}

interface Spark {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  width: number;
  hot: boolean;
}
interface Clod {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  size: number;
  shape: number[];
  tone: number;
  age: number;
  life: number;
}
interface Puff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  grow: number;
  alpha: number;
  age: number;
  life: number;
}
interface Ring {
  x: number;
  y: number;
  power: number;
  age: number;
  tint: "ember" | "brand";
}

export interface BurstFX {
  burst(x: number, y: number, options: BurstOptions): void;
  clear(): void;
  dispose(): void;
}

const GRAVITY = 1500;

function rgb(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}
function channels(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const mix = (a: number[], b: number[], t: number) =>
  a.map((v, i) => Math.round(v + (b[i] - v) * t));
const css = (c: number[], alpha = 1) => `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function createBurstFX(canvas: HTMLCanvasElement, density = 1): BurstFX | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const sparks: Spark[] = [];
  const clods: Clod[] = [];
  const puffs: Puff[] = [];
  const rings: Ring[] = [];
  const pending: { at: number; run: () => void }[] = [];
  let width = 1;
  let height = 1;
  let frame = 0;
  let last = 0;
  let clock = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  const palette = () => {
    const dark = document.documentElement.classList.contains("dark");
    const page = channels(rgb("--page", dark ? "#0a0c10" : "#f2efe8"));
    const ink = channels(rgb("--ink", dark ? "#f2efe8" : "#111317"));
    return {
      dark,
      ember: channels(rgb("--ember", "#ff6a3d")),
      brand: channels(rgb("--brand", "#1f4bff")),
      // Earth: sand a few shades darker than the bed, never the page colour.
      earth: dark ? mix(page, [200, 180, 150], 0.55) : mix(page, [90, 74, 56], 0.55),
      earthLight: dark ? mix(page, [235, 220, 195], 0.7) : mix(page, [150, 128, 100], 0.4),
      dust: dark ? [140, 130, 114] : [112, 94, 74],
      ink,
    };
  };

  const spawn = (x: number, y: number, o: BurstOptions) => {
    const power = o.power;
    const k = density;
    rings.push({ x, y, power, age: 0, tint: o.tint ?? "ember" });
    // Sparks: the fireworks. Fast, with drag and a trail, falling late.
    const sparkCount = Math.round((40 + 34 * power) * k);
    for (let i = 0; i < sparkCount; i++) {
      const a = rand(0, Math.PI * 2);
      const speed = rand(220, 760 + 150 * power) * (0.7 + Math.random() * 0.5);
      sparks.push({
        x,
        y,
        px: x,
        py: y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed * 0.82 - rand(0, 160),
        age: 0,
        life: rand(0.55, 1.15),
        width: rand(0.9, 2.2),
        hot: Math.random() < 0.35,
      });
    }
    // Clods of earth: heavy, thrown mostly up, they come back down.
    const clodCount = Math.round((8 + 7 * power) * k);
    for (let i = 0; i < clodCount; i++) {
      const a = -Math.PI * rand(0.08, 0.92);
      const speed = rand(260, 700 + 90 * power);
      const verts = 5 + Math.floor(Math.random() * 2);
      clods.push({
        x: x + rand(-14, 14),
        y: y + rand(-6, 8),
        vx: Math.cos(a) * speed * 0.8,
        vy: Math.sin(a) * speed,
        angle: rand(0, Math.PI * 2),
        spin: rand(-9, 9),
        size: rand(2.5, 6 + power * 1.4),
        shape: Array.from({ length: verts }, () => rand(0.65, 1.2)),
        tone: Math.random(),
        age: 0,
        life: rand(0.9, 1.7),
      });
    }
    // Dust: slow soft clouds that bloom out of the impact and drift up.
    const puffCount = Math.round((5 + 2.5 * power) * k);
    for (let i = 0; i < puffCount; i++) {
      const a = rand(0, Math.PI * 2);
      const d = rand(0, 26 + 10 * power);
      puffs.push({
        x: x + Math.cos(a) * d,
        y: y + Math.sin(a) * d * 0.6,
        vx: Math.cos(a) * rand(20, 90),
        vy: rand(-110, -20),
        radius: rand(16, 30),
        grow: rand(70, 120 + 30 * power),
        alpha: rand(0.3, 0.5),
        age: 0,
        life: rand(1.3, 2.3),
      });
    }
  };

  // Read the theme colours once per run of the effect, not on every frame.
  let cached: ReturnType<typeof palette> | null = null;
  const draw = (dt: number) => {
    const pal = (cached ??= palette());
    ctx.clearRect(0, 0, width, height);

    // Dust sits under everything else.
    for (let i = puffs.length - 1; i >= 0; i--) {
      const p = puffs[i];
      p.age += dt;
      if (p.age >= p.life) {
        puffs.splice(i, 1);
        continue;
      }
      const u = p.age / p.life;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.exp(-1.6 * dt);
      p.vy *= Math.exp(-1.2 * dt);
      const r = p.radius + p.grow * (1 - Math.exp(-3 * p.age));
      const a =
        p.alpha * (pal.dark ? 0.32 : 1) * Math.sin(Math.min(1, u * 5) * Math.PI * 0.5) * (1 - u) ** 1.6;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, css(pal.dust, a));
      g.addColorStop(0.55, css(pal.dust, a * 0.5));
      g.addColorStop(1, css(pal.dust, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shock rings and the flash of the first instant.
    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i];
      ring.age += dt;
      if (ring.age > 0.7) {
        rings.splice(i, 1);
        continue;
      }
      const r = frontRadius(ring.age, ring.power);
      const fade = (1 - ring.age / 0.7) ** 2;
      const tint = ring.tint === "brand" ? pal.brand : pal.ember;
      const flash = Math.exp(-ring.age * 16);
      if (flash > 0.02) {
        const fr = 90 + 70 * ring.power;
        const g = ctx.createRadialGradient(ring.x, ring.y, 0, ring.x, ring.y, fr);
        g.addColorStop(0, `rgba(255,250,238,${0.9 * flash})`);
        g.addColorStop(0.35, css(mix([255, 246, 230], tint, 0.4), 0.45 * flash));
        g.addColorStop(1, "rgba(255,246,230,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, fr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.lineWidth = Math.max(1, 3.4 * fade * (0.6 + 0.2 * ring.power));
      ctx.strokeStyle = pal.dark ? `rgba(255,244,225,${0.75 * fade})` : css(pal.ink, 0.45 * fade);
      ctx.beginPath();
      ctx.ellipse(ring.x, ring.y, r * 1.06, r * 0.9, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Clods: dark polygons with a lit edge, falling back with the weight of earth.
    for (let i = clods.length - 1; i >= 0; i--) {
      const c = clods[i];
      c.age += dt;
      if (c.age >= c.life) {
        clods.splice(i, 1);
        continue;
      }
      c.vy += GRAVITY * dt;
      c.vx *= Math.exp(-0.7 * dt);
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.angle += c.spin * dt;
      const u = c.age / c.life;
      const alpha = Math.min(1, (1 - u) * 3);
      const body = mix(pal.earth, pal.earthLight, c.tone * 0.6);
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);
      ctx.beginPath();
      c.shape.forEach((m, k) => {
        const a = (k / c.shape.length) * Math.PI * 2;
        const px = Math.cos(a) * c.size * m;
        const py = Math.sin(a) * c.size * m * 0.8;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fillStyle = css(body, alpha);
      ctx.fill();
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = css(pal.earthLight, alpha * 0.7);
      ctx.stroke();
      ctx.restore();
    }

    // Sparks: additive on dark sand, plain coloured strokes on light sand.
    ctx.lineCap = "round";
    ctx.globalCompositeOperation = pal.dark ? "lighter" : "source-over";
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.age += dt;
      if (s.age >= s.life) {
        sparks.splice(i, 1);
        continue;
      }
      s.px = s.x;
      s.py = s.y;
      s.vx *= Math.exp(-2.4 * dt);
      s.vy = s.vy * Math.exp(-2.4 * dt) + 620 * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const u = s.age / s.life;
      const a = (1 - u) ** 1.3;
      // Trail stretches with speed: a streak, not a dot.
      const tx = s.x - s.vx * 0.06;
      const ty = s.y - s.vy * 0.06;
      const tint = s.hot || u < 0.18 ? [255, 236, 190] : pal.ember;
      ctx.lineWidth = s.width * 3;
      ctx.strokeStyle = css(pal.ember, 0.34 * a);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      ctx.lineWidth = s.width;
      ctx.strokeStyle = css(pal.dark ? tint : mix(tint, pal.ink, 0.15), a);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  };

  const alive = () =>
    sparks.length + clods.length + puffs.length + rings.length + pending.length > 0;

  const loop = (time: number) => {
    const dt = Math.min(0.033, last ? (time - last) / 1000 : 0.016);
    last = time;
    clock += dt;
    for (let i = pending.length - 1; i >= 0; i--) {
      if (pending[i].at <= clock) {
        pending[i].run();
        pending.splice(i, 1);
      }
    }
    draw(dt);
    if (alive() && document.visibilityState === "visible") frame = requestAnimationFrame(loop);
    else {
      frame = 0;
      last = 0;
      cached = null;
      ctx.clearRect(0, 0, width, height);
    }
  };
  const wake = () => {
    if (!frame) {
      last = 0;
      frame = requestAnimationFrame(loop);
    }
  };

  return {
    burst(x, y, options) {
      const rect = canvas.getBoundingClientRect();
      const lx = x - rect.left;
      const ly = y - rect.top;
      const delay = options.delay ?? 0;
      if (delay > 0) pending.push({ at: clock + delay, run: () => spawn(lx, ly, options) });
      else spawn(lx, ly, options);
      wake();
    },
    clear() {
      sparks.length = clods.length = puffs.length = rings.length = pending.length = 0;
      ctx.clearRect(0, 0, width, height);
    },
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
    },
  };
}

"use client";

import { useEffect, useRef, type RefObject } from "react";
import { sandCrack } from "../../lib/tectonic";

/**
 * SandField — the hero floor is a sand bed lit at a grazing angle.
 * Impacts are damped radial waves in a height field; the GPU shades every pixel,
 * the CPU only uploads up to MAX_IMPACTS vec4s per frame and sleeps when the sand is still.
 */

const MAX_IMPACTS = 8;
const LIFE_S = 6;
// Sand grains read as coarse anyway; a fixed sub-1x scale keeps fill cost flat on retina and 4K.
const RENDER_SCALE = 0.75;
const AMBIENT_MS = 14_000;
const IDLE_BEFORE_AMBIENT_MS = 5_000;

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform vec4 uImpacts[${MAX_IMPACTS}];
uniform vec3 uBase;
uniform vec3 uTone;
uniform vec3 uAccent;
uniform float uStrength;
uniform float uGrain;
uniform float uSpark;
uniform vec4 uCrack; // centre x, y (px), half length (px), open 0..1
uniform float uGlow;
uniform vec3 uEmber;

const float LIFE = ${LIFE_S.toFixed(1)};
const float SPEED = 950.0;
const float DRAG = 1.15;
const float WIDTH = 22.0;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Height of the sand bed at p (CSS px, y down). wave = local wavefront energy.
float field(vec2 p, float warp, float rough, out float wave) {
  // Aeolian ripples: sharp crest, long gentle back, combed by a slow warp.
  float phase = fract(dot(p, vec2(0.016, 0.006)) + warp * 3.0);
  float h = (smoothstep(0.0, 0.78, phase) - smoothstep(0.78, 1.0, phase)) * 0.5
          + (rough - 0.5) * 0.18;
  wave = 0.0;
  for (int i = 0; i < ${MAX_IMPACTS}; i++) {
    vec4 im = uImpacts[i];
    float t = uTime - im.z;
    if (im.w <= 0.0 || t < 0.0 || t > LIFE) continue;
    float k = im.w * (1.0 - smoothstep(LIFE - 1.5, LIFE, t));
    float r = length(p - im.xy);
    float R = SPEED * (1.0 - exp(-DRAG * t)) / DRAG;
    float d = r - R;
    // Ragged front: grains do not move as a fluid.
    float front = exp(-d * d / (2.0 * WIDTH * WIDTH)) * exp(-1.4 * t) * (0.55 + rough * 0.9);
    // Fine concentric ridges the grains settle into behind the front.
    float ridges = (1.0 - smoothstep(R - 60.0, R, r)) * sin(r * 0.21)
                 * exp(-r / 380.0) * 0.22 * exp(-0.5 * t);
    // Crater with a raised rim; it settles slowly.
    float crater = (exp(-pow((r - 34.0) / 14.0, 2.0)) * 0.7 - exp(-r * r / 700.0) * 1.1)
                 * exp(-0.3 * t);
    wave += front * k;
    h += (front * 1.6 + ridges + crater) * k;
  }
  return h;
}

// Distance-based breach in the sand. depth: 0 at the lip, 1 on the centreline.
float breach(vec2 p, out float lip, out float depth) {
  lip = 0.0;
  depth = 0.0;
  if (uCrack.w <= 0.001) return 0.0;
  vec2 q = p - uCrack.xy;
  float along = abs(q.x) / uCrack.z;
  float reach = 1.0 - smoothstep(uCrack.w * 1.1 - 0.12, uCrack.w * 1.1, along);
  if (reach <= 0.0) return 0.0;
  float centre = (vnoise(vec2(q.x * 0.016, 3.1)) - 0.5) * 54.0
               + (vnoise(vec2(q.x * 0.075, 7.7)) - 0.5) * 12.0;
  float width = uCrack.w * 24.0 * pow(max(0.0, 1.0 - along), 0.6) * reach
              + (vnoise(vec2(q.x * 0.22, 1.3)) - 0.5) * 3.0 * uCrack.w;
  float d = abs(q.y - centre);
  float inside = 1.0 - smoothstep(width - 1.0, width + 1.0, d);
  lip = exp(-pow((d - width - 7.0) / 7.0, 2.0)) * reach * uCrack.w;
  depth = clamp(1.0 - d / max(width, 0.001), 0.0, 1.0) * inside;
  return inside;
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 p = vec2(px.x, uRes.y * uDpr - px.y) / uDpr;
  vec2 cell = floor(p);
  // Two octaves so crest lines meander and fork like real wind ripples.
  float warp = vnoise(p * 0.0025) + vnoise(p * 0.011) * 0.25;
  float rough = vnoise(p * 0.045);
  float wave;
  float h = field(p, warp, rough, wave);
  float lip;
  float depth;
  float inside = breach(p, lip, depth);
  // Raised, crumbling lips catch the light; grains near the rim keep moving.
  h += lip * (1.6 + rough);
  wave += lip * 0.7;
  // Slopes from screen derivatives: one field evaluation per pixel instead of three.
  vec2 slope = vec2(dFdx(h), -dFdy(h)) * uDpr;
  vec3 n = normalize(vec3(-slope * 6.0, 1.0));
  vec3 light = normalize(vec3(-0.6, -0.55, 0.45)); // grazing, from the top left
  float shade = dot(n, light) - light.z;
  // Grains: coarse and fine, some darker; they jitter while a front passes.
  float g1 = hash(cell);
  float jig = hash(cell + floor(uTime * 24.0) * 7.31);
  g1 = mix(g1, jig, min(wave * 1.6, 1.0));
  float grain = (g1 - 0.5) * 0.65 + (hash(floor(p * 0.5) + 17.0) - 0.5) * 0.35;
  float dark = step(0.93, hash(cell + 5.7)) * 0.6;
  float spark = step(0.9965, hash(cell + 3.1)) * max(shade + 0.08, 0.0);
  // Fade the bed into the flat page colour before the next section.
  float edge = smoothstep(uRes.y, uRes.y * 0.78, p.y);
  vec3 col = uBase + uTone * (shade * uStrength + (grain - dark) * uGrain) * edge;
  col += uAccent * min(wave, 1.0) * 0.025 * edge;
  col += spark * uSpark * edge;
  // Inside the breach: deep shadow, lit from below by ember light.
  vec3 abyss = mix(uBase * 0.12, uEmber * (0.35 + 0.65 * depth), uGlow * depth);
  col = mix(col, abyss, inside);
  col += uEmber * lip * uGlow * 0.18;
  gl_FragColor = vec4(col, 1.0);
}
`;

function readHex(name: string, fallback: [number, number, number]) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const match = /^#([0-9a-f]{6})$/i.exec(value);
  if (!match) return fallback;
  const n = parseInt(match[1], 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] as const;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("SandField shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface SandFieldProps {
  stageRef: RefObject<HTMLElement | null>;
  /** When false the sand renders one still frame and ignores impacts. */
  enabled: boolean;
}

export function SandField({ stageRef, enabled }: SandFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    });
    if (!gl || !gl.getExtension("OES_standard_derivatives")) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("SandField link:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("uRes");
    const uDpr = u("uDpr");
    const uTime = u("uTime");
    const uImpacts = u("uImpacts");
    const uBase = u("uBase");
    const uTone = u("uTone");
    const uAccent = u("uAccent");
    const uStrength = u("uStrength");
    const uGrain = u("uGrain");
    const uSpark = u("uSpark");
    const uCrack = u("uCrack");
    const uGlow = u("uGlow");
    const uEmber = u("uEmber");

    // x, y (CSS px in the stage), start time (s), amplitude. Ring buffer.
    const impacts = new Float32Array(MAX_IMPACTS * 4);
    let nextSlot = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let visible = true;
    let lost = false;
    let lastUserAction = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const now = () => performance.now() / 1000;

    const applyTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      gl.uniform3fv(uBase, readHex("--page", dark ? [0.04, 0.05, 0.06] : [0.95, 0.94, 0.91]));
      gl.uniform3fv(uAccent, readHex("--brand", [0.12, 0.29, 1]));
      gl.uniform3fv(uTone, dark ? [0.85, 0.9, 1] : [0.82, 0.9, 1.08]);
      gl.uniform1f(uStrength, dark ? 0.08 : 0.1);
      gl.uniform1f(uGrain, dark ? 0.045 : 0.075);
      gl.uniform1f(uSpark, dark ? 0.22 : 0.08);
      gl.uniform3fv(uEmber, readHex("--ember", [1, 0.3, 0.1]));
    };

    const alive = (t: number) => {
      for (let i = 0; i < MAX_IMPACTS; i++) {
        const amp = impacts[i * 4 + 3];
        if (amp > 0 && t - impacts[i * 4 + 2] < LIFE_S) return true;
      }
      return false;
    };

    const draw = () => {
      frame = 0;
      if (lost) return;
      const t = now();
      gl.uniform1f(uTime, t);
      gl.uniform4fv(uImpacts, impacts);
      gl.uniform4f(
        uCrack,
        sandCrack.x * width,
        sandCrack.y * height,
        sandCrack.length * width,
        sandCrack.open,
      );
      gl.uniform1f(uGlow, sandCrack.glow);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (enabled && visible && !document.hidden && alive(t))
        frame = requestAnimationFrame(draw);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const impact = (x: number, y: number, amplitude: number) => {
      if (!enabled) return;
      const o = nextSlot * 4;
      impacts[o] = x;
      impacts[o + 1] = y;
      impacts[o + 2] = now();
      impacts[o + 3] = amplitude;
      nextSlot = (nextSlot + 1) % MAX_IMPACTS;
      wake();
    };
    const impactAtClient = (clientX: number, clientY: number, amplitude: number) => {
      const rect = stage.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      lastUserAction = Date.now();
      impact(x, y, amplitude);
    };

    const resize = () => {
      dpr = RENDER_SCALE;
      width = stage.clientWidth;
      height = stage.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, width, height);
      gl.uniform1f(uDpr, dpr);
      wake();
    };

    const onPointerDown = (e: PointerEvent) => {
      // Links and buttons dispatch their own tectonic impact.
      if ((e.target as HTMLElement | null)?.closest("a, button")) return;
      impactAtClient(e.clientX, e.clientY, 1.3);
    };
    const onTectonic = (e: Event) => {
      const { x, y, intensity = 1 } =
        (e as CustomEvent<{ x?: number; y?: number; intensity?: number }>).detail ?? {};
      impactAtClient(x ?? innerWidth / 2, y ?? innerHeight / 2, intensity);
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    applyTheme();
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const themeObserver = new MutationObserver(() => {
      applyTheme();
      wake();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    visibilityObserver.observe(stage);
    stage.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("tectonic-impact", onTectonic);
    window.addEventListener("sand-wake", wake);
    document.addEventListener("visibilitychange", wake);
    canvas.addEventListener("webglcontextlost", onLost);

    let ambient: ReturnType<typeof setInterval> | undefined;
    if (enabled) {
      ambient = setInterval(() => {
        if (!visible || document.hidden) return;
        if (Date.now() - lastUserAction < IDLE_BEFORE_AMBIENT_MS) return;
        impact(width * (0.3 + Math.random() * 0.4), height * (0.35 + Math.random() * 0.3), 0.3);
      }, AMBIENT_MS);
    }

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      clearInterval(ambient);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      stage.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("tectonic-impact", onTectonic);
      window.removeEventListener("sand-wake", wake);
      document.removeEventListener("visibilitychange", wake);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [stageRef, enabled]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

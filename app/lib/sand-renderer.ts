/**
 * Sand renderer — the hero floor is a sand bed lit at a grazing angle.
 * Impacts are damped radial waves in a height field; the GPU shades every pixel,
 * the CPU only uploads up to MAX_IMPACTS vec4s per frame and sleeps when the sand is still.
 *
 * It only touches the canvas it is given, so the same code runs inside a Web
 * Worker on an OffscreenCanvas (the default) or on the main thread as a fallback.
 */

export const MAX_IMPACTS = 8;
const SPEED = 950;
const DRAG = 1.15;

/** Radius (CSS px) of an impact's front after t seconds; mirrors the shader. */
export function frontRadius(t: number, amplitude: number) {
  const power = Math.min(amplitude, 4);
  return (SPEED * (0.7 + 0.3 * power) * (1 - Math.exp(-DRAG * Math.max(t, 0)))) / DRAG;
}
const LIFE_S = 6;
// Sand grains read as coarse anyway; a fixed sub-1x scale keeps fill cost flat on retina and 4K.
const RENDER_SCALE = 0.75;

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
uniform float uPour; // 0..1 grains still sliding down the walls

const float LIFE = ${LIFE_S.toFixed(1)};
const float SPEED = ${SPEED.toFixed(1)};
const float DRAG = ${DRAG.toFixed(2)};
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
float field(vec2 p, float warp, float rough, out float wave, out float blast) {
  // Aeolian ripples: sharp crest, long gentle back, combed by a slow warp.
  float phase = fract(dot(p, vec2(0.016, 0.006)) + warp * 3.0);
  float h = (smoothstep(0.0, 0.78, phase) - smoothstep(0.78, 1.0, phase)) * 0.5
          + (rough - 0.5) * 0.18;
  wave = 0.0;
  blast = 0.0;
  for (int i = 0; i < ${MAX_IMPACTS}; i++) {
    vec4 im = uImpacts[i];
    float t = uTime - im.z;
    if (im.w <= 0.0 || t < 0.0 || t > LIFE) continue;
    float k = im.w * (1.0 - smoothstep(LIFE - 1.5, LIFE, t));
    float r = length(p - im.xy);
    // Stronger impacts travel further and carry a wider front.
    float power = min(im.w, 4.0);
    float R = SPEED * (0.7 + 0.3 * power) * (1.0 - exp(-DRAG * t)) / DRAG;
    float d = r - R;
    float w = WIDTH * (0.8 + 0.25 * power);
    // Ragged front: grains do not move as a fluid.
    float front = exp(-d * d / (2.0 * w * w)) * exp(-1.4 * t) * (0.55 + rough * 0.9);
    // A blast also lifts dust on the front and leaves a shadowed trough behind it.
    float trough = exp(-pow((d + w * 3.2) / (w * 2.0), 2.0)) * exp(-1.1 * t);
    blast += (front * 1.2 - trough * 0.6) * max(im.w - 1.5, 0.0);
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

// The sand splits: distance to a jagged centreline. side runs -1 (upper wall)
// to 1 (lower wall); depth is 0 at the rim and 1 on the floor of the split.
float breach(vec2 p, out float lip, out float side, out float depth) {
  lip = 0.0;
  side = 0.0;
  depth = 0.0;
  if (uCrack.w <= 0.001) return 0.0;
  vec2 q = p - uCrack.xy;
  float along = abs(q.x) / uCrack.z;
  float reach = 1.0 - smoothstep(uCrack.w * 1.1 - 0.12, uCrack.w * 1.1, along);
  if (reach <= 0.0) return 0.0;
  float centre = (vnoise(vec2(q.x * 0.016, 3.1)) - 0.5) * 54.0
               + (vnoise(vec2(q.x * 0.075, 7.7)) - 0.5) * 12.0;
  float taper = pow(max(0.0, 1.0 - along), 0.6) * reach;
  float width = uCrack.w * 28.0 * taper
              + (vnoise(vec2(q.x * 0.22, 1.3)) - 0.5) * 5.0 * uCrack.w;
  // Grain-sized crumbs on the rim, so the edge never reads as a drawn line.
  float crumb = (hash(floor(p * 0.5) + 2.3) - 0.5) * 3.0 * uCrack.w;
  float offset = q.y - centre;
  float d = abs(offset);
  float inside = 1.0 - smoothstep(width - 1.0, width + 1.0, d + crumb);
  lip = exp(-pow((d - width - 8.0) / 9.0, 2.0)) * taper * uCrack.w;
  side = clamp(offset / max(width, 0.001), -1.0, 1.0);
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
  float blast;
  float h = field(p, warp, rough, wave, blast);
  float lip;
  float side;
  float depth;
  float inside = breach(p, lip, side, depth);
  // Sand pushed up on both rims catches the grazing light like any ridge.
  h += lip * (1.4 + rough);
  wave += lip * 0.5;
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
  // Grains thrown over the rims.
  dark = max(dark, step(0.82, hash(cell + 9.1)) * min(lip, 1.0) * 0.7);
  float spark = step(0.9965, hash(cell + 3.1)) * max(shade + 0.08, 0.0);
  // Fade the bed into the flat page colour before the next section.
  float edge = smoothstep(uRes.y, uRes.y * 0.78, p.y);
  vec3 col = uBase + uTone * (shade * uStrength + (grain - dark) * uGrain) * edge;
  col += uAccent * min(wave, 1.0) * 0.025 * edge;
  col += spark * uSpark * edge;
  // The blast front reads as light on the sand, its wake as shade.
  col += vec3(1.0, 0.97, 0.92) * clamp(blast, -0.6, 1.4) * 0.07;
  // Inside the split it is the same sand in its own shadow: the lower wall
  // faces the light, the upper one and the floor fall away into shade.
  float wall = smoothstep(-1.0, 1.0, side);
  float shadow = mix(0.5, 0.84, wall) - depth * depth * 0.2;
  vec3 pit = uBase * shadow * vec3(1.0, 0.95, 0.88)
           + uTone * ((grain - dark) * uGrain * 1.4 + wall * uStrength * 0.3);
  // While the split is fresh, grains keep sliding down the walls.
  float pour = step(0.93, hash(vec2(cell.x, floor(cell.y * 0.3 - uTime * 20.0))));
  pit += uBase * pour * (1.0 - depth) * uPour * 0.22;
  col = mix(col, pit, inside);
  gl_FragColor = vec4(col, 1.0);
}
`;

type RGB = [number, number, number];

export interface SandTheme {
  base: RGB;
  accent: RGB;
  tone: RGB;
  strength: number;
  grain: number;
  spark: number;
}

/** Fractions of the stage, see sandCrack in lib/tectonic. */
export interface SandCrackState {
  x: number;
  y: number;
  length: number;
  open: number;
  pour: number;
}

/** Messages the main thread sends to the sand worker. */
export type SandMessage =
  | { type: "init"; canvas: OffscreenCanvas }
  | { type: "resize"; width: number; height: number }
  | { type: "theme"; theme: SandTheme }
  | { type: "impact"; x: number; y: number; amplitude: number }
  | { type: "crack"; crack: SandCrackState }
  | { type: "state"; enabled: boolean; visible: boolean }
  | { type: "dispose" };

export interface SandRenderer {
  resize(width: number, height: number): void;
  theme(theme: SandTheme): void;
  impact(x: number, y: number, amplitude: number): void;
  crack(crack: SandCrackState): void;
  state(enabled: boolean, visible: boolean): void;
  dispose(): void;
}

type AnyCanvas = HTMLCanvasElement | OffscreenCanvas;

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

// Dedicated workers have requestAnimationFrame in current engines; older ones get a timer.
const frameApi = (): [(cb: () => void) => number, (id: number) => void] =>
  typeof requestAnimationFrame === "function"
    ? [requestAnimationFrame, cancelAnimationFrame]
    : [(cb) => setTimeout(cb, 16) as unknown as number, (id) => clearTimeout(id)];

/** Returns null when WebGL (or the derivatives extension) is unavailable. */
export function createSandRenderer(canvas: AnyCanvas): SandRenderer | null {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    alpha: false,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
  }) as WebGLRenderingContext | null;
  if (!gl || !gl.getExtension("OES_standard_derivatives")) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("SandField link:", gl.getProgramInfoLog(program));
    return null;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
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
  const uPour = u("uPour");

  const [requestFrame, cancelFrame] = frameApi();
  // x, y (CSS px in the stage), start time (s), amplitude. Ring buffer.
  const impacts = new Float32Array(MAX_IMPACTS * 4);
  const split: SandCrackState = { x: 0.5, y: 0.5, length: 0.46, open: 0, pour: 0 };
  let nextSlot = 0;
  let width = 1;
  let height = 1;
  let frame = 0;
  let enabled = true;
  let visible = true;
  let lost = false;
  const now = () => performance.now() / 1000;

  const alive = (t: number) => {
    if (split.open > 0.001) return true;
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
    gl.uniform4f(uCrack, split.x * width, split.y * height, split.length * width, split.open);
    gl.uniform1f(uPour, split.pour);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (enabled && visible && alive(t)) frame = requestFrame(draw);
  };
  const wake = () => {
    if (!frame) frame = requestFrame(draw);
  };

  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    cancelFrame(frame);
    frame = 0;
  };
  canvas.addEventListener("webglcontextlost", onLost);

  return {
    resize(w, h) {
      width = w;
      height = h;
      canvas.width = Math.max(1, Math.round(w * RENDER_SCALE));
      canvas.height = Math.max(1, Math.round(h * RENDER_SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uDpr, RENDER_SCALE);
      wake();
    },
    theme(theme) {
      gl.uniform3fv(uBase, theme.base);
      gl.uniform3fv(uAccent, theme.accent);
      gl.uniform3fv(uTone, theme.tone);
      gl.uniform1f(uStrength, theme.strength);
      gl.uniform1f(uGrain, theme.grain);
      gl.uniform1f(uSpark, theme.spark);
      wake();
    },
    impact(x, y, amplitude) {
      if (!enabled) return;
      const o = nextSlot * 4;
      impacts[o] = x;
      impacts[o + 1] = y;
      impacts[o + 2] = now();
      impacts[o + 3] = amplitude;
      nextSlot = (nextSlot + 1) % MAX_IMPACTS;
      wake();
    },
    crack(next) {
      Object.assign(split, next);
      wake();
    },
    state(nextEnabled, nextVisible) {
      enabled = nextEnabled;
      visible = nextVisible;
      wake();
    },
    dispose() {
      cancelFrame(frame);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}

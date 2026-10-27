"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { Lang } from "../../types";
import { WELCOME_WORDS } from "../../data/welcome";
import { frontRadius } from "../../lib/sand-renderer";
import { BLAST } from "../../hooks/useHeroCinematic";
import { ShockType, type ShockTypeHandle } from "./ShockType";

/**
 * Overture — the welcome gets its own screen, then is blown open.
 *
 * 1 · Load: one hairline fills with real readiness (fonts and page); no numbers.
 * 2 · Welcome: the word lands full width; its own weight sends a small shock.
 * 3 · Implosion: the letters are pulled into the centre, narrower and heavier,
 *     until the word is a point.
 * 4 · Blast: one inverted frame, then the screen tears open from the centre.
 *     The hole is the shockwave front: its radius is frontRadius(), the same
 *     curve the sand under it follows, so the wave crosses from one surface to
 *     the other without a seam. Debris rides the rim; the hero takes over.
 */

const MIN_LOAD_S = 0.9;
const MAX_LOAD_S = 2.6;
const HOLE_S = 1.25;
// Joined scripts lose their shaping when split into letters.
const WHOLE_WORD = new Set<Lang>(["ar", "hi"]);

interface Debris {
  angle: number;
  speed: number;
  size: number;
  spin: number;
}

function readColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function Overture({ lang, onCleared }: { lang: Lang; onCleared: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<ShockTypeHandle>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gone, setGone] = useState(false);
  const word = WELCOME_WORDS[lang] ?? WELCOME_WORDS.en;

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const wordEl = wordRef.current?.element();
    if (!root || !canvas || !wordEl) return;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const chars = Array.from(wordEl.querySelectorAll<HTMLElement>("[data-char]"));
    const line = wordEl.querySelector<HTMLElement>("[data-shock-line]");

    // ── 1 · Load: progress follows real readiness, never faster than MIN_LOAD_S.
    let ready = document.readyState === "complete" ? 0.5 : 0;
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => (ready += 0.5)).catch(() => (ready += 0.5));
    const onLoad = () => (ready += 0.5);
    if (document.readyState !== "complete") window.addEventListener("load", onLoad, { once: true });
    const counter = { value: 0 };
    const started = performance.now();
    let loading = 0;
    const paintCount = () => {
      const v = Math.min(100, Math.round(counter.value));
      if (ruleRef.current) ruleRef.current.style.transform = `scaleX(${v / 100})`;
    };
    const tl = gsap.timeline({ paused: true });

    const loadStep = () => {
      const elapsed = (performance.now() - started) / 1000;
      const byTime = Math.min(1, elapsed / MIN_LOAD_S);
      // Hold at 90 until the page is really there (or the cap runs out).
      const target = elapsed > MAX_LOAD_S ? 100 : Math.min(byTime * 100, ready >= 1 ? 100 : 90);
      counter.value += (target - counter.value) * 0.18;
      if (target === 100 && counter.value > 99.4) counter.value = 100;
      paintCount();
      if (counter.value >= 100) tl.play();
      else loading = requestAnimationFrame(loadStep);
    };

    // ── 2 · Welcome
    const landed = 0.3 + 0.42 + 0.035 * Math.floor(chars.length / 2);
    gsap.set(chars, { yPercent: -110, opacity: 1 });
    if (line) gsap.set(line, { clipPath: "inset(-4% -6% -30% -6%)" });
    tl.to(ruleRef.current, { scaleX: 0, transformOrigin: "50% 50%", duration: 0.42, ease: "power3.in" }, 0.12)
      .to(ruleRef.current?.parentElement ?? [], { opacity: 0, duration: 0.42 }, 0.12)
      .to(chars, {
        yPercent: 0,
        duration: 0.42,
        ease: "power4.in",
        stagger: { each: 0.035, from: "center" },
      }, 0.3)
      // Landing: the word's own weight sends a shock along it.
      .add(() => {
        const box = wordEl.getBoundingClientRect();
        wordRef.current?.shock(box.left + box.width / 2, box.bottom + box.height * 0.6, 1.6);
      }, landed);

    // ── 3 · Implosion
    const implodeAt = landed + 0.55;
    tl.add(() => {
      const box = wordEl.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      chars.forEach((char) => {
        const r = char.getBoundingClientRect();
        char.dataset.pull = String(cx - (r.left + r.width / 2));
      });
    }, implodeAt - 0.01)
      .to(chars, {
        x: (_i: number, el: HTMLElement) => Number(el.dataset.pull) * 0.92,
        scaleX: 0.35,
        duration: 0.42,
        ease: "power4.in",
      }, implodeAt)
      .to(line, { "--fit-wdth": 25, duration: 0.42, ease: "power4.in" }, implodeAt)
      .add(() => {
        if (line) gsap.set(line, { clipPath: "none" });
      }, implodeAt)
      .to(wordEl, { scaleY: 0.04, scaleX: 0.02, duration: 0.12, ease: "power2.in" }, implodeAt + 0.36);

    // ── 4 · Blast
    tl.add(() => blast(), implodeAt + 0.5);

    let hole = 0;
    const blast = () => {
      const width = innerWidth;
      const height = innerHeight;
      const x = width / 2;
      const y = height / 2;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext("2d");
      root.dataset.blast = "true";
      window.dispatchEvent(new CustomEvent("overture-impact", { detail: { x, y } }));
      if (!ctx) return clear();
      ctx.scale(dpr, dpr);
      const page = readColor("--page", "#f2efe8");
      const ink = readColor("--ink", "#111317");
      const seed = Math.random() * 10;
      const debris: Debris[] = Array.from({ length: 46 }, () => ({
        angle: Math.random() * Math.PI * 2,
        speed: 0.75 + Math.random() * 0.5,
        size: 1.5 + Math.random() * 3.5,
        spin: Math.random() * Math.PI,
      }));
      const reach = Math.hypot(width, height) / 2;
      const begin = performance.now();
      // A torn edge: lobes and shear like a real rupture front, not a circle.
      const edge = (radius: number, theta: number) =>
        radius *
        (1 +
          Math.sin(2 * theta + seed) * 0.05 +
          Math.sin(5 * theta + seed * 1.7) * 0.025 +
          Math.sin(13 * theta + seed * 2.9) * 0.012);
      const trace = (radius: number, fresh = true) => {
        if (fresh) ctx.beginPath();
        for (let i = 0; i <= 96; i++) {
          const theta = (i / 96) * Math.PI * 2;
          const r = edge(radius, theta);
          const px = x + Math.cos(theta) * r * 1.08;
          const py = y + Math.sin(theta) * r * 0.94;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      };
      const frame = () => {
        const t = (performance.now() - begin) / 1000;
        ctx.clearRect(0, 0, width, height);
        // One inverted frame: the flash of the impact.
        if (t < 0.05) {
          ctx.fillStyle = ink;
          ctx.fillRect(0, 0, width, height);
          hole = requestAnimationFrame(frame);
          return;
        }
        // Past the reach of the sand the hole keeps opening so it always clears.
        const radius =
          frontRadius(t, BLAST) + Math.max(0, t - 0.45) ** 2 * reach * 1.6;
        const fade = 1 - Math.min(1, Math.max(0, (t - 0.85) / (HOLE_S - 0.85)));
        ctx.globalAlpha = fade;
        ctx.fillStyle = page;
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        trace(radius, false);
        ctx.fill("evenodd");
        // The front itself, and a fainter echo behind it.
        ctx.strokeStyle = ink;
        ctx.lineWidth = Math.max(1, 3.2 * (1 - t));
        trace(radius);
        ctx.stroke();
        ctx.globalAlpha = fade * 0.25;
        ctx.lineWidth = 1;
        trace(radius * 0.9);
        ctx.stroke();
        // Debris thrown off the rim, slowing and falling away.
        ctx.globalAlpha = fade * Math.max(0, 1 - t * 1.1);
        ctx.fillStyle = ink;
        for (const bit of debris) {
          const r = edge(radius, bit.angle) * bit.speed + 6;
          const px = x + Math.cos(bit.angle) * r * 1.08;
          const py = y + Math.sin(bit.angle) * r * 0.94 + t * t * 40;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(bit.spin + t * 6);
          ctx.fillRect(-bit.size / 2, -bit.size / 2, bit.size, bit.size * 0.6);
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        if (t < HOLE_S) hole = requestAnimationFrame(frame);
        else clear();
      };
      hole = requestAnimationFrame(frame);
    };

    let cleared = false;
    const clear = () => {
      if (cleared) return;
      cleared = true;
      html.style.overflow = previousOverflow;
      setGone(true);
      onCleared();
    };

    // Any key or click jumps straight to the blast.
    const skip = (event: Event) => {
      if (root.dataset.blast) return;
      if (event instanceof KeyboardEvent && ["Tab", "Shift", "Alt", "Control", "Meta"].includes(event.key))
        return;
      cancelAnimationFrame(loading);
      tl.kill();
      gsap.set(wordEl, { opacity: 0 });
      blast();
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);

    loading = requestAnimationFrame(loadStep);
    return () => {
      cancelAnimationFrame(loading);
      cancelAnimationFrame(hole);
      tl.kill();
      window.removeEventListener("load", onLoad);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      html.style.overflow = previousOverflow;
    };
    // The overture runs once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;
  return (
    <div ref={rootRef} className="overture" role="status" aria-label={word}>
      <div className="overture-word" aria-hidden="true">
        <ShockType
          ref={wordRef}
          lines={[word]}
          whole={WHOLE_WORD.has(lang)}
          maxSize={() => innerHeight * 0.4}
          enabled
        />
      </div>
      <div className="overture-foot" aria-hidden="true">
        <span className="overture-rule">
          <span ref={ruleRef} />
        </span>
      </div>
      <canvas ref={canvasRef} className="overture-blast" aria-hidden="true" />
    </div>
  );
}

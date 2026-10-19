"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import type { Lang } from "../../types";
import { lockBodyScroll } from "../../lib/body-scroll-lock";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

/* ── Welcome lexicon ─────────────────────────────────────────── */
const WELCOME_WORDS: Record<Lang, string> = {
  es: "Bienvenido",
  en: "Welcome",
  eu: "Ongi etorri",
  fr: "Bienvenue",
  it: "Benvenuto",
  de: "Willkommen",
  pt: "Bem-vindo",
  ca: "Benvingut",
  gl: "Benvido",
  ja: "ようこそ",
  zh: "欢迎",
  ar: "مرحباً",
  ru: "Добро пожаловать",
  ko: "환영합니다",
  hi: "स्वागत है",
  tr: "Hoş geldiniz",
  nl: "Welkom",
  sv: "Välkommen",
  pl: "Witaj",
  vi: "Chào mừng",
};

const SKIP_LABELS: Record<Lang, string> = {
  es: "Saltar",
  en: "Skip",
  eu: "Saltatu",
  fr: "Passer",
  it: "Salta",
  de: "Überspringen",
  pt: "Pular",
  ca: "Omet",
  gl: "Omitir",
  ja: "スキップ",
  zh: "跳过",
  ar: "تخطي",
  ru: "Пропустить",
  ko: "건너뛰기",
  hi: "छोड़ें",
  tr: "Geç",
  nl: "Overslaan",
  sv: "Hoppa över",
  pl: "Pomiń",
  vi: "Bỏ qua",
};

// Joined scripts lose their shaping when split into spans, so they reveal as one word.
const WHOLE_WORD_LANGS = new Set<Lang>(["ar", "hi"]);

function revealUnits(word: string, lang: Lang): string[] {
  if (WHOLE_WORD_LANGS.has(lang)) return [word];
  if (typeof Intl.Segmenter !== "function") return Array.from(word);
  return Array.from(
    new Intl.Segmenter(lang, { granularity: "grapheme" }).segment(word),
    (part) => part.segment,
  );
}

interface CinematicOvertureProps {
  lang: Lang;
  onComplete: () => void;
}

/**
 * CinematicOverture — A single continuous cinematic prologue.
 *
 * Three-act structure on one GSAP master timeline:
 *   Act 1 · The Awakening — void, horizon line, volumetric bloom
 *   Act 2 · The Author's Presence — welcome word + identity title card
 *   Act 3 · The Transfer — light flood dissolving into the Hero
 */
export function CinematicOverture({ lang, onComplete }: CinematicOvertureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const coordLeftRef = useRef<HTMLSpanElement>(null);
  const coordRightRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLSpanElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const floodRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const finishedRef = useRef(false);
  const motionEnabled = useMotionEnabled();

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const word = WELCOME_WORDS[lang] ?? "Welcome";
  const skipLabel = SKIP_LABELS[lang] ?? "Skip";

  /* ── Skip / finish handler ─────────────────────────────────── */
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    if (tlRef.current) {
      tlRef.current.kill();
    }

    if (!containerRef.current) {
      onCompleteRef.current();
      return;
    }

    // Fast graceful exit
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
      onStart: () => {
        if (containerRef.current) {
          containerRef.current.style.pointerEvents = "none";
        }
      },
      onComplete: () => {
        onCompleteRef.current();
      },
    });
  }, []);

  /* ── Master timeline ───────────────────────────────────────── */
  useEffect(() => {
    // Bail immediately for reduced motion or motion disabled
    if (!motionEnabled) {
      onCompleteRef.current();
      return;
    }

    const unlock = lockBodyScroll();

    // Keyboard skip
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", handleKey);

    const container = containerRef.current;
    const horizon = horizonRef.current;
    const bloom = bloomRef.current;
    const grain = grainRef.current;
    const coordL = coordLeftRef.current;
    const coordR = coordRightRef.current;
    const wordEl = wordRef.current;
    const author = authorRef.current;
    const lineL = lineLeftRef.current;
    const lineR = lineRightRef.current;
    const flood = floodRef.current;

    if (!container || !horizon || !bloom || !grain || !wordEl || !author || !lineL || !lineR || !flood) {
      onCompleteRef.current();
      return;
    }

    const chars = wordEl.querySelectorAll<HTMLElement>(".overture-char");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        if (!finishedRef.current) {
          finishedRef.current = true;
          onCompleteRef.current();
        }
      },
    });
    tlRef.current = tl;

    /* ════════════════════════════════════════════════════════════
       ACT 1 — THE AWAKENING
       From void: horizon, breath, bloom, coordinates
       ════════════════════════════════════════════════════════════ */

    // Grain fades in subtly
    tl.to(grain, {
      opacity: 0.035,
      duration: 1.2,
      ease: "power2.inOut",
    }, 0);

    // Horizon line appears — a thin filament of light
    tl.to(horizon, {
      opacity: 0.7,
      width: "120px",
      duration: 0.8,
      ease: "expo.out",
    }, 0.3);

    // Horizon breathes — subtle opacity pulse
    tl.to(horizon, {
      opacity: 1,
      width: "180px",
      duration: 1.0,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 1,
    }, 1.0);

    // Bloom awakens — volumetric projector light
    tl.to(bloom, {
      opacity: 1,
      scale: 1,
      duration: 2.0,
      ease: "expo.out",
    }, 0.6);

    // Coordinates emerge at the flanks
    if (coordL && coordR) {
      tl.to([coordL, coordR], {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      }, 1.4);
    }

    /* ════════════════════════════════════════════════════════════
       ACT 2 — THE AUTHOR'S PRESENCE
       Welcome word as film credits, then identity title card
       ════════════════════════════════════════════════════════════ */

    // Horizon retracts to become the underscore
    tl.to(horizon, {
      width: "60px",
      opacity: 0.5,
      duration: 0.5,
      ease: "power3.inOut",
    }, 2.0);

    // Coordinates fade
    if (coordL && coordR) {
      tl.to([coordL, coordR], {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      }, 2.0);
    }

    // Characters reveal — clip-path from bottom, staggered
    if (chars.length > 0) {
      tl.to(chars, {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.55,
        stagger: 0.04,
        ease: "power3.out",
      }, 2.2);
    }

    // Horizon fades beneath the word
    tl.to(horizon, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    }, 2.6);

    // Beat of stillness — let the word breathe
    tl.to({}, { duration: 0.45 }, 3.0);

    // Word dissolves upward with blur
    if (chars.length > 0) {
      tl.to(chars, {
        y: -30,
        opacity: 0,
        filter: "blur(4px)",
        stagger: 0.02,
        duration: 0.4,
        ease: "power3.in",
      }, 3.5);
    }

    // Author name reveals — mask wipe from center
    tl.to(author, {
      clipPath: "inset(0 0% 0 0%)",
      duration: 0.6,
      ease: "power3.out",
    }, 3.8);

    // Flanking title lines extend
    tl.to([lineL, lineR], {
      width: "48px",
      opacity: 0.6,
      duration: 0.5,
      ease: "power3.out",
    }, 3.9);

    // Brief hold on the title card
    tl.to({}, { duration: 0.5 }, 4.4);

    /* ════════════════════════════════════════════════════════════
       ACT 3 — THE TRANSFER
       Light flood, dissolution, momentum handoff to Hero
       ════════════════════════════════════════════════════════════ */

    // Light flood — page color expands from center
    // Starts dim so light mode fades up from grey instead of flashing white over black.
    tl.fromTo(flood, { scale: 0, opacity: 0.35 }, {
      scale: 1,
      opacity: 1,
      duration: 1.0,
      ease: "expo.out",
    }, 4.8);

    // Author and lines dissolve
    tl.to(author, {
      opacity: 0,
      scale: 0.97,
      duration: 0.4,
      ease: "power2.in",
    }, 4.9);

    tl.to([lineL, lineR], {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    }, 4.9);

    // Bloom dissipates
    tl.to(bloom, {
      opacity: 0,
      scale: 1.5,
      duration: 0.6,
      ease: "power2.in",
    }, 5.0);

    // Grain fades
    tl.to(grain, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    }, 5.1);

    // Container final dissolution — pointer events off first
    tl.set(container, { pointerEvents: "none" }, 5.2);
    tl.to(container, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    }, 5.2);

    return () => {
      unlock();
      window.removeEventListener("keydown", handleKey);
      tl.kill();
    };
  }, [motionEnabled, finish]);

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label={`${word} · Eneko Ruiz`}
      onClick={finish}
      className="cinematic-overture fixed inset-0 z-[9990] flex items-center justify-center overflow-hidden select-none cursor-pointer"
      style={{ background: "#000000" }}
    >
      {/* Film grain overlay */}
      <div ref={grainRef} className="overture-grain" aria-hidden="true" />

      {/* Volumetric light bloom */}
      <div
        ref={bloomRef}
        className="overture-bloom"
        aria-hidden="true"
      />

      {/* Light flood for page-color transfer */}
      <div ref={floodRef} className="overture-flood" aria-hidden="true" />

      {/* Horizon line — first sign of life */}
      <div ref={horizonRef} className="overture-horizon" aria-hidden="true" />

      {/* Coordinate text — flanking whispers */}
      <span
        ref={coordLeftRef}
        className="overture-coord overture-coord--left"
        aria-hidden="true"
      >
        LAT 43.3183° N
      </span>
      <span
        ref={coordRightRef}
        className="overture-coord overture-coord--right"
        aria-hidden="true"
      >
        LON 1.9812° W
      </span>

      {/* Center stage */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Welcome word — each character individually animated */}
        <div ref={wordRef} className="flex" aria-hidden="true" dir="auto">
          {revealUnits(word, lang).map((char, i) => (
            <span key={i} className="overture-char">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {/* Author identity — title card */}
        <div className="flex items-center gap-5 mt-6">
          <div ref={lineLeftRef} className="overture-title-line" />
          <span ref={authorRef} className="overture-author">
            Eneko Ruiz
          </span>
          <div ref={lineRightRef} className="overture-title-line" />
        </div>
      </div>

      {/* Skip hint */}
      <button
        ref={skipRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="overture-skip"
        aria-label={skipLabel}
      >
        [ ESC · {skipLabel} ]
      </button>
    </div>
  );
}

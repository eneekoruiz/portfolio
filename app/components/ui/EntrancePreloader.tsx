"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import type { Lang } from "../../types";
import { lockBodyScroll } from "../../lib/body-scroll-lock";

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

interface EntrancePreloaderProps {
  lang: Lang;
  onDone: () => void;
}

/**
 * Editorial entrance experience blending precision technical telemetry,
 * localized identity greetings, and a fast, non-blocking curtain reveal.
 */
export function EntrancePreloader({ lang, onDone }: EntrancePreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const [counterValue, setCounterValue] = useState(0);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    if (!containerRef.current) {
      doneRef.current();
      return;
    }

    gsap.killTweensOf(containerRef.current);
    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 0.45,
      ease: "power3.inOut",
      onComplete: () => {
        doneRef.current();
      },
    });
  }, []);

  useEffect(() => {
    const unlock = lockBodyScroll();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Accelerated telemetry counter
    const counterObj = { value: 0 };
    const tween = gsap.to(counterObj, {
      value: 100,
      duration: 1.05,
      ease: "power2.inOut",
      onUpdate: () => {
        const val = Math.min(100, Math.round(counterObj.value));
        if (numRef.current) {
          numRef.current.textContent = String(val).padStart(2, "0");
        }
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${val / 100})`;
        }
        if (statusRef.current && val > 80) {
          statusRef.current.textContent = "SIGNAL // SYNCHRONIZED";
        }
        setCounterValue(val);
      },
      onComplete: () => {
        window.setTimeout(() => {
          finish();
        }, 120);
      },
    });

    return () => {
      unlock();
      window.removeEventListener("keydown", handleKeyDown);
      tween.kill();
    };
  }, [finish]);

  const welcomeText = WELCOME_WORDS[lang] ?? "Welcome";

  return (
    <div
      ref={containerRef}
      data-entrance-preloader
      role="status"
      aria-live="polite"
      aria-label="Cargando experiencia"
      onClick={finish}
      className="fixed inset-0 z-[9990] flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-page text-ink select-none cursor-pointer overflow-hidden will-change-transform"
    >
      {/* ── Top Header Telemetry ── */}
      <div className="flex items-start justify-between font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-lead/60 pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
          <span>ER // 2026 ARCHIVE</span>
        </div>
        <div className="text-right hidden sm:block">
          <span>LAT 43.3183° N / LON 1.9812° W</span>
          <span className="block text-lead/40">DONOSTIA · SAN SEBASTIÁN</span>
        </div>
      </div>

      {/* ── Center Identity & Counter ── */}
      <div className="flex flex-col items-center justify-center my-auto pointer-events-none">
        {/* Monogram Badge */}
        <div className="mb-6 flex items-center justify-center h-14 w-14 rounded-2xl border border-ink/15 bg-ink/[0.02]">
          <span className="font-mono text-base font-black tracking-tight text-ink">
            ER
          </span>
        </div>

        {/* Localized Greeting */}
        <div className="mb-3 overflow-hidden text-center">
          <span className="inline-block text-xs sm:text-sm font-mono tracking-[0.28em] uppercase text-lead">
            {welcomeText}
          </span>
        </div>

        {/* Numeric Telemetry Counter */}
        <div className="relative flex items-center justify-center">
          <span
            ref={numRef}
            className="font-mono text-[clamp(4.5rem,14vw,9rem)] font-black leading-none tracking-[-0.06em] text-ink tabular-nums"
          >
            {String(counterValue).padStart(2, "0")}
          </span>
          <span className="font-mono text-sm sm:text-base font-semibold text-brand self-start mt-2 sm:mt-4 ml-1">
            %
          </span>
        </div>

        {/* Architectural Progress Track */}
        <div className="mt-6 w-48 sm:w-64 max-w-[70vw]">
          <div className="h-[1px] w-full bg-ink/10 relative overflow-hidden">
            <div
              ref={barRef}
              className="absolute inset-0 bg-brand origin-left transition-transform duration-75"
              style={{ transform: `scaleX(${counterValue / 100})` }}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom Status & Skip Hint ── */}
      <div className="flex items-end justify-between font-mono text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-lead/60 pointer-events-auto">
        <span ref={statusRef} className="text-lead/70">
          PROTOCOL // INITIALIZING
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            finish();
          }}
          className="hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
        >
          [ ESC / CLICK TO SKIP ]
        </button>
      </div>
    </div>
  );
}

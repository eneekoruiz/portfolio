"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Lang } from "../../types";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import {
  createLiquidCurtain,
  animateLiquidCurtainIn,
  animateLiquidCurtainOut,
} from "./LiquidCurtain";

const WELCOME_TEXT: Record<Lang, string> = {
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

interface IdentitySplashProps {
  onComplete: () => void;
  lang: Lang;
}

export function IdentitySplash({ onComplete, lang }: IdentitySplashProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const word = WELCOME_TEXT[lang] ?? "Welcome";

  // Ambient spotlight drift
  useEffect(() => {
    if (!spotlightRef.current || !motionEnabled) return;

    const tween = gsap.to(spotlightRef.current, {
      x: () => gsap.utils.random(-250, 250),
      y: () => gsap.utils.random(-250, 250),
      duration: () => gsap.utils.random(2.5, 4.5),
      ease: "sine.inOut",
      repeat: -1,
      repeatRefresh: true,
    });

    return () => {
      tween.kill();
    };
  }, [motionEnabled]);

  // Entrance & Exit animation timeline
  useEffect(() => {
    if (!textRef.current || !lineRef.current || !containerRef.current) return;

    if (!motionEnabled) {
      onCompleteRef.current?.();
      return;
    }

    const ctx = gsap.context(() => {
      const chars = textRef.current?.querySelectorAll<HTMLElement>(".splash-char");

      const tl = gsap.timeline();

      // Set initial states
      if (chars && chars.length > 0) {
        gsap.set(chars, { yPercent: 110, opacity: 0 });
      }
      if (lineRef.current) {
        gsap.set(lineRef.current, { scaleX: 0 });
      }

      // 1. Line expands
      if (lineRef.current) {
        tl.to(lineRef.current, {
          scaleX: 1,
          duration: 0.35,
          ease: "power3.out",
        });
      }

      // 2. Characters stagger up
      if (chars && chars.length > 0) {
        tl.to(
          chars,
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.025,
            duration: 0.45,
            ease: "power3.out",
          },
          "-=0.15",
        );
      }

      // 3. Brief plateau to appreciate
      tl.to({}, { duration: 0.4 });

      // 4. Characters rise and exit
      if (chars && chars.length > 0) {
        tl.to(chars, {
          yPercent: -110,
          opacity: 0,
          stagger: 0.02,
          duration: 0.3,
          ease: "power3.in",
        });
      }

      // 5. Liquid Curtain Drop (Morphing SVG)
      tl.add(() => {
        const svg = createLiquidCurtain({
          color: "#0066ff",
          baseColor: "#002266",
          direction: "down",
        });
        document.body.appendChild(svg);
        animateLiquidCurtainIn(svg, {
          duration: 0.45,
          onMidway: () => {
            if (containerRef.current) {
              containerRef.current.style.display = "none";
            }
          },
          onComplete: () => {
            animateLiquidCurtainOut(svg, {
              duration: 0.42,
              onComplete: () => {
                onCompleteRef.current?.();
              },
            });
          },
        });
      });
    }, containerRef.current);

    return () => ctx.revert();
  }, [motionEnabled]);

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompleteRef.current?.();
  };

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Presentación Eneko Ruiz"
      onClick={handleSkip}
      className="fixed inset-0 z-[9998] bg-page text-ink flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      {/* Background architectural grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      {/* Atmospheric ambient spotlight */}
      <div
        ref={spotlightRef}
        className="absolute pointer-events-none z-0"
        aria-hidden="true"
        style={{
          width: "520px",
          height: "520px",
          background:
            "radial-gradient(circle, rgba(0, 102, 255, 0.14) 0%, transparent 70%)",
          filter: "blur(75px)",
        }}
      />

      <div className="flex flex-col items-center relative z-10">
        {/* Kinetic word mask */}
        <div className="overflow-hidden pb-2 mb-6">
          <div ref={textRef} className="flex">
            {word.split("").map((char: string, i: number) => (
              <span
                key={i}
                className="splash-char font-black text-[clamp(3.8rem,9.5vw,8.5rem)] tracking-[-0.05em] leading-none inline-block will-change-transform"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>

        {/* Center brand line + signature */}
        <div className="flex items-center gap-5">
          <div className="h-[1px] w-12 bg-ink/10 rounded-full overflow-hidden">
            <div
              ref={lineRef}
              className="h-full w-full bg-brand origin-center scale-x-0"
            />
          </div>
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-lead font-bold">
            Eneko Ruiz
          </span>
          <div className="h-[1px] w-12 bg-ink/10 rounded-full overflow-hidden">
            <div className="h-full w-full bg-brand origin-center" />
          </div>
        </div>
      </div>

      {/* Skip indicator at bottom */}
      <div className="absolute bottom-8 font-mono text-[9px] uppercase tracking-[0.2em] text-lead/50">
        [ CLICK / ESC TO SKIP ]
      </div>
    </div>
  );
}

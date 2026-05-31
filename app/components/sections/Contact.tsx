"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  GithubIcon,
  LinkedinIcon,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useMagnetic } from "../../hooks/useMagnetic";
import { BinaryStreamBtn } from "../ui/Buttons";
import type { Tx } from "../../types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EMAIL = "eneekoruiz@gmail.com";

const CONTACTS = [
  {
    href: `mailto:${EMAIL}`,
    icon: Mail,
    label: "Gmail",
    val: EMAIL,
    bg: "#EA4335",
    rgb: "234, 67, 53",
    glow: "rgba(234,67,53,.4)",
    bd: "border-[rgba(234,67,53,.5)]",
    isEmail: true,
  },
  {
    href: "https://github.com/eneekoruiz",
    icon: GithubIcon,
    label: "GitHub",
    val: "github.com/eneekoruiz",
    bg: "#24292F",
    rgb: "36, 41, 47",
    glow: "rgba(120,120,120,.3)",
    bd: "border-[rgba(120,120,120,.45)]",
    isEmail: false,
  },
  {
    href: "https://linkedin.com/in/eneekoruiz",
    icon: LinkedinIcon,
    label: "LinkedIn",
    val: "linkedin.com/in/eneekoruiz",
    bg: "#0077B5",
    rgb: "0, 119, 181",
    glow: "rgba(0,119,181,.4)",
    bd: "border-[rgba(0,119,181,.5)]",
    isEmail: false,
  },
];

/* ── Email copy card with clipboard UX ── */
function EmailCard({ c }: { c: (typeof CONTACTS)[0] }) {
  const [copied, setCopied] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  const cardRef = useMagnetic<HTMLDivElement>({
    strength: 0.015,
    innerStrength: 0.04,
  });
  const iconRef = useRef<HTMLDivElement>(null);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (copied) return;
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      // Ripple burst on the card
      const el = cardRef.current;
      if (el) {
        gsap.fromTo(
          el,
          { scale: 1 },
          {
            scale: 1.03,
            duration: 0.15,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(el, {
                scale: 1,
                duration: 0.4,
                ease: "elastic.out(1, 0.4)",
              });
            },
          },
        );
      }
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = c.href;
    }
  };

  return (
    <div ref={cardRef} className="flip-wrap contact-card">
      <button
        onClick={handleClick}
        aria-label={copied ? "Copiado!" : `Copiar email: ${EMAIL}`}
        data-h
        className="block h-full w-full text-left no-underline"
        style={{
          all: "unset",
          display: "block",
          width: "100%",
          cursor: "default",
        }}
      >
        <div className="flip-inner min-h-[180px]">
          <div
            className={`flip-front bento-glow border-beam h-full flex flex-col gap-3 p-[1.85rem] shadow-rest border transition-all duration-300 backdrop-blur-xl rounded-[32px] overflow-hidden`}
            style={
              {
                background: isDark
                  ? `linear-gradient(145deg, rgba(${c.rgb}, 0.06) 0%, rgba(${c.rgb}, 0.02) 100%)`
                  : `linear-gradient(145deg, rgba(${c.rgb}, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)`,
                borderColor: isDark
                  ? `rgba(${c.rgb}, 0.35)`
                  : `rgba(${c.rgb}, 0.4)`,
                boxShadow: `0 20px 50px rgba(${c.rgb}, ${isDark ? "0.12" : "0.15"})`,
              } as React.CSSProperties
            }
          >
            <div ref={iconRef} className="transition-all duration-200">
              {copied ? (
                <Check
                  size={28}
                  className="text-[#34c759]"
                  aria-hidden="true"
                />
              ) : (
                <c.icon
                  size={28}
                  style={{
                    color: isDark && c.label === "GitHub" ? "#fff" : c.bg,
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
            <div>
              <p className="font-black text-[1.1rem] tracking-[-0.4px] text-ink mb-1">
                {c.label}
              </p>
              <p
                className={`font-mono text-[12px] transition-colors duration-300 ${copied ? "text-[#34c759]" : "text-lead"}`}
              >
                {copied ? "¡Copiado al portapapeles!" : c.val}
              </p>
            </div>
            <div
              className="mt-auto flex items-center gap-1.5 text-[12px] font-bold"
              style={{
                color: copied
                  ? "#34c759"
                  : isDark && c.label === "GitHub"
                    ? "#fff"
                    : c.bg,
              }}
            >
              {copied ? "Pegalo donde quieras" : "Copiar email"}{" "}
              <ArrowUpRight size={13} />
            </div>
          </div>
          <div
            className="flip-back flex flex-col items-center justify-center gap-3 border backdrop-blur-xl transition-all duration-300 rounded-[32px] overflow-hidden"
            style={
              {
                background: isDark
                  ? `linear-gradient(145deg, rgba(${c.rgb}, 0.1) 0%, rgba(${c.rgb}, 0.03) 100%)`
                  : `linear-gradient(145deg, rgba(${c.rgb}, 0.35) 0%, rgba(${c.rgb}, 0.05) 100%)`,
                borderColor: isDark
                  ? `rgba(${c.rgb}, 0.45)`
                  : `rgba(${c.rgb}, 0.5)`,
                boxShadow: `0 20px 50px rgba(${c.rgb}, ${isDark ? "0.15" : "0.2"})`,
              } as React.CSSProperties
            }
          >
            <c.icon
              size={42}
              style={{ color: isDark && c.label === "GitHub" ? "#fff" : c.bg }}
              aria-hidden="true"
            />
            <span className="text-ink font-bold text-[14px]">Copiar email</span>
          </div>
        </div>
      </button>
    </div>
  );
}

/* ── Standard social card with magnetic icon ── */
function SocialCard({ c }: { c: (typeof CONTACTS)[0] }) {
  const cardRef = useMagnetic<HTMLDivElement>({
    strength: 0.015,
    innerStrength: 0.04,
  });
  const iconRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  return (
    <div ref={cardRef} className="flip-wrap contact-card">
      <a
        href={c.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={c.label}
        data-h
        className="block h-full no-underline"
      >
        <div className="flip-inner min-h-[180px]">
          <div
            className={`flip-front bento-glow border-beam h-full flex flex-col gap-3 p-[1.85rem] shadow-rest border backdrop-blur-xl transition-all duration-300 rounded-[32px] overflow-hidden`}
            style={
              {
                background: isDark
                  ? `linear-gradient(145deg, rgba(${c.rgb}, 0.06) 0%, rgba(${c.rgb}, 0.02) 100%)`
                  : `linear-gradient(145deg, rgba(${c.rgb}, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)`,
                borderColor: isDark
                  ? `rgba(${c.rgb}, 0.35)`
                  : `rgba(${c.rgb}, 0.4)`,
                boxShadow: `0 20px 50px rgba(${c.rgb}, ${isDark ? "0.12" : "0.15"})`,
              } as React.CSSProperties
            }
          >
            <div ref={iconRef}>
              <c.icon
                size={28}
                style={{
                  color: isDark && c.label === "GitHub" ? "#fff" : c.bg,
                }}
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="font-black text-[1.1rem] tracking-[-0.4px] text-ink mb-1">
                {c.label}
              </p>
              <p className="font-mono text-[12px] text-lead">{c.val}</p>
            </div>
            <div
              className="mt-auto flex items-center gap-1.5 text-[12px] font-bold"
              style={{ color: isDark && c.label === "GitHub" ? "#fff" : c.bg }}
            >
              Contactar <ArrowUpRight size={13} />
            </div>
          </div>
          <div
            className="flip-back flex flex-col items-center justify-center gap-3 border backdrop-blur-xl transition-all duration-300 rounded-[32px] overflow-hidden"
            style={
              {
                background: isDark
                  ? `linear-gradient(145deg, rgba(${c.rgb}, 0.1) 0%, rgba(${c.rgb}, 0.03) 100%)`
                  : `linear-gradient(145deg, rgba(${c.rgb}, 0.35) 0%, rgba(${c.rgb}, 0.05) 100%)`,
                borderColor: isDark
                  ? `rgba(${c.rgb}, 0.45)`
                  : `rgba(${c.rgb}, 0.5)`,
                boxShadow: `0 20px 50px rgba(${c.rgb}, ${isDark ? "0.15" : "0.2"})`,
              } as React.CSSProperties
            }
          >
            <c.icon
              size={42}
              style={{ color: isDark && c.label === "GitHub" ? "#fff" : c.bg }}
              aria-hidden="true"
            />
            <span className="text-ink font-bold text-[14px]">Escribir</span>
          </div>
        </div>
      </a>
    </div>
  );
}

export function Contact({ t }: { t: Tx }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleChars = containerRef.current?.querySelectorAll(".title-char");
      if (titleChars && titleChars.length > 0) {
        gsap.fromTo(
          titleChars,
          { y: "100%", rotateX: -90, opacity: 0 },
          {
            y: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.02,
            ease: "expo.out",
            scrollTrigger: { trigger: containerRef.current, start: "top 85%" },
          },
        );
      }

      const cards =
        containerRef.current?.querySelectorAll<HTMLElement>(".contact-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="contact"
      data-section="contact"
      aria-label="Contacto"
      className="border-t border-black/7 dark:border-white/10 py-24 relative bg-transparent z-[20]"
    >
      <div className="px-8 max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12">
        <div className="max-w-[700px]">
          <p className="sec-h text-[10px] font-bold tracking-[.22em] uppercase text-lead/60 mb-5">
            {t.coLb}
          </p>
          <h2 className="sec-h font-black text-[clamp(2.4rem,5vw,4.8rem)] tracking-[-2.5px] leading-[.91] text-ink mb-3 perspective-1000">
            {t.coH.split(" ").map((word, wIdx, wordsArray) => (
              <span key={wIdx} className="inline-block whitespace-nowrap">
                {word.split("").map((c, cIdx) => (
                  <span key={cIdx} className="title-char inline-block">
                    {c}
                  </span>
                ))}
                {wIdx < wordsArray.length - 1 && (
                  <span className="title-char inline-block">&nbsp;</span>
                )}
              </span>
            ))}
          </h2>
          <p className="sec-h text-[15px] md:text-[18px] text-lead max-w-[500px] leading-relaxed">
            {t.coP}
          </p>
        </div>

        <div className="sec-h flex flex-col items-start md:items-end gap-5">
          <BinaryStreamBtn label={t.ctaCv} />
          <div className="flex items-center gap-6 px-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse shadow-[0_0_10px_#34c759]" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-lead/50">
              {t.status}
            </span>
          </div>
        </div>
      </div>

      <div className="px-8 max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
        <EmailCard c={CONTACTS[0]} />
        <SocialCard c={CONTACTS[1]} />
        <SocialCard c={CONTACTS[2]} />
      </div>
    </section>
  );
}

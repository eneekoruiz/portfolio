"use client";

import type { Tx } from "../../types";

export function Expertise({ t, lang = "es" }: { t: Tx; lang?: string }) {
  const capabilities =
    lang !== "es" && lang !== "en"
      ? t.vals.slice(0, 3).map((value, index) => ({
          id: String(index + 1).padStart(2, "0"),
          title: value.t,
          desc: value.d,
        }))
      : [
          {
            id: "01",
            title: lang === "es" ? "Brand Identity" : "Brand Identity",
            desc:
              lang === "es"
                ? "Conceptos visuales, sistemas de diseño y dirección de arte que comunican la esencia de tu proyecto."
                : "Visual concepts, design systems, and art direction that communicate the core of your project.",
          },
          {
            id: "02",
            title: lang === "es" ? "Creative Direction" : "Creative Direction",
            desc:
              lang === "es"
                ? "Experiencias interactivas, animaciones con propósito y narrativa visual inmersiva."
                : "Interactive experiences, purposeful animations, and immersive visual storytelling.",
          },
          {
            id: "03",
            title:
              lang === "es" ? "Digital Engineering" : "Digital Engineering",
            desc:
              lang === "es"
                ? "Arquitecturas robustas, rendimiento extremo y código limpio que escala sin fricción."
                : "Robust architectures, extreme performance, and clean code that scales seamlessly.",
          },
        ];

  return (
    <section
      id="expertise"
      data-section="expertise"
      className="py-16 md:py-24 px-5 md:px-10 max-w-[1440px] mx-auto relative z-20 border-t border-ink/15"
    >
      <div className="flex flex-col md:flex-row gap-10 md:gap-20">
        <div className="md:w-1/3 shrink-0" data-section-reveal>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-8 md:w-10 bg-ink opacity-[0.12]" />
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-lead">
              {lang === "es"
                ? "CAPACIDADES"
                : lang === "en"
                  ? "CAPABILITIES"
                  : t.skLb}
            </p>
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-ink">
            {lang === "es"
              ? "Estudio Creativo & Ingeniería"
              : lang === "en"
                ? "Creative Studio & Engineering"
                : t.skH}
          </h2>
          <p className="mt-6 text-sm md:text-base leading-relaxed text-lead max-w-sm">
            {lang === "es"
              ? "Elevamos el estándar de lo digital combinando estética premium con arquitectura de software robusta."
              : lang === "en"
                ? "Elevating the digital standard by combining premium aesthetics with robust software architecture."
                : t.tagline}
          </p>
        </div>

        <div
          className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-section-reveal
        >
          {capabilities.map((cap) => (
            <div key={cap.id} className="relative group">
              <div className="mb-4 text-[10px] font-mono tracking-widest text-lead">
                {cap.id}
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-3">
                {cap.title}
              </h3>
              <p className="text-sm leading-relaxed text-lead">{cap.desc}</p>
              <div className="absolute top-0 right-0 w-8 h-8 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <div className="w-full h-full border-t border-r border-ink/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

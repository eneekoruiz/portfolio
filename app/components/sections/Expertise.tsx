"use client";

import type { Tx } from "../../types";
import "../../styles/expertise.css";

function IdentityStudy() {
  return (
    <svg
      viewBox="0 0 360 220"
      className="expertise-diagram"
      aria-hidden="true"
      focusable="false"
    >
      <g className="expertise-grid" fill="none" strokeWidth="0.6">
        {[40, 80, 120, 160, 200].map((y) => (
          <path key={y} d={`M20 ${y}H340`} />
        ))}
        {[60, 100, 140, 180, 220, 260, 300].map((x) => (
          <path key={x} d={`M${x} 20V200`} />
        ))}
      </g>
      <g fill="currentColor">
        <path d="M66 56H137V76H89V98H132V118H89V142H139V162H66Z" />
        <path
          fillRule="evenodd"
          d="M159 56H202C232 56 248 70 248 94C248 110 240 122 226 128L252 162H225L201 131H182V162H159V56ZM182 77V111H201C217 111 225 105 225 94C225 82 217 77 201 77H182Z"
        />
      </g>
      <path
        d="M52 42H64M52 42V54M260 42H248M260 42V54M52 177H64M52 177V165M260 177H248M260 177V165"
        className="expertise-accent"
        fill="none"
        strokeWidth="1.5"
      />
      <g transform="translate(292 62)">
        <rect width="28" height="28" className="expertise-accent-fill" />
        <rect y="38" width="28" height="28" fill="currentColor" />
        <rect
          y="76"
          width="28"
          height="28"
          className="expertise-paper-fill"
          stroke="currentColor"
          strokeWidth="0.6"
        />
      </g>
      <path d="M66 193H248" className="expertise-rule" strokeWidth="0.7" />
      <path
        d="M66 190V196M112 190V196M158 190V196M204 190V196M248 190V196"
        className="expertise-rule"
        strokeWidth="0.7"
      />
    </svg>
  );
}

function DirectionStudy() {
  return (
    <svg
      viewBox="0 0 300 220"
      className="expertise-diagram"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <path
        d="M22 178H279M31 172V184M96 174V182M160 174V182M225 174V182M277 172V184"
        className="expertise-rule"
        strokeWidth="0.7"
      />
      <path
        d="M36 129C76 129 82 71 125 71S184 121 256 79"
        className="expertise-accent"
        strokeWidth="1.3"
        strokeDasharray="3 5"
      />
      <g transform="translate(24 68) rotate(-8 44 42)">
        <rect
          width="88"
          height="88"
          className="expertise-paper-fill"
          stroke="currentColor"
          strokeWidth="1"
        />
        <rect
          x="9"
          y="9"
          width="70"
          height="70"
          className="expertise-grid"
          strokeWidth="0.7"
        />
        <circle cx="44" cy="44" r="23" fill="currentColor" />
        <path
          d="M28 44H60M44 28V60"
          className="expertise-paper-stroke"
          strokeWidth="1"
        />
      </g>
      <g transform="translate(119 29) rotate(6 46 46)">
        <rect width="92" height="92" className="expertise-accent-fill" />
        <path d="M16 72L46 20L76 72Z" stroke="white" strokeWidth="1.2" />
        <circle cx="46" cy="54" r="12" stroke="white" strokeWidth="1.2" />
        <path
          d="M8 8H15M8 8V15M84 84H77M84 84V77"
          stroke="white"
          strokeWidth="0.8"
        />
      </g>
      <g transform="translate(206 94) rotate(-3 34 32)">
        <rect
          width="68"
          height="68"
          className="expertise-paper-fill"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M12 34H56M34 12V56"
          className="expertise-grid"
          strokeWidth="0.8"
        />
        <path d="M16 48L34 17L52 48Z" fill="currentColor" />
      </g>
      <g className="expertise-accent-fill">
        <circle cx="31" cy="178" r="2.5" />
        <circle cx="160" cy="178" r="2.5" />
        <circle cx="277" cy="178" r="2.5" />
      </g>
    </svg>
  );
}

function EngineeringStudy() {
  return (
    <svg
      viewBox="0 0 300 220"
      className="expertise-diagram"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <g className="expertise-grid" strokeWidth="0.6">
        <path d="M40 20V201M260 20V201M20 42H280M20 179H280" />
      </g>
      <path
        d="M84 83V106H150M216 83V106H150V135"
        className="expertise-accent"
        strokeWidth="1.3"
      />
      <g stroke="currentColor" strokeWidth="1">
        <rect
          x="46"
          y="34"
          width="76"
          height="49"
          rx="2"
          className="expertise-paper-fill"
        />
        <path d="M46 45H122M53 39H56M60 39H63M67 39H70" />
        <path d="M76 53L67 62L76 71M92 53L101 62L92 71" strokeWidth="1.5" />
        <rect
          x="178"
          y="34"
          width="76"
          height="49"
          rx="2"
          className="expertise-paper-fill"
        />
        <path d="M178 45H254M185 39H188M192 39H195M199 39H202" />
        <path
          d="M208 54C201 54 207 62 201 62C207 62 201 70 208 70M224 54C231 54 225 62 231 62C225 62 231 70 224 70"
          strokeWidth="1.5"
        />
      </g>
      <circle cx="150" cy="106" r="4" className="expertise-accent-fill" />
      <g className="expertise-accent" strokeWidth="1.3">
        <path
          className="expertise-paper-fill"
          d="M104 144V177C104 192 196 192 196 177V144"
        />
        <ellipse
          cx="150"
          cy="144"
          rx="46"
          ry="10"
          className="expertise-paper-fill"
        />
        <path d="M104 160C104 175 196 175 196 160" />
      </g>
      <g fill="currentColor">
        <circle cx="150" cy="202" r="1.2" />
        <circle cx="142" cy="202" r="1.2" />
        <circle cx="158" cy="202" r="1.2" />
      </g>
    </svg>
  );
}

const STUDIES = [IdentityStudy, DirectionStudy, EngineeringStudy];

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
      aria-labelledby="expertise-heading"
      className="expertise-section"
    >
      <header className="expertise-heading" data-section-reveal>
        <div className="expertise-kicker">
          <span className="expertise-index" aria-hidden="true">
            01
          </span>
          <span className="expertise-kicker-rule" aria-hidden="true" />
          <p>
            {lang === "es"
              ? "CAPACIDADES"
              : lang === "en"
                ? "CAPABILITIES"
                : t.skLb}
          </p>
        </div>
        <div className="expertise-introduction">
          <h2 id="expertise-heading">
            {lang === "es"
              ? "Estudio Creativo & Ingeniería"
              : lang === "en"
                ? "Creative Studio & Engineering"
                : t.skH}
          </h2>
          <p className="expertise-intro-copy">
            {lang === "es"
              ? "Elevamos el estándar de lo digital combinando estética premium con arquitectura de software robusta."
              : lang === "en"
                ? "Elevating the digital standard by combining premium aesthetics with robust software architecture."
                : t.tagline}
          </p>
        </div>
      </header>

      <div className="expertise-studies">
        {capabilities.map((cap, index) => {
          const Study = STUDIES[index];
          return (
            <article
              key={cap.id}
              className="expertise-study"
              data-section-reveal
            >
              <div className="expertise-study-top" aria-hidden="true">
                <span>{cap.id}</span>
                <span className="expertise-study-mark">↗</span>
              </div>
              <div className="expertise-study-visual">{Study && <Study />}</div>
              <div className="expertise-study-copy">
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

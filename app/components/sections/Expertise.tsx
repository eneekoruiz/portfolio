"use client";

import type { Tx } from "../../types";
import "../../styles/expertise.css";

function InterfaceStudy() {
  return (
    <svg
      viewBox="0 0 360 220"
      className="expertise-diagram"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="expertise-grid" fill="none" strokeWidth="0.7">
        <rect x="45" y="32" width="270" height="156" rx="3" />
        <path d="M45 55H315M45 74H315" />
        <circle cx="57" cy="44" r="2" />
        <circle cx="66" cy="44" r="2" />
        <circle cx="75" cy="44" r="2" />
        <path d="M63 88h90v12H63zM63 110h150v5H63zM63 122h132v5H63z" />
        <rect x="226" y="88" width="68" height="73" rx="2" />
      </g>
      <rect
        x="239"
        y="101"
        width="42"
        height="25"
        rx="1"
        className="expertise-accent-fill"
      />
      <path
        d="M239 139h40M239 146h30"
        className="expertise-rule"
        strokeWidth="1"
      />
      <path
        d="M63 143h94v22H63z"
        className="expertise-paper-fill"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <path d="M75 154h48" className="expertise-accent" strokeWidth="1.5" />
    </svg>
  );
}

function ApiStudy() {
  return (
    <svg
      viewBox="0 0 300 220"
      className="expertise-diagram"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <g className="expertise-grid" strokeWidth="0.8">
        <rect x="24" y="58" width="64" height="72" rx="3" />
        <rect x="118" y="58" width="70" height="72" rx="3" />
        <rect x="218" y="58" width="64" height="72" rx="3" />
      </g>
      <path
        d="M88 94h30m70 0h30"
        className="expertise-accent"
        strokeWidth="1.5"
      />
      <path
        d="m111 90 7 4-7 4m77-8 7 4-7 4"
        className="expertise-accent"
        strokeWidth="1.5"
      />
      <path
        d="M41 80h30M41 91h18M41 102h25"
        className="expertise-rule"
        strokeWidth="1.2"
      />
      <path
        d="M135 78h36v30h-36zM143 86h20m-20 7h14m-14 7h17"
        className="expertise-accent"
        strokeWidth="1.2"
      />
      <path
        d="M238 77c0-5 24-5 24 0v31c0 5-24 5-24 0V77Zm0 0c0 5 24 5 24 0m-24 14c0 5 24 5 24 0"
        className="expertise-accent"
        strokeWidth="1.2"
      />
      <path d="M36 150h236" className="expertise-rule" strokeWidth="0.8" />
      <circle cx="56" cy="150" r="3" className="expertise-accent-fill" />
      <circle cx="153" cy="150" r="3" className="expertise-accent-fill" />
      <circle cx="250" cy="150" r="3" className="expertise-accent-fill" />
    </svg>
  );
}

function InteractionStudy() {
  return (
    <svg
      viewBox="0 0 300 220"
      className="expertise-diagram"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <path d="M38 166h224" className="expertise-rule" strokeWidth="0.8" />
      <path
        d="M50 152V166m42-36v36m42-60v60m42-48v48m42-78v78m42-28v28"
        className="expertise-grid"
        strokeWidth="1"
      />
      <path
        d="M50 141c20 0 21-22 42-22s22 18 42 18 22-34 42-34 22 21 42 21 20-26 42-26"
        className="expertise-accent"
        strokeWidth="2"
      />
      <circle
        cx="92"
        cy="119"
        r="4"
        className="expertise-paper-fill"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle
        cx="176"
        cy="103"
        r="4"
        className="expertise-paper-fill"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="260" cy="98" r="4" className="expertise-accent-fill" />
      <g transform="translate(42 38)">
        <rect
          width="56"
          height="32"
          rx="16"
          className="expertise-paper-fill"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M18 16h20m-7-7 7 7-7 7"
          className="expertise-accent"
          strokeWidth="1.5"
        />
      </g>
      <g transform="translate(121 24)">
        <rect
          width="56"
          height="32"
          rx="16"
          className="expertise-paper-fill"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M18 16h20m-7-7 7 7-7 7"
          className="expertise-accent"
          strokeWidth="1.5"
        />
      </g>
      <g transform="translate(200 38)">
        <rect
          width="56"
          height="32"
          rx="16"
          className="expertise-accent-fill"
        />
        <path d="M18 16h20m-7-7 7 7-7 7" stroke="white" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

const STUDIES = [InterfaceStudy, ApiStudy, InteractionStudy];

export function Expertise({ t, lang = "es" }: { t: Tx; lang?: string }) {
  const capabilities = [
    {
      id: "01",
      title:
        lang === "es"
          ? "Interfaces web"
          : lang === "en"
            ? "Web interfaces"
            : t.skCats[1],
      desc:
        lang === "es"
          ? "He construido flujos de reserva y páginas web responsive, cuidando que cada paso sea fácil de entender."
          : lang === "en"
            ? "I have built booking flows and responsive web pages, with a focus on making each step clear."
            : t.projectRidesDesc,
    },
    {
      id: "02",
      title:
        lang === "es"
          ? "APIs y datos"
          : lang === "en"
            ? "APIs and data"
            : t.skCats[0],
      desc:
        lang === "es"
          ? "He creado APIs con Node.js y Java y las he conectado con bases de datos para distintos proyectos."
          : lang === "en"
            ? "I have built APIs with Node.js and Java and connected them to databases for different projects."
            : t.projectWhoDesc,
    },
    {
      id: "03",
      title:
        lang === "es"
          ? "Interacción y rendimiento"
          : lang === "en"
            ? "Interaction and performance"
            : t.skCats[2],
      desc:
        lang === "es"
          ? "Me gusta mejorar la navegación, la accesibilidad y la respuesta de una interfaz con cambios concretos."
          : lang === "en"
            ? "I enjoy improving navigation, accessibility, and interface feedback through practical changes."
            : t.projectServerDesc,
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
          <p>{lang === "es" ? "ENFOQUE" : lang === "en" ? "FOCUS" : t.skLb}</p>
        </div>
        <div className="expertise-introduction">
          <h2 id="expertise-heading">
            {lang === "es"
              ? "Lo que me gusta construir"
              : lang === "en"
                ? "What I like building"
                : t.skH}
          </h2>
          <p className="expertise-intro-copy">
            {lang === "es"
              ? "Trabajo en proyectos web de principio a fin y sigo aprendiendo con cada uno."
              : lang === "en"
                ? "I work on web projects from front to back and keep learning with each one."
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

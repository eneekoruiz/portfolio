"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { PROJ_THEMES } from "../../data/config";
import { PROJECT_MEDIA } from "../../data/project-media";
import { CODE_SNIPPETS } from "../../data/projects";
import { useTranslations } from "../../hooks/useTranslations";
import "../../styles/project-visuals.css";

const PLATES: Record<
  string,
  { number: string; title: string; mark: string; file: string }
> = {
  "ana-peluquera": {
    number: "01",
    title: "AG Beauty Salon",
    mark: "AG",
    file: "useCreateBooking.ts",
  },
  "who-are-ya-backend": {
    number: "02",
    title: "Who Are Ya?",
    mark: "API",
    file: "players.controller.js",
  },
  rides24ofiziala: {
    number: "03",
    title: "Rides24",
    mark: "24",
    file: "RideService.java",
  },
  "spotshare-parking": {
    number: "04",
    title: "Spotshare",
    mark: "P",
    file: "parking.service.ts",
  },
  "pke-web": {
    number: "05",
    title: "PKE Web",
    mark: "Aa",
    file: "useFocusTrap.ts",
  },
};

/** These are source-grounded visual studies, never screenshots of invented interfaces. */
function ProjectStudy({ id }: { id: string }) {
  return (
    <svg
      className="project-study-diagram"
      viewBox="0 0 360 200"
      fill="none"
      aria-hidden="true"
    >
      {id === "who-are-ya-backend" ? (
        <>
          <path
            className="study-rule"
            d="M72 48h58v52h54M72 152h58v-52M248 100h62"
          />
          <rect
            className="study-node"
            x="48"
            y="31"
            width="60"
            height="34"
            rx="3"
          />
          <rect
            className="study-node"
            x="48"
            y="135"
            width="60"
            height="34"
            rx="3"
          />
          <rect
            className="study-node study-node-primary"
            x="164"
            y="63"
            width="84"
            height="74"
            rx="4"
          />
          <path
            className="study-database"
            d="M298 78c0-7 42-7 42 0v43c0 7-42 7-42 0V78Zm0 0c0 7 42 7 42 0m-42 20c0 7 42 7 42 0"
          />
          <text x="78" y="52">
            query
          </text>
          <text x="78" y="156">
            filter
          </text>
          <text x="206" y="104" className="study-text-primary">
            controller
          </text>
          <text x="319" y="146">
            MongoDB
          </text>
          <circle className="study-dot" cx="130" cy="100" r="4" />
          <circle className="study-dot" cx="280" cy="100" r="4" />
        </>
      ) : id === "rides24ofiziala" ? (
        <>
          <path
            className="study-rule study-route"
            d="M46 148h50c28 0 20-91 56-91h88c26 0 13 91 45 91h34"
          />
          <path className="study-rule" d="M96 25v149M238 25v149" />
          <circle className="study-stop" cx="96" cy="147" r="11" />
          <circle className="study-stop" cx="239" cy="57" r="11" />
          <circle className="study-dot" cx="319" cy="148" r="5" />
          <rect
            className="study-node"
            x="141"
            y="93"
            width="81"
            height="47"
            rx="3"
          />
          <path
            className="study-lock"
            d="M175 112v-5a6 6 0 0 1 12 0v5m-15 0h18v13h-18z"
          />
          <text x="177" y="173">
            tx.commit()
          </text>
        </>
      ) : id === "spotshare-parking" ? (
        <>
          <path
            className="study-rule"
            d="M95 24v152M145 24v152M195 24v152M245 24v152M95 75h200M95 125h200"
          />
          <path className="study-parking" d="M95 25h200v150H95" />
          <rect
            className="study-node-primary"
            x="149"
            y="79"
            width="42"
            height="42"
            rx="2"
          />
          <text
            className="study-text-primary study-parking-mark"
            x="170"
            y="107"
          >
            P
          </text>
          <path className="study-route" d="M34 100h49M265 100h48" />
          <circle className="study-dot" cx="34" cy="100" r="4" />
          <path className="study-rule" d="m307 94 6 6-6 6" />
          <text x="195" y="194">
            reserveSpot()
          </text>
        </>
      ) : (
        <>
          <path
            className="study-rule"
            d="M65 28h250M65 171h250M97 15v170M284 15v170"
          />
          <path
            className="study-focus"
            d="M146 46h-17v17m0 73v17h17m106 0h17v-17m0-73V46h-17"
          />
          <text className="study-glyph" x="199" y="122">
            Aa
          </text>
          <path className="study-route" d="M140 184h83" />
          <text x="258" y="188">
            Tab
          </text>
        </>
      )}
    </svg>
  );
}

/** The same static project plate is used in the work list, follower and hero. */
export function ProjectVisual({
  id,
  className = "",
  priority = false,
}: {
  id: string;
  className?: string;
  priority?: boolean;
}) {
  const { ui } = useTranslations();
  const media = PROJECT_MEDIA[id];
  const code = CODE_SNIPPETS[id];
  const plate = PLATES[id];
  const unavailable = id === "pke-web" || (!media && !code);
  const title = media?.title ?? plate?.title ?? ui.preview;
  return (
    <div
      data-project-visual={id}
      data-preview-kind={
        media ? "capture" : unavailable ? "unavailable" : "code"
      }
      className={`project-visual project-plate ${className}`}
      style={
        {
          "--plate-accent": PROJ_THEMES[id]?.color ?? "var(--brand)",
        } as CSSProperties
      }
    >
      <div className="project-visual-frame project-plate-frame">
        <div
          className="project-visual-chrome project-plate-chrome"
          aria-hidden="true"
        >
          <span className="project-plate-index">{plate?.number ?? "—"}</span>
          <span className="project-plate-name">{title}</span>
          <span className="project-plate-arrow">↗</span>
        </div>
        <div className="project-visual-content project-plate-content">
          {media ? (
            <div className="project-capture project-parallax-wrapper">
              <Image
                src={media.src}
                alt={`${ui.preview}: ${media.title}`}
                fill
                sizes="(max-width: 768px) 90vw, 520px"
                preload={priority}
                className="object-cover object-top"
              />
              <span className="project-capture-label" aria-hidden="true">
                AG / BEAUTY SALON
              </span>
            </div>
          ) : code && !unavailable ? (
            <pre dir="ltr" className="preview-source" data-project-source={id}>
              <code>{code.split("\n").slice(0, 11).join("\n")}</code>
            </pre>
          ) : plate ? (
            <div
              className={`project-study project-study-${id}`}
              role="img"
              aria-label={`${ui.preview}: ${title}`}
            >
              <span className="project-study-label">{ui.preview}</span>
              <span className="project-study-mark" aria-hidden="true">
                {plate.mark}
              </span>
              <ProjectStudy id={id} />
              <span className="project-study-caption" dir="ltr">
                {plate.file}
              </span>
              {unavailable && (
                <span className="project-study-disclaimer">
                  {ui.previewUnavailable}
                </span>
              )}
            </div>
          ) : (
            <div className="project-study project-study-unknown">
              <span className="project-study-mark" aria-hidden="true">
                ↗
              </span>
              <span className="project-study-disclaimer">
                {ui.previewUnavailable}
              </span>
            </div>
          )}
        </div>
      </div>
      <span className="project-visual-glint" aria-hidden="true" />
    </div>
  );
}

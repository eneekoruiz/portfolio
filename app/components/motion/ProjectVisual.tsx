"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { PROJECT_MEDIA } from "../../data/project-media";
import { CODE_SNIPPETS } from "../../data/projects";
import { useTranslations } from "../../hooks/useTranslations";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/** Shared visual identity from the selected work into the project hero. */
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
  const motion = useMotionEnabled();
  const media = PROJECT_MEDIA[id];
  const code = CODE_SNIPPETS[id];
  const unavailable = id === "pke-web" || (!media && !code);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motion || !media || !containerRef.current) return;
    
    const wrapper = containerRef.current.querySelector(".project-parallax-wrapper");
    if (!wrapper) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapper,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [motion, media]);

  return (
    <div
      ref={containerRef}
      data-project-visual={id}
      data-preview-kind={
        media ? "capture" : unavailable ? "unavailable" : "code"
      }
      className={`project-visual ${className}`}
    >
      <div className="project-visual-frame">
        <div className="project-visual-chrome" aria-hidden="true">
          <span className="flex gap-1">
            <i />
            <i />
            <i />
          </span>
          <span className="truncate">
            {media?.title ??
              (unavailable
                ? ui.preview
                : code?.split("\n")[0].replace(/^\/\/\s*/, ""))}
          </span>
          <span>↗</span>
        </div>
        <div className="project-visual-content">
          {media ? (
            <div className="absolute -inset-y-[15%] inset-x-0 h-[130%] w-full project-parallax-wrapper">
              <Image
                src={media.src}
                alt={`${ui.preview}: ${media.title}`}
                fill
                sizes="(max-width: 768px) 90vw, 520px"
                preload={priority}
                className="object-cover object-top"
              />
            </div>
          ) : unavailable ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-5 text-center text-lead">
              <span className="preview-pending-orbit" aria-hidden="true">
                ↗
              </span>
              <span className="text-xs leading-relaxed">
                {ui.previewUnavailable}
              </span>
            </div>
          ) : (
            <pre dir="ltr" className="preview-source">
              <code>{code?.split("\n").slice(1, 10).join("\n")}</code>
            </pre>
          )}
        </div>
      </div>
      <span className="project-visual-glint" aria-hidden="true" />
    </div>
  );
}

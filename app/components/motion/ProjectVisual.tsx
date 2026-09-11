"use client";

import Image from "next/image";
import { PROJECT_MEDIA } from "../../data/project-media";
import { CODE_SNIPPETS } from "../../data/projects";
import { useTranslations } from "../../hooks/useTranslations";

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
  const media = PROJECT_MEDIA[id];
  const code = CODE_SNIPPETS[id];
  const unavailable = id === "pke-web" || (!media && !code);
  return (
    <div
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
            <Image
              src={media.src}
              alt={`${ui.preview}: ${media.title}`}
              fill
              sizes="(max-width: 768px) 90vw, 520px"
              preload={priority}
              className="object-cover object-top"
            />
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

import { forwardRef } from "react";

interface HeroTitleBlockProps {
  index: number;
  title: string;
  subtitle: string;
  accent: string;
  langs: string[];
  darkMode: boolean;
  staticMotionMode: boolean;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
}

export const HeroTitleBlock = forwardRef<HTMLDivElement, HeroTitleBlockProps>(
  (
    {
      index,
      title,
      subtitle,
      accent,
      langs,
      darkMode,
      staticMotionMode,
      titleRef,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`relative z-20 flex flex-col items-center justify-center text-center px-6 w-full ${
          staticMotionMode ? "min-h-[100dvh]" : "h-full pb-48"
        } will-change-transform`}
      >
        <div
          className="relative group mb-12"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            ref={titleRef}
            className="relative flex flex-col items-center justify-center will-change-transform pointer-events-none"
          >
            <span
              className="font-mono text-[clamp(0.9rem,1.5vw,1.2rem)] opacity-40 mb-3 tracking-[0.4em]"
              style={{ color: accent }}
            >
              PROJECT // {index.toString().padStart(2, "0")}
            </span>

            <h1
              className="font-black uppercase italic tracking-[-0.05em] leading-[0.85] text-center max-w-[1200px]"
              style={{
                fontSize: "clamp(3.5rem, 15vw, 12rem)",
                color: accent,
                textShadow: `0 30px 100px ${accent}40`,
              }}
            >
              {title}
            </h1>
          </div>
        </div>

        <p
          className="text-xl md:text-2xl font-light tracking-tight max-w-2xl mb-12 opacity-50"
          style={{ color: darkMode ? "#fff" : "#000" }}
        >
          {subtitle}
        </p>

        <div className="flex items-center gap-6 flex-wrap justify-center opacity-40">
          {langs.slice(0, 3).map((lang) => (
            <div
              key={lang}
              className="font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-full border backdrop-blur-sm"
              style={{
                borderColor: `${accent}40`,
                color: accent,
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
            >
              {lang}
            </div>
          ))}
        </div>
      </div>
    );
  },
);

HeroTitleBlock.displayName = "HeroTitleBlock";

import { forwardRef } from "react";

interface HeroScrollHUDProps {
  disableStudio: boolean;
  staticMotionMode: boolean;
  scrollHintDefaultRef: React.RefObject<HTMLDivElement | null>;
  scrollHintProgressRef: React.RefObject<HTMLDivElement | null>;
  scrollTextRef: React.RefObject<HTMLSpanElement | null>;
  scrollBarRef: React.RefObject<HTMLDivElement | null>;
  s: {
    deepScroll: string;
    initializing: string;
  };
}

export const HeroScrollHUD = forwardRef<HTMLDivElement, HeroScrollHUDProps>(
  (
    {
      disableStudio,
      staticMotionMode,
      scrollHintDefaultRef,
      scrollHintProgressRef,
      scrollTextRef,
      scrollBarRef,
      s,
    },
    ref,
  ) => {
    if (disableStudio || staticMotionMode) return null;

    return (
      <div
        ref={ref}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-0 flex flex-col items-center pointer-events-none transition-all duration-300 w-[300px] px-6 py-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
      >
        {/* Layout 1: Default hint before scroll */}
        <div
          ref={scrollHintDefaultRef}
          className="flex flex-col items-center gap-3"
        >
          <p className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/50">
            {s.deepScroll}
          </p>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>

        {/* Layout 2: Progress telemetry during scroll */}
        <div
          ref={scrollHintProgressRef}
          className="hidden flex-col items-center gap-2 w-full"
        >
          <div className="flex items-center justify-between w-full font-mono text-[9px] uppercase tracking-widest text-white/70">
            <span>{s.initializing}</span>
            <span ref={scrollTextRef}>0%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div
              ref={scrollBarRef}
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{
                width: "0%",
                boxShadow: "0 0 10px rgba(255,255,255,0.8)",
              }}
            />
          </div>
        </div>
      </div>
    );
  },
);

HeroScrollHUD.displayName = "HeroScrollHUD";

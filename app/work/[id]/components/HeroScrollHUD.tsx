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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-0 flex flex-col items-center pointer-events-none transition-all duration-500 w-[250px] px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)_inset]"
      >
        {/* Layout 1: Default hint before scroll */}
        <div
          ref={scrollHintDefaultRef}
          className="flex flex-col items-center gap-2.5"
        >
          {/* Elegant scroll wheel animation pill */}
          <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5 relative overflow-hidden bg-white/[0.02]">
            <div className="w-1 h-1.5 rounded-full bg-white/70 animate-scroll-dot" />
          </div>
          <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/50 text-center leading-relaxed">
            {s.deepScroll}
          </p>
        </div>

        {/* Layout 2: Progress telemetry during scroll */}
        <div
          ref={scrollHintProgressRef}
          className="hidden flex-col items-center gap-2.5 w-full"
        >
          <div className="flex items-center justify-between w-full font-mono text-[8px] uppercase tracking-[0.3em] text-white/60 font-black">
            <span>{s.initializing}</span>
            <span ref={scrollTextRef} className="text-white">
              0%
            </span>
          </div>
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <div
              ref={scrollBarRef}
              className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
              style={{
                width: "0%",
                boxShadow: "0 0 6px rgba(255,255,255,0.9)",
              }}
            />
          </div>
        </div>
      </div>
    );
  },
);

HeroScrollHUD.displayName = "HeroScrollHUD";

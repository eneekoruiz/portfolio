"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";

// ── Data & Types ────────────────────────────────────────────────────────────
import type { RepoFull, ProjectCard } from "./types";

// ── Hooks ──────────────────────────────────────────────────────────────────
import { usePreferredMotion } from "./hooks/usePreferredMotion";
import { useMotionEnabled } from "./hooks/useMotionEnabled";
import { useGreeting } from "./hooks/useGreeting";
import { useDeviceTilt } from "./hooks/useDeviceTilt";
import { useTheme } from "next-themes";
import { useTranslations } from "./hooks/useTranslations";
import { useScrollReveal } from "./hooks/useScrollReveal";

// ── Extracted Hooks ────────────────────────────────────────────────────────
import { useProjectNavigation } from "./hooks/useProjectNavigation";
import { useScrollRestoration } from "./hooks/useScrollRestoration";
import { useReturnTransition } from "./hooks/useReturnTransition";
import { useLenisSetup } from "./hooks/useLenisSetup";
import { useGsapOrchestration } from "./hooks/useGsapOrchestration";
import { useActiveSection } from "./hooks/useActiveSection";
import { useModalState } from "./hooks/useModalState";
import { useMobileMenu } from "./hooks/useMobileMenu";
import { useIntroPhase } from "./hooks/useIntroPhase";
import { useDnaColors } from "./hooks/useDnaColors";
import { useNavbarInteractions } from "./hooks/useNavbarInteractions";

// ── UI & Navigation ────────────────────────────────────────────────────────
import { Preloader } from "./components/ui/Preloader";
import { CmdModal } from "./components/ui/CmdModal";
import { BranchMergeBtn } from "./components/ui/Buttons";
import { Navbar } from "./components/navigation/Navbar";
import { MobileMenu } from "./components/navigation/MobileMenu";
import { ProjectPreviewFollower } from "./components/motion/ProjectPreviewFollower";
import { DebugHUD } from "./components/ui/DebugHUD";
import { PortalTransition } from "./components/ui/PortalTransition";

// ── Motion & Sections ──────────────────────────────────────────────────────
import { IdentitySplash } from "./components/motion/IdentitySplash";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { memo } from "react";

// ── Memoized Sections for performance ──
const MemoHero = memo(Hero);
const MemoAbout = memo(About);
const MemoSkills = memo(Skills);
const MemoProjects = memo(Projects);

// Dynamic below-the-fold sections
const MemoPhilosophy = dynamic(
  () => import("./components/sections/Philosophy").then((m) => m.Philosophy),
  { ssr: false },
);
const MemoContact = dynamic(
  () => import("./components/sections/Contact").then((m) => m.Contact),
  { ssr: false },
);
const MemoFooter = dynamic(
  () => import("./components/sections/SiteFooter").then((m) => m.SiteFooter),
  { ssr: false },
);

// ── Dynamic Visualizers ──
const DNAHelix = dynamic<{
  accent: string;
  secondary: string;
  darkMode: boolean;
  paused?: boolean;
}>(() => import("./work/visualizers").then((m) => m.DNAHelix), { ssr: false });

// Registrar plugins GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface HomeClientProps {
  initialGitHubData: {
    repos: RepoFull[];
    top3: ProjectCard[];
    load: boolean;
    offline: boolean;
    errorMsg: string;
  };
}

export default function HomeClient({ initialGitHubData }: HomeClientProps) {
  // ── Refs ────────────────────────────────────────────────────────────────
  const main = useRef<HTMLDivElement>(null);
  const navInner = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLDivElement>(null);
  const menuRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  // ── Estado ──────────────────────────────────────────────────────────────
  const { theme, resolvedTheme } = useTheme();
  const { lang, setLang, t } = useTranslations();
  const tilt = useDeviceTilt();
  const [hoveredProject, setHoveredProject] = useState<{
    name: string;
    color: string;
  } | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const reduced = usePreferredMotion();
  const motionEnabled = useMotionEnabled();
  const [isMobile, setIsMobile] = useState(false);

  // ── Extracted Hooks Integration ──
  const mounted = useProjectNavigation(t);

  const isDark = mounted && theme === "dark";
  const isLite =
    mounted && typeof window !== "undefined" && (window as Window).__LITE;

  useEffect(() => {
    if (!mounted) return;
    setIsMobile(window.matchMedia("(hover: none)").matches);
  }, [mounted]);

  // Intro phase state machine hook
  const { phase, ready, onPreloaderDone, onSplashComplete } =
    useIntroPhase(mounted);

  // Modal and menu state managers
  const [cmd, setCmd] = useModalState();
  const [menu, setMenu] = useMobileMenu();

  // Scroll controls & observer integration
  const activeSection = useActiveSection(
    ready,
    t,
    navInner,
    indRef,
    activeLinkRef,
  );
  useScrollRestoration(ready);
  useReturnTransition(ready);
  useLenisSetup();

  // Reveal effects
  useScrollReveal(ready);

  // GSAP visuals & entry stagger sequences
  useGsapOrchestration(main, ready, reduced);

  const greeting = useGreeting(t.times, t.greetingFn);
  const { repos, top3, load, offline, errorMsg } = initialGitHubData;

  // ── Nav Handlers ──
  const { onNavEnter, onNavContainerLeave } = useNavbarInteractions(
    navInner,
    indRef,
    activeLinkRef,
  );

  // ── DNA Colors Logic ──
  const dnaColors = useDnaColors(
    theme,
    resolvedTheme,
    activeSection,
    expandedIdx,
    top3,
  );

  return (
    <>
      {(phase === "loading" || phase === "splash") && (
        <>
          <IdentitySplash
            lang={lang}
            onComplete={onSplashComplete}
            onReveal={() => {}}
            active={phase === "splash"}
          />
          {phase === "loading" && <Preloader onDone={onPreloaderDone} />}
        </>
      )}

      {/* 🧬 DNA Background — Deepest Layer */}
      {ready && !isLite && !reduced && motionEnabled && (
        <div className="fixed inset-0 pointer-events-none z-[1]">
          <div
            className="helix-group will-change-transform"
            style={{
              width: "100vw",
              height: "240vh",
              opacity: expandedIdx !== null ? 1.0 : isDark ? 0.9 : 0.8,
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
            ref={(el) => {
              if (el) {
                if (expandedIdx !== null) {
                  el.style.transform = "rotateY(0deg) rotateX(0deg)";
                } else {
                  el.style.transform = `rotateY(${tilt.x * 12}deg) rotateX(${-tilt.y * 12}deg)`;
                }
              }
            }}
          >
            <DNAHelix
              accent={dnaColors.accent}
              secondary={dnaColors.secondary}
              darkMode={isDark}
              paused={expandedIdx !== null}
            />
          </div>
        </div>
      )}

      {/* 🚀 Main Content — Middle Layer (Occludes DNA when sections have backgrounds) */}
      <main
        ref={main}
        id="main-content"
        className="relative z-[10]"
        style={{
          visibility: ready ? "visible" : "hidden",
          opacity: ready ? 1 : 0,
        }}
      >
        <Navbar
          t={t}
          lang={lang}
          setLang={setLang}
          setCmd={setCmd}
          setMenu={setMenu}
          navInnerRef={navInner}
          indRef={indRef}
          onNavEnter={onNavEnter}
          onNavContainerLeave={onNavContainerLeave}
        />

        <MemoHero
          t={t}
          greeting={greeting}
          reduced={reduced}
          setMag={() => {}}
          phase={phase}
        />
        <MemoSkills t={t} />
        <MemoAbout t={t} />
        <MemoProjects
          t={t}
          top3={top3}
          repos={repos}
          load={load}
          offline={offline}
          errorMsg={errorMsg}
          BranchMergeBtn={BranchMergeBtn}
          onHoverProject={setHoveredProject}
          expandedIdx={expandedIdx}
          onToggleProject={setExpandedIdx}
          motionEnabled={motionEnabled}
        />
        <MemoPhilosophy t={t} />
        <MemoContact t={t} />
        <MemoFooter t={t} />
        {!isMobile && <ProjectPreviewFollower activeProject={hoveredProject} />}
      </main>

      {cmd && (
        <CmdModal
          lang={lang}
          setLang={setLang}
          onClose={() => setCmd(false)}
          t={t}
        />
      )}

      <MobileMenu
        menu={menu}
        setMenu={setMenu}
        lang={lang}
        setLang={setLang}
        t={t}
        menuRefs={menuRefs}
      />

      {/* 🛠️ Masterclass Utilities */}
      <div className="hud-scanline" aria-hidden="true" />
      <div className="hud-vignette" aria-hidden="true" />
      <DebugHUD />
      <PortalTransition />
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
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
import { materia } from "./lib/materia";
import { useSceneJourney } from "./hooks/useSceneJourney";
import { ReadingNav } from "./components/navigation/ReadingNav";

// ── UI & Navigation ────────────────────────────────────────────────────────
import { useGitHubActivity } from "./hooks/useGitHubActivity";
const CmdModal = dynamic(
  () => import("./components/ui/CmdModal").then((m) => m.CmdModal),
  { ssr: false },
);
import { BranchMergeBtn } from "./components/ui/Buttons";
import { Navbar } from "./components/navigation/Navbar";
import { MobileMenu } from "./components/navigation/MobileMenu";

const DebugHUD = dynamic(
  () => import("./components/ui/DebugHUD").then((m) => m.DebugHUD),
  { ssr: false },
);
import { PortalTransition } from "./components/ui/PortalTransition";
import { ProjectPreviewFollower } from "./components/motion/ProjectPreviewFollower";
const DevTuningPanel = dynamic(
  () => import("./components/ui/DevTuningPanel").then((m) => m.DevTuningPanel),
  { ssr: false },
);

// ── Motion & Sections ──────────────────────────────────────────────────────

import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { Expertise } from "./components/sections/Expertise";
import { InfiniteMarquee } from "./components/motion/InfiniteMarquee";
import { memo } from "react";

// ── Memoized Sections for performance ──
const MemoHero = memo(Hero);
const MemoAbout = memo(About);
const MemoSkills = memo(Skills);
const MemoProjects = memo(Projects);

// Dynamic below-the-fold sections
import { Philosophy as MemoPhilosophy } from "./components/sections/Philosophy";
import { Contact as MemoContact } from "./components/sections/Contact";
import { SiteFooter as MemoFooter } from "./components/sections/SiteFooter";

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
  const [hoveredProject, setHoveredProject] = useState<{
    name: string;
    color: string;
  } | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const reduced = usePreferredMotion();
  const motionEnabled = useMotionEnabled();

  // ── Extracted Hooks Integration ──
  const mounted = useProjectNavigation(t);

  // Intro phase state machine hook
  const { phase, ready } = useIntroPhase(mounted);

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
  useSceneJourney(main, ready && motionEnabled && !reduced);

  // Reveal effects
  useScrollReveal(ready);

  // GSAP visuals & entry stagger sequences
  useGsapOrchestration(main, ready, reduced);

  const greeting = useGreeting(t.times, t.greetingFn);
  const { top3 } = initialGitHubData;
  const { repos, load, offline, errorMsg } = useGitHubActivity();

  // Hover intent controller: debounce entry (~50ms) and allow immediate cancel
  const hoverTimer = useRef<number | null>(null);
  const pendingHover = useRef<{ name: string; color: string } | null>(null);

  const handleHoverProject = (proj: { name: string; color: string } | null) => {
    // If the mobile menu (dropdown) is open, don't show previews
    if (menu) {
      if (hoverTimer.current) {
        window.clearTimeout(hoverTimer.current);
        hoverTimer.current = null;
        pendingHover.current = null;
      }
      setHoveredProject(null);
      return;
    }

    // Entering: debounce before committing (50ms)
    if (proj) {
      pendingHover.current = proj;
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
      hoverTimer.current = window.setTimeout(() => {
        setHoveredProject(pendingHover.current);
        hoverTimer.current = null;
        pendingHover.current = null;
      }, 50);
    } else {
      // Leaving: cancel pending and hide immediately
      if (hoverTimer.current) {
        window.clearTimeout(hoverTimer.current);
        hoverTimer.current = null;
        pendingHover.current = null;
      }
      setHoveredProject(null);
    }
  };

  // When the menu opens, ensure previews are hidden and cancel pending hovers
  useEffect(() => {
    if (menu) {
      if (hoverTimer.current) {
        window.clearTimeout(hoverTimer.current);
        hoverTimer.current = null;
        pendingHover.current = null;
      }
      setHoveredProject(null);
    }
  }, [menu]);

  // Ensure the native cursor is visible when motion is disabled or user prefers reduced motion
  useEffect(() => {
    const shouldReveal = reduced || !motionEnabled;
    const el = document.documentElement;
    if (shouldReveal) {
      el.classList.add("reveal-cursor");
    } else {
      el.classList.remove("reveal-cursor");
    }
    return () => {
      el.classList.remove("reveal-cursor");
    };
  }, [reduced, motionEnabled]);

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
    hoveredProject,
  );
  useEffect(() => {
    materia.accent = dnaColors.accent;
    materia.secondary = dnaColors.secondary;
    materia.paused = menu;
    if (hoveredProject) {
      materia.warp.target = 0.85;
    } else {
      materia.warp.target = 0;
    }
    return () => {
      materia.paused = false;
    };
  }, [dnaColors, menu, activeSection, hoveredProject]);

  return (
    <>
      {/* 🚀 Main Content — Middle Layer (Occludes DNA when sections have backgrounds) */}
      <main
        ref={main}
        id="main-content"
        className="relative z-[10] pb-24 md:pb-0"
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
          phase={phase}
          lang={lang}
        />
        <Expertise t={t} lang={lang} />
        <InfiniteMarquee
          text={
            lang === "es"
              ? "Diseño Premium • Código Limpio • Animación Fluida"
              : lang === "en"
                ? "Premium Design • Clean Code • Fluid Animation"
                : t.vals
                    .slice(0, 3)
                    .map((value) => value.t)
                    .join(" • ")
          }
        />
        <MemoProjects
          t={t}
          lang={lang}
          top3={top3}
          repos={repos}
          load={load}
          offline={offline}
          errorMsg={errorMsg}
          BranchMergeBtn={BranchMergeBtn}
          onHoverProject={handleHoverProject}
          menu={menu}
          expandedIdx={expandedIdx}
          onToggleProject={setExpandedIdx}
          motionEnabled={motionEnabled}
        />
        <MemoAbout t={t} />
        <MemoSkills t={t} lang={lang} />
        <MemoPhilosophy t={t} />
        <MemoContact t={t} lang={lang} />
        <MemoFooter t={t} />
      </main>
      {ready && !menu && !cmd && (
        <ReadingNav active={activeSection} t={t} lang={lang} />
      )}

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
      <div className="hud-vignette" aria-hidden="true" />
      {process.env.NODE_ENV === "development" && <DebugHUD />}
      <PortalTransition />
      <ProjectPreviewFollower activeProject={hoveredProject} />
      {process.env.NODE_ENV === "development" && <DevTuningPanel />}
    </>
  );
}

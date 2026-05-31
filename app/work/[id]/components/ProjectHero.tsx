"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PROJECT HERO — Fake 3D / Cinematic Parallax Effect
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ESTRUCTURA:
 *   - Hero ocupa 100vh con imagen de fondo (cover del proyecto)
 *   - Título + stack en primer plano
 *   - ScrollTrigger pinea el hero brevemente
 *
 * ANIMACIÓN:
 *   - Al scroll: imagen hace zoom lento (1.0 → 1.2)
 *   - Título hace parallax (sube más rápido que la imagen)
 *   - Efecto cinematic con scrub: 1.5
 *
 * TRANSICIÓN:
 *   - Contenido por debajo (z-10) desliza por encima del hero (z-0)
 *   - Ocultamiento suave del hero
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Activity,
  MousePointer2,
  X,
  ExternalLink,
  MoveUp,
  GithubIcon,
} from "lucide-react";
import { useMotionEnabled } from "../../../hooks/useMotionEnabled";
import type { Lang, StudioTx } from "../../../types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const STUDIO_TX: Record<Lang, StudioTx> = {
  es: {
    sourceCode: "Código Fuente",
    closeSession: "Cerrar Sesión",
    enterStudio: "Entrar al Estudio",
    clickToInteract: "Haz clic para interactuar",
    initializing: "Inicializando Estudio",
    mounting: "Montando entorno remoto...",
    preparing: "Preparando Entorno",
    demoWorking: "Estamos trabajando en la demo todavía",
    comingSoon: "Próximamente",
    scrollDownInit:
      "Desplaza hacia abajo para inicializar la vista previa del sistema.",
    auditDesc:
      "Este proyecto está siendo auditado para su despliegue final en el entorno de pruebas.",
    deepScroll: "Desplaza para Entrar",
    keepScrolling: "Sigue desplazándote",
  },
  en: {
    sourceCode: "Source Code",
    closeSession: "Close Session",
    enterStudio: "Enter Studio",
    clickToInteract: "Click to Interact",
    initializing: "Initializing Studio",
    mounting: "Mounting remote environment...",
    preparing: "Preparing Environment",
    demoWorking: "We are still working on the demo",
    comingSoon: "Coming Soon",
    scrollDownInit: "Scroll down to initialize the system preview.",
    auditDesc:
      "This project is being audited for final deployment in the test environment.",
    deepScroll: "Deep Scroll to Enter",
    keepScrolling: "Keep scrolling",
  },
  eu: {
    sourceCode: "Iturburu Kodea",
    closeSession: "Saioa Itxi",
    enterStudio: "Estudioan Sartu",
    clickToInteract: "Klikatu elkarreragiteko",
    initializing: "Estudioa Hasieratzen",
    mounting: "Urruneko ingurunea muntatzen...",
    preparing: "Ingurunea Prestatzen",
    demoWorking: "Demolanean ari gara oraindik",
    comingSoon: "Laster",
    scrollDownInit: "Mugitu behera sistemaren aurrebista kargatzeko.",
    auditDesc:
      "Proiektu hau proba-ingurunean azken hedapenerako ikuskatzen ari da.",
    deepScroll: "Mugitu Gehiago Sartzeko",
    keepScrolling: "Jarraitu mugitzen",
  },
  fr: {
    sourceCode: "Code Source",
    closeSession: "Quitter l'Atelier",
    enterStudio: "Entrer dans l'Atelier",
    clickToInteract: "Cliquer pour interagir",
    initializing: "Initialisation de l'Atelier",
    mounting: "Montage de l'environnement distant...",
    preparing: "Préparation de l'Environnement",
    demoWorking: "Nous travaillons encore sur la démo",
    comingSoon: "Prochainement",
    scrollDownInit: "Faites défiler vers le bas pour initialiser l'aperçu.",
    auditDesc:
      "Ce projet est en cours d'audit pour déploiement final dans l'environnement de test.",
    deepScroll: "Défiler pour Entrer",
    keepScrolling: "Continuez à défiler",
  },
  it: {
    sourceCode: "Codice Sorgente",
    closeSession: "Chiudi Sessione",
    enterStudio: "Entra nello Studio",
    clickToInteract: "Clicca per interagire",
    initializing: "Inizializzazione Studio",
    mounting: "Montaggio dell'ambiente remoto...",
    preparing: "Preparazione Ambiente",
    demoWorking: "Stiamo ancora lavorando alla demo",
    comingSoon: "Prossimamente",
    scrollDownInit: "Scorri verso il basso per inizializzare l'anteprima.",
    auditDesc:
      "Questo progetto è in fase di verifica per il rilascio finale nell'ambiente di test.",
    deepScroll: "Scorri per Entrare",
    keepScrolling: "Continua a scorrere",
  },
  de: {
    sourceCode: "Quellcode",
    closeSession: "Sitzung beenden",
    enterStudio: "Studio betreten",
    clickToInteract: "Klicken zum Interagieren",
    initializing: "Studio wird initialisiert",
    mounting: "Remote-Umgebung wird geladen...",
    preparing: "Umgebung wird vorbereitet",
    demoWorking: "Wir arbeiten noch an der Demo",
    comingSoon: "Demnächst",
    scrollDownInit: "Nach unten scrollen, um die Systemvorschau zu laden.",
    auditDesc:
      "Dieses Projekt wird für die endgültige Bereitstellung in der Testumgebung geprüft.",
    deepScroll: "Scrollen zum Betreten",
    keepScrolling: "Weiter scrollen",
  },
  pt: {
    sourceCode: "Código Fonte",
    closeSession: "Fechar Sessão",
    enterStudio: "Entrar no Estúdio",
    clickToInteract: "Clique para interagir",
    initializing: "Inicializando Estúdio",
    mounting: "Montando ambiente remoto...",
    preparing: "Preparando Ambiente",
    demoWorking: "Ainda estamos trabalhando na demo",
    comingSoon: "Em breve",
    scrollDownInit: "Role para baixo para inicializar a pré-visualização.",
    auditDesc:
      "Este projeto está sendo auditado para implantação final no ambiente de testes.",
    deepScroll: "Rolar para Entrar",
    keepScrolling: "Continue a rolar",
  },
  ca: {
    sourceCode: "Codi Font",
    closeSession: "Tancar Sessió",
    enterStudio: "Entrar a l'Estudi",
    clickToInteract: "Fes clic per interactuar",
    initializing: "Inicialitzant Estudi",
    mounting: "Muntant entorn remot...",
    preparing: "Preparant Entorn",
    demoWorking: "Encara estem treballant en la demo",
    comingSoon: "Properament",
    scrollDownInit: "Desplaça cap avall per inicialitzar la vista prèvia.",
    auditDesc:
      "Aquest projecte està sent auditat per al seu desplegament final a l'entorn de proves.",
    deepScroll: "Desplaça per Entrar",
    keepScrolling: "Continua desplaçant-te",
  },
  gl: {
    sourceCode: "Código Fonte",
    closeSession: "Pechar Sesión",
    enterStudio: "Entrar no Estudio",
    clickToInteract: "Fai clic para interactuar",
    initializing: "Inicializando Estudio",
    mounting: "Montando contorno remoto...",
    preparing: "Preparando Contorno",
    demoWorking: "Aínda estamos traballando na demo",
    comingSoon: "Proximamente",
    scrollDownInit: "Despraza cara a baixo para inicializar a vista previa.",
    auditDesc:
      "Este proxecto está sendo auditado para o seu despregue final no contorno de probas.",
    deepScroll: "Desprazar para Entrar",
    keepScrolling: "Continúa desprazándote",
  },
  ja: {
    sourceCode: "ソースコード",
    closeSession: "セッションを終了",
    enterStudio: "スタジオに入る",
    clickToInteract: "クリックして操作",
    initializing: "スタジオを初期化中",
    mounting: "リモート環境をマウント中...",
    preparing: "環境を準備中",
    demoWorking: "デモ版は現在開発中です",
    comingSoon: "近日公開",
    scrollDownInit: "下へスクロールしてシステムプレビューを起動してください。",
    auditDesc:
      "このプロジェクトは、テスト環境への最終デプロイに向けて監査中です。",
    deepScroll: "スクロールして入場",
    keepScrolling: "スクロールを続けてください",
  },
  zh: {
    sourceCode: "源代码",
    closeSession: "关闭会话",
    enterStudio: "进入工作台",
    clickToInteract: "点击以进行交互",
    initializing: "正在初始化工作台",
    mounting: "正在挂载远程环境...",
    preparing: "正在准备环境",
    demoWorking: "我们仍在开发演示版",
    comingSoon: "即将推出",
    scrollDownInit: "向下滚动以启动系统预览。",
    auditDesc: "该项目正在进行审计，以进行测试环境의 最终部署。",
    deepScroll: "向下滚动以进入",
    keepScrolling: "请继续滚动",
  },
  ar: {
    sourceCode: "كود المصدر",
    closeSession: "إغلاق الجلسة",
    enterStudio: "دخول الاستوديو",
    clickToInteract: "انقر للتفاعل",
    initializing: "جاري تهيئة الاستوديو",
    mounting: "جاري تحميل البيئة عن بعد...",
    preparing: "جاري تحضير البيئة",
    demoWorking: "ما زلنا نعمل على العرض التجريبي",
    comingSoon: "قريباً",
    scrollDownInit: "مرر لأسفل لتهيئة معاينة النظام.",
    auditDesc: "يتم تدقيق هذا المشروع من أجل النشر النهائي في بيئة الاختبار.",
    deepScroll: "مرر للدخول",
    keepScrolling: "استمر في التمرير",
  },
  ru: {
    sourceCode: "Исходный код",
    closeSession: "Закрыть сессию",
    enterStudio: "Войти в студию",
    clickToInteract: "Нажмите для взаимодействия",
    initializing: "Инициализация студии",
    mounting: "Монтирование удаленной среды...",
    preparing: "Подготовка среды",
    demoWorking: "Мы все еще работаем над демо-версией",
    comingSoon: "Скоро",
    scrollDownInit:
      "Прокрутите вниз для инициализации предварительного просмотра системы.",
    auditDesc:
      "Этот проект проходит аудит для окончательного развертывания в тестовой среде.",
    deepScroll: "Прокрутите для входа",
    keepScrolling: "Продолжайте прокручивать",
  },
  ko: {
    sourceCode: "소스 코드",
    closeSession: "세션 종료",
    enterStudio: "스튜디오 입장",
    clickToInteract: "상호작용하려면 클릭하세요",
    initializing: "스튜디오 초기화 중",
    mounting: "원격 환경 탑재 중...",
    preparing: "환경 준비 중",
    demoWorking: "데모 버전 준비 중입니다",
    comingSoon: "준비 중",
    scrollDownInit: "시스템 미리보기를 초기화하려면 아래로 스크롤하세요.",
    auditDesc:
      "이 프로젝트는 테스트 환경에서의 최종 배포를 위해 감사(audit) 중입니다.",
    deepScroll: "들어가려면 스크롤하세요",
    keepScrolling: "계속 스크롤하세요",
  },
  hi: {
    sourceCode: "सोर्स कोड",
    closeSession: "सत्र समाप्त करें",
    enterStudio: "स्टूडियो में प्रवेश करें",
    clickToInteract: "इंटरैक्ट करने के लिए क्लिक करें",
    initializing: "स्टूडियो प्रारंभ किया जा रहा है",
    mounting: "रिमोट वातावरण माउंट किया जा रहा है...",
    preparing: "वातावरण तैयार किया जा रहा है",
    demoWorking: "हम अभी भी डेमो पर काम कर रहे हैं",
    comingSoon: "जल्द ही आ रहा है",
    scrollDownInit: "सिस्टम पूर्वावलोकन शुरू करने के लिए नीचे स्क्रॉल करें।",
    auditDesc:
      "परीक्षण वातावरण में अंतिम परिनियोजन के लिए इस परियोजना का ऑडिट किया जा रहा है।",
    deepScroll: "प्रवेश करने के लिए स्क्रॉल करें",
    keepScrolling: "स्क्रॉल करते रहें",
  },
  tr: {
    sourceCode: "Kaynak Kodu",
    closeSession: "Oturumu Kapat",
    enterStudio: "Stüdyoya Gir",
    clickToInteract: "Etkileşim için Tıkla",
    initializing: "Stüdyo Hazırlanıyor",
    mounting: "Uzak ortam kuruluyor...",
    preparing: "Ortam Hazırlanıyor",
    demoWorking: "Hala demo üzerinde çalışıyoruz",
    comingSoon: "Çok Yakında",
    scrollDownInit: "Sistem önizlemesini başlatmak için aşağı kaydırın.",
    auditDesc: "Bu proje, test ortamında nihai dağıtım için denetlenmektedir.",
    deepScroll: "Girmek için Aşağı Kaydır",
    keepScrolling: "Kaydırmaya devam et",
  },
  nl: {
    sourceCode: "Broncode",
    closeSession: "Sessie Sluiten",
    enterStudio: "Studio Binnengaan",
    clickToInteract: "Klik om te communiceren",
    initializing: "Studio Initialiseren",
    mounting: "Externe omgeving laden...",
    preparing: "Omgeving Voorbereiden",
    demoWorking: "We werken nog aan de demo",
    comingSoon: "Binnenkort Beschikbaar",
    scrollDownInit:
      "Scroll naar beneden om de systeemvoorbeeldweergave te initialiseren.",
    auditDesc:
      "Dit project wordt geaudit voor uiteindelijke implementatie in de testomgeving.",
    deepScroll: "Scroll om Binnen te Gaan",
    keepScrolling: "Blijf scrollen",
  },
  sv: {
    sourceCode: "Källkod",
    closeSession: "Stäng sessionen",
    enterStudio: "Gå in i studion",
    clickToInteract: "Klicka för att interagera",
    initializing: "Initierar studion",
    mounting: "Monterar fjärrmiljö...",
    preparing: "Förbereder miljö",
    demoWorking: "Vi arbetar fortfarande med demon",
    comingSoon: "Kommer snart",
    scrollDownInit: "Scrolla ner for att initiera systemförhandsgranskningen.",
    auditDesc: "Detta projekt granskas för slutlig driftsättning i testmiljön.",
    deepScroll: "Scrolla för att gå in",
    keepScrolling: "Fortsätt scrolla",
  },
  pl: {
    sourceCode: "Kod Źródłowy",
    closeSession: "Zamknij Sesję",
    enterStudio: "Wejdź do Studia",
    clickToInteract: "Kliknij, aby wejść w interakcję",
    initializing: "Inicjowanie Studia",
    mounting: "Montowanie zdalnego środowiska...",
    preparing: "Przygotowywanie Środowiska",
    demoWorking: "Wciąż pracujemy nad wersją demonstracyjną",
    comingSoon: "Wkrótce",
    scrollDownInit: "Przewiń w dół, aby zainicjować podgląd systemu.",
    auditDesc:
      "Ten projekt jest poddawany audytowi w celu końcowego wdrożenia w środowisku testowym.",
    deepScroll: "Przewiń, aby Wejść",
    keepScrolling: "Przewijaj dalej",
  },
  vi: {
    sourceCode: "Mã nguồn",
    closeSession: "Đóng phiên",
    enterStudio: "Vào Studio",
    clickToInteract: "Nhập để tương tác",
    initializing: "Đang khởi tạo Studio",
    mounting: "Đang gắn kết môi trường từ xa...",
    preparing: "Đang chuẩn bị môi trường",
    demoWorking: "Chúng tôi vẫn đang phát triển bản demo",
    comingSoon: "Sắp ra mắt",
    scrollDownInit: "Cuộn xuống để khởi chạy xem trước hệ thống.",
    auditDesc:
      "Dự án này đang được kiểm tra (audit) để triển khai cuối cùng trên môi trường thử nghiệm.",
    deepScroll: "Cuộn để vào",
    keepScrolling: "Tiếp tục cuộn",
  },
};

interface ProjectHeroProps {
  projectId: string;
  title: string;
  subtitle: string;
  accent: string;
  accentBg: string;
  liveUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  iframeTitle?: string;
  label: string;
  langs: string[];
  darkMode: boolean;
  index?: number;
  isReady?: boolean;
  lang?: Lang;
}

export function ProjectHero({
  projectId,
  title,
  subtitle,
  accent,
  accentBg,
  liveUrl,
  githubUrl,
  videoUrl,
  iframeTitle = "Preview",
  label,
  langs,
  darkMode,
  index = 1,
  isReady = true,
  lang = "es",
}: ProjectHeroProps) {
  const s = STUDIO_TX[lang] ?? STUDIO_TX["en"];
  const motionEnabled = useMotionEnabled();
  const staticStudioLayout = !motionEnabled;
  const heroRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // HUD scroll progress refs
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLSpanElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const scrollHintDefaultRef = useRef<HTMLDivElement>(null);
  const scrollHintProgressRef = useRef<HTMLDivElement>(null);

  const [isInteracting, setIsInteracting] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [canInteract, setCanInteract] = useState(false);
  const interRef = useRef(false);
  const canRef = useRef(false);

  // ── DEFERRED LOADING STATE FOR PERFORMANCE ──
  const [shouldLoad, setShouldLoad] = useState(false);
  const shouldLoadRef = useRef(false);

  // Sync refs with state for use in event listeners
  useEffect(() => {
    interRef.current = isInteracting;
  }, [isInteracting]);
  useEffect(() => {
    canRef.current = canInteract;
  }, [canInteract]);
  useEffect(() => {
    shouldLoadRef.current = shouldLoad;
  }, [shouldLoad]);

  useEffect(() => {
    if (!motionEnabled) {
      setShouldLoad(true);
      setCanInteract(true);
    }
  }, [motionEnabled]);

  const disableStudio = projectId === "rides24ofiziala";
  const staticMotionMode = !motionEnabled;

  // Iframe loading safety fallback
  useEffect(() => {
    if (!liveUrl || iframeLoaded || !shouldLoad) return;
    const timer = setTimeout(() => {
      setIframeLoaded(true);
    }, 6000); // 6s fallback for heavy sites
    return () => clearTimeout(timer);
  }, [liveUrl, iframeLoaded, shouldLoad]);

  // ── CINEMATIC MULTI-STAGE ANIMATION ────────────────────────────────────
  useGSAP(
    () => {
      if (
        !isReady ||
        !heroRef.current ||
        !bgImageRef.current ||
        !titleRef.current ||
        !screenRef.current ||
        !motionEnabled
      )
        return;

      // 1. Cinematic Scroll Sequence — INCREASED END for better pacing
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: disableStudio ? "+=120%" : "+=250%", // More space for a grander transition
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self: ScrollTrigger) => {
            const isLocked = self.progress > 0.88; // Trigger CTA earlier
            if (!disableStudio && canRef.current !== isLocked) {
              canRef.current = isLocked;
              setCanInteract(isLocked);
            }

            // Trigger deferred loading when the user begins to scroll down
            if (self.progress > 0.05 && !shouldLoadRef.current) {
              shouldLoadRef.current = true;
              setShouldLoad(true);
            }

            if (screenRef.current && !interRef.current) {
              screenRef.current.style.setProperty(
                "--shield-opacity",
                isLocked ? "0.4" : "1",
              );
              screenRef.current.style.setProperty(
                "--shield-pointer",
                isLocked ? "all" : "none",
              );
            }

            // Update scroll telemetry HUD
            const progressPercent = Math.round(self.progress * 100);
            if (scrollTextRef.current) {
              scrollTextRef.current.textContent = `${progressPercent}%`;
            }
            if (scrollBarRef.current) {
              scrollBarRef.current.style.width = `${progressPercent}%`;
            }

            if (scrollProgressRef.current) {
              if (self.progress > 0.85) {
                scrollProgressRef.current.style.opacity = "0";
                scrollProgressRef.current.style.pointerEvents = "none";
              } else if (self.progress > 0.02) {
                scrollProgressRef.current.style.opacity = "1";
                scrollProgressRef.current.style.pointerEvents = "auto";
                if (scrollHintDefaultRef.current)
                  scrollHintDefaultRef.current.style.display = "none";
                if (scrollHintProgressRef.current)
                  scrollHintProgressRef.current.style.display = "flex";
              } else {
                scrollProgressRef.current.style.opacity = "1";
                scrollProgressRef.current.style.pointerEvents = "auto";
                if (scrollHintDefaultRef.current)
                  scrollHintDefaultRef.current.style.display = "flex";
                if (scrollHintProgressRef.current)
                  scrollHintProgressRef.current.style.display = "none";
              }

              // Ensure the screen element ends perfectly centered after the cinematic
              // (fixes cases where GSAP leaves transform state inconsistent)
              if (screenRef.current) {
                try {
                  if (self.progress > 0.96) {
                    gsap.set(screenRef.current, {
                      left: "50%",
                      top: "50%",
                      xPercent: -50,
                      yPercent: -50,
                      overwrite: true,
                    });
                    // defensive: force inline left/top in case layout shifted during pin
                    screenRef.current.style.left = "50%";
                    screenRef.current.style.top = "50%";
                  }
                } catch (e) {
                  // swallow any timing errors during SSR/hydration or quick unmounts
                }
              }
            }
          },
        },
      });

      if (contentRef.current && bgImageRef.current) {
        tl
          // Phase 1: Background & Content Fade
          .to(
            contentRef.current,
            {
              y: -120,
              opacity: 0,
              scale: 0.9,
              force3D: true,
              ease: "power2.in",
              duration: 1.2,
            },
            0,
          )
          .to(
            bgImageRef.current,
            {
              scale: disableStudio ? 1.4 : 2.2,
              opacity: disableStudio ? 0.3 : 0.1,
              force3D: true,
              ease: "power2.inOut",
              duration: 2.5,
            },
            0,
          );
      }

      if (!disableStudio && screenRef.current && overlayRef.current) {
        tl
          // Phase 2: Screen reveals with a "Window" effect
          .fromTo(
            screenRef.current,
            {
              scale: 0.05,
              opacity: 0,
              z: -1500,
              filter: "blur(30px)",
              borderRadius: "50rem",
            },
            {
              scale: 1,
              opacity: 1,
              z: 0,
              filter: "blur(0px)",
              borderRadius: "2.5rem",
              xPercent: -50,
              yPercent: -50,
              left: "50%",
              top: "50%",
              // RESPONSIVE DIMENSIONS - Use relative units for better mobile behavior
              width: "94vw",
              maxWidth: window.innerWidth < 768 ? "100%" : "1400px",
              height: window.innerWidth < 768 ? "65dvh" : "82dvh",
              force3D: true,
              ease: "expo.inOut",
              duration: 2.2,
            },
            0.5,
          )

          // Phase 3: Darkening for focus
          .to(
            overlayRef.current,
            {
              opacity: 1,
              backgroundColor: "rgba(0,0,0,0.94)",
              duration: 1.8,
            },
            0.8,
          );
      }

      // 2. Idle floating
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: "+=12",
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });
      }

      // 3. Mouse Interaction (Optimized)
      const onMove = (e: MouseEvent) => {
        if (!titleRef.current || interRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const mx = (clientX / innerWidth - 0.5) * 2;
        const my = (clientY / innerHeight - 0.5) * 2;

        if (titleRef.current) {
          gsap.to(titleRef.current, {
            rotateY: mx * 10,
            rotateX: -my * 10,
            scale: 1.01,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        if (glareRef.current) {
          gsap.to(glareRef.current, {
            x: mx * 20,
            y: my * 20,
            opacity: 0.2,
            duration: 1,
          });
        }
      };

      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    },
    { scope: heroRef, dependencies: [isReady, motionEnabled] },
  );

  // ── 🚀 STUDIO MODE TRANSITION (Fullscreen Takeover) ────────────────
  useGSAP(() => {
    if (!screenRef.current || !motionEnabled) return;

    if (isInteracting) {
      const tl = gsap.timeline();
      tl.fromTo(
        ".studio-bar",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      );
    }
  }, [isInteracting, motionEnabled]);

  // ── 🚀 STUDIO MODE SIDE EFFECTS (Scroll Lock & ESC Key) ────────────────
  useEffect(() => {
    if (isInteracting) {
      // 1. Strict Scroll Lock & UI Cleanups
      document.body.style.overflow = "hidden";
      document.body.classList.add("studio-active");
      window.__lenis?.stop();

      // 2. Prevent Zoom (pinch-to-zoom and Ctrl+wheel) and standard scroll events on parent
      const preventScrollAndZoom = (e: Event) => {
        e.preventDefault();
      };

      const preventZoomKeys = (e: KeyboardEvent) => {
        const isCtrlCmd = e.ctrlKey || e.metaKey;
        if (
          isCtrlCmd &&
          (e.key === "=" || e.key === "-" || e.key === "+" || e.key === "0")
        ) {
          e.preventDefault();
        }
      };

      const preventScrollKeys = (e: KeyboardEvent) => {
        const keys = [
          " ",
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
        ];
        if (keys.includes(e.key)) {
          const active = document.activeElement;
          if (
            active &&
            (active.tagName === "INPUT" ||
              active.tagName === "TEXTAREA" ||
              (active as HTMLElement).isContentEditable)
          ) {
            return;
          }
          e.preventDefault();
        }
      };

      window.addEventListener("wheel", preventScrollAndZoom, {
        passive: false,
      });
      window.addEventListener("touchmove", preventScrollAndZoom, {
        passive: false,
      });
      window.addEventListener("keydown", preventZoomKeys, { passive: false });
      window.addEventListener("keydown", preventScrollKeys, { passive: false });

      // 3. ESC Key Listener
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsInteracting(false);
      };
      window.addEventListener("keydown", handleEsc);

      return () => {
        document.body.style.overflow = "";
        document.body.classList.remove("studio-active");
        window.__lenis?.start();
        window.removeEventListener("wheel", preventScrollAndZoom);
        window.removeEventListener("touchmove", preventScrollAndZoom);
        window.removeEventListener("keydown", preventZoomKeys);
        window.removeEventListener("keydown", preventScrollKeys);
        window.removeEventListener("keydown", handleEsc);
      };
    } else {
      // 🚀 When exiting, force ScrollTrigger to refresh immediately and reapply its exact active styles (scale, opacity, etc.)
      ScrollTrigger.refresh();
      ScrollTrigger.getAll().forEach((t: globalThis.ScrollTrigger) =>
        t.update(),
      );
    }
  }, [isInteracting]);

  const renderScreenContents = () => {
    return (
      <>
        {/* Studio HUD - Top Control Bar */}
        {isInteracting && (
          <header className="w-full bg-[#121212] border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0 z-[2010]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse shadow-[0_0_10px_var(--brand)]" />
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-white/90 truncate max-w-[120px] md:max-w-none">
                  {title}{" "}
                  <span className="hidden xs:inline">
                    {" // SYSTEM.ACTIVE"}
                  </span>
                </span>
              </div>

              {/* Real-time Telemetry (Decorative) */}
              <div className="hidden md:flex items-center gap-6 text-white/40 font-mono text-[8px] uppercase tracking-widest">
                <div className="flex flex-col">
                  <span className="text-white/20">Latency</span>
                  <span className="text-brand">24ms</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/20">Security</span>
                  <span className="text-green-400">Hardened</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/20">Environment</span>
                  <span className="text-white/60">Vercel.Edge</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Source Code Access */}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all group flex items-center gap-2"
                  title="View Source Code"
                >
                  <GithubIcon size={16} className="group-hover:scale-110" />
                  <span className="text-[10px] uppercase tracking-widest hidden md:inline font-mono text-white/40 group-hover:text-white">
                    {s.sourceCode}
                  </span>
                </a>
              )}

              {/* External Access */}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all group"
                  title="Open External"
                >
                  <ExternalLink size={16} className="group-hover:scale-110" />
                </a>
              )}

              {/* Close Session */}
              <button
                onClick={() => setIsInteracting(false)}
                className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all group"
              >
                <X size={16} className="font-bold" />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest hidden xs:block">
                  {s.closeSession}
                </span>
              </button>
            </div>
          </header>
        )}

        {/* Viewport Area */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-black flex items-center justify-center z-[2005]">
          {/* Interaction Shield */}
          <div
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-700 group/shield cursor-pointer"
            style={{
              opacity: isInteracting ? 0 : 1,
              pointerEvents: isInteracting ? "none" : "all",
              backgroundColor: canInteract ? "rgba(0,0,0,0.6)" : "transparent",
              backdropFilter: canInteract ? "blur(15px)" : "none",
            }}
            onClick={() => canInteract && setIsInteracting(true)}
          >
            {canInteract && !isInteracting && (
              <div
                className={
                  motionEnabled
                    ? "flex flex-col items-center gap-6 animate-in fade-in zoom-in slide-in-from-bottom-8 duration-1000"
                    : "flex flex-col items-center gap-6"
                }
              >
                <div
                  className={`w-20 h-20 rounded-full bg-white/10 backdrop-blur-2xl border border-white/30 flex items-center justify-center text-white shadow-[0_0_50px_rgba(255,255,255,0.2)] ${motionEnabled ? "group-hover/shield:scale-110 transition-transform studio-pulse" : ""}`}
                >
                  <MousePointer2
                    size={32}
                    className={motionEnabled ? "animate-pulse" : ""}
                  />
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="font-mono text-[12px] font-black uppercase tracking-[0.4em] text-white">
                    {s.enterStudio}
                  </span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">
                    {s.clickToInteract}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 🌌 Scanning Lines / CRT Effect */}
          {isInteracting && (
            <div className="absolute inset-0 z-[105] pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,210,0.06))] bg-[length:100%_2px,3px_100%] select-none" />
          )}

          {shouldLoad && liveUrl ? (
            <>
              {!iframeLoaded && (
                <div className="absolute inset-0 z-[101] flex flex-col items-center justify-center bg-black gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-white/5 border-t-brand rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border border-white/10 border-b-brand rounded-full animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.5em] text-white animate-pulse">
                      {s.initializing}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-white/20">
                      {s.mounting}
                    </span>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={liveUrl}
                onLoad={() => setIframeLoaded(true)}
                title={iframeTitle}
                className={`w-full h-full border-none transition-all duration-1000 ${iframeLoaded ? "opacity-100" : "opacity-0"} ${isInteracting ? "scale-100" : "scale-[1.05]"}`}
                style={{
                  background: "#000",
                  filter:
                    canInteract && !isInteracting
                      ? "blur(15px) brightness(0.4) saturate(0.5)"
                      : "none",
                }}
              />
            </>
          ) : shouldLoad && videoUrl ? (
            <div className="w-full h-full bg-black relative">
              <video
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className={`w-full h-full object-cover transition-all duration-1000 ${isInteracting ? "scale-100" : "scale-[1.05]"}`}
                style={{
                  filter:
                    canInteract && !isInteracting
                      ? "blur(15px) brightness(0.4) saturate(0.5)"
                      : "none",
                }}
              />
              {/* HUD Overlay for Video */}
              {!isInteracting && (
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center gap-6 p-10 text-center">
              <div className="relative">
                {liveUrl || videoUrl ? (
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-white/5 border-t-brand rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border border-white/10 border-b-brand rounded-full animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
                    </div>
                  </div>
                ) : (
                  <Activity size={48} className="text-white/20 animate-pulse" />
                )}
                <div className="absolute inset-0 blur-2xl bg-white/5 animate-pulse" />
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.5em] text-white/60">
                  {liveUrl || videoUrl
                    ? s.preparing
                    : projectId === "rides24ofiziala"
                      ? s.demoWorking
                      : s.comingSoon}
                </span>
                <div className="w-12 h-px bg-white/10" />
                <span className="font-mono text-[8px] uppercase tracking-widest text-white/20 max-w-xs leading-relaxed">
                  {liveUrl || videoUrl ? s.scrollDownInit : s.auditDesc}
                </span>
              </div>
            </div>
          )}

          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none opacity-0 mix-blend-overlay"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Studio HUD - Bottom Status Bar */}
        {isInteracting && (
          <footer className="w-full bg-[#121212] border-t border-white/10 px-6 py-3 flex items-center justify-between shrink-0 z-[2010]">
            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-[8px] text-white/60 uppercase tracking-widest">
              Auth: <span className="text-brand">Developer_Privileges</span>{" "}
              {" // "} Root_Access: <span className="text-green-400">True</span>
            </div>

            <div className="hidden sm:flex items-center gap-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-[8px] text-white/60 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span>Signal_Strength: 98%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span>Data_integrity: Verified</span>
              </div>
            </div>
          </footer>
        )}
      </>
    );
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CINEMATIC HERO (Pinned Multi-Phase) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div
        ref={heroRef}
        className={`relative min-h-[100dvh] w-full overflow-hidden flex flex-col items-center bg-transparent ${staticStudioLayout ? "justify-start pt-10 md:pt-16" : "justify-center"}`}
        style={{
          perspective: isInteracting || !motionEnabled ? "none" : "2000px",
        }}
      >
        {/* ── Background Layer ── */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 will-change-transform z-0"
          style={{
            background: `linear-gradient(135deg, ${accent}15 0%, ${accent}08 100%)`,
            transformOrigin: "center center",
          }}
        />

        <div
          ref={overlayRef}
          className="absolute inset-0 opacity-0 z-[1] pointer-events-none"
        />

        {/* ── Phase 1 Content: Title focus ── */}
        <div
          ref={contentRef}
          className={`relative z-20 flex flex-col items-center justify-center text-center px-6 w-full will-change-transform ${staticStudioLayout ? "pt-0 pb-8 md:pb-10" : "pt-[20vh] md:pt-[24vh]"}`}
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
                className="font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-full border"
                style={{ borderColor: `${accent}40`, color: accent }}
              >
                {lang}
              </div>
            ))}
          </div>
        </div>

        {/* If motion is enabled, render the screen ref inside the hero for GSAP pinning / zoom */}
        {!disableStudio && !staticStudioLayout && (
          <div
            ref={screenRef}
            className={
              isInteracting
                ? "fixed inset-0 z-[2000] w-screen h-screen bg-[#0d0d0d] flex flex-col pointer-events-auto shadow-none"
                : "absolute left-1/2 top-1/2 z-30 pointer-events-auto transition-shadow duration-500 overflow-hidden bg-black flex items-center justify-center shadow-2xl border border-white/10"
            }
            style={
              isInteracting
                ? {
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: "100vw",
                    height: "100vh",
                    maxWidth: "100vw",
                    maxHeight: "100vh",
                    transform: "none",
                    borderRadius: 0,
                    zIndex: 2000,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#0d0d0d",
                  }
                : {
                    transformStyle: "preserve-3d",
                    willChange: "transform, width, height, border-radius",
                    borderColor: "rgba(255,255,255,0.1)",
                    opacity: 0,
                  }
            }
          >
            {renderScreenContents()}
          </div>
        )}

        {/* Dynamic Scroll HUD Indicator */}
        {!disableStudio && motionEnabled && (
          <div
            ref={scrollProgressRef}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[40] flex flex-col items-center pointer-events-none transition-all duration-300 w-[300px] px-6 py-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            style={{ opacity: 1 }}
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
                  className="h-full transition-all duration-75 ease-out rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  style={{ width: "0%", backgroundColor: accent }}
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white font-bold animate-pulse mt-2 flex items-center gap-1.5">
                {s.keepScrolling}{" "}
                <span className="inline-block animate-bounce font-sans text-xs">
                  ↓
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* If motion is disabled, render the screen ref as a separate, scrollable section beneath the hero */}
      {!disableStudio && staticStudioLayout && (
        <div className="relative py-20 bg-[#0a0a0a] flex flex-col items-center justify-center border-t border-white/10 w-full min-h-[85dvh]">
          <div
            ref={screenRef}
            className={
              isInteracting
                ? "fixed inset-0 z-[2000] w-screen h-screen bg-[#0d0d0d] flex flex-col pointer-events-auto shadow-none"
                : "relative z-30 pointer-events-auto overflow-hidden bg-black flex items-center justify-center shadow-2xl border border-white/10 mx-auto w-[min(94vw,1400px)] h-[65dvh] md:h-[72dvh] rounded-[2.5rem]"
            }
            style={
              isInteracting
                ? {
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: "100vw",
                    height: "100vh",
                    maxWidth: "100vw",
                    maxHeight: "100vh",
                    transform: "none",
                    borderRadius: 0,
                    zIndex: 2000,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#0d0d0d",
                  }
                : {
                    transformStyle: "preserve-3d",
                    willChange: "auto",
                    borderColor: "rgba(255,255,255,0.1)",
                    opacity: 1,
                    transform: "none",
                    width: "min(94vw, 1400px)",
                    maxWidth: "1400px",
                  }
            }
          >
            {renderScreenContents()}
          </div>
        </div>
      )}
    </>
  );
}

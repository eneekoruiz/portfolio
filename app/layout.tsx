import { ClientThemeProvider } from "./components/ui/ClientThemeProvider";
import { headers } from "next/headers";
import { SkipLink } from "./components/ui/SkipLink";
import "./styles/globals.css";
import "./styles/materia.css";
import "./styles/editorial.css";
import "./styles/project-preview.css";
import "./styles/project-reel.css";
import "./styles/brutal.css";
import "./styles/stack-cards.css";
import { IntroProvider } from "./components/IntroProvider";
import { EasterEgg } from "./components/ui/EasterEgg";
import { SmoothScroll } from "./components/motion/SmoothScroll";

import { MateriaLayer } from "./components/motion/MateriaLayer";
import { UmbralProvider } from "./components/motion/UmbralProvider";
import { CustomCursor } from "./components/ui/CustomCursor";
import { baseMetadata, jsonLd } from "./lib/metadata";

export const metadata = baseMetadata;
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") || "";

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f2efe8" />
        <meta name="color-scheme" content="light dark" />
        <link
          rel="preload"
          href="/fonts/roboto-flex-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://eneko-ruiz-curriculum.vercel.app"
        />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Lite mode / Device memory detection script */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var q = new URLSearchParams(location.search);
                  localStorage.removeItem('lite');
                  if (q.get('lite') === '1') sessionStorage.setItem('lite', '1');
                  if (sessionStorage.getItem('lite') === '1') {
                    window.__LITE = true;
                    document.documentElement.setAttribute('data-lite', '1');
                    return;
                  }
                  var dm = navigator.deviceMemory || 0;
                  if (dm && dm <= 1) {
                    window.__LITE = true;
                    document.documentElement.setAttribute('data-lite', '1');
                  }
                } catch (e) {}
              })();
            `.replace(/\s{2,}/g, " "),
          }}
        />
        {/* Elite Graceful Degradation for JS-disabled clients */}
        <noscript>
          <style
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `
                #main-content {
                  visibility: visible !important;
                  opacity: 1 !important;
                }
                .preloader-container, .splash-container, .identity-splash, #preloader, #splash, .cinematic-overture, .overture {
                  display: none !important;
                }
                #hero [data-char], #hero [data-cine-ui],
                .title-char, .word-inner, .about-reveal, .animate-char {
                  opacity: 1 !important;
                  transform: none !important;
                }
              `,
            }}
          />
        </noscript>
      </head>
      <body>
        <SkipLink />
        <div
          id="scroll-progress"
          className="fixed top-0 left-0 w-full h-[2px] bg-brand origin-left z-[9999] scale-x-0"
        />
        <ClientThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          nonce={nonce}
        >
          <CustomCursor />
          <SmoothScroll />
          <EasterEgg />

          <IntroProvider>
            <MateriaLayer />
            <UmbralProvider>{children}</UmbralProvider>
          </IntroProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}

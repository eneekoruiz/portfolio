import { Inter } from 'next/font/google';
import { ClientThemeProvider } from './components/ui/ClientThemeProvider';
import { headers } from 'next/headers';
import { SkipLink } from './components/ui/SkipLink';
import './styles/globals.css';
import { IntroProvider } from './components/IntroProvider';
import { EasterEgg } from './components/ui/EasterEgg';
import { SmoothScroll } from './components/motion/SmoothScroll';
import { InfallibleCursor } from './components/motion/InfallibleCursor';
import { baseMetadata, jsonLd } from './lib/metadata';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400','500','600','700','800','900'],
});

export const metadata = baseMetadata;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') || '';

  return (
    <html lang="es" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f5f5f7" />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://eneko-ruiz-curriculum.vercel.app" />
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
                  if (q.get('lite') === '1') {
                    window.__LITE = true;
                    localStorage.setItem('lite', '1');
                    document.documentElement.setAttribute('data-lite', '1');
                    return;
                  }
                  if (localStorage.getItem('lite') === '1') {
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
            `.replace(/\s{2,}/g, ' '),
          }}
        />
      </head>
      <body>
        <SkipLink />
        <div id="scroll-progress" className="fixed top-0 left-0 w-full h-[2px] bg-brand origin-left z-[9999] scale-x-0" />
        <ClientThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <SmoothScroll />
          <EasterEgg />
          <InfallibleCursor />
          <IntroProvider>{children}</IntroProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
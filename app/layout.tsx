import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { EasterEgg } from './components/ui/EasterEgg';
import { SmoothScroll } from './components/ui/SmoothScroll';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400','500','600','700','800','900'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://eneko.dev'),
  title: {
    default: 'Eneko Ruiz — Ingeniero Informático & Full Stack Developer',
    template: '%s · Eneko Ruiz',
  },
  description: 'Ingeniero Informático & Full Stack Developer desde Donostia, País Vasco. Me obsesiono con los detalles que nadie nota pero todo el mundo siente.',
  keywords: ['Eneko Ruiz','Full Stack','Donostia','Python','Java','Node.js','React','Next.js','TypeScript'],
  authors: [{ name: 'Eneko Ruiz', url: 'https://eneko.dev' }],
  openGraph: {
    type: 'website', locale: 'es_ES', url: 'https://eneko.dev', siteName: 'Eneko Ruiz',
    title: 'Eneko Ruiz — Full Stack Developer',
    description: 'Donostia · Me obsesiono con los detalles que nadie nota pero todo el mundo siente.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Eneko Ruiz Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image', creator: '@eneekoruiz',
    title: 'Eneko Ruiz — Full Stack Developer', images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://eneko.dev/#person',
      name: 'Eneko Ruiz',
      url: 'https://eneko.dev',
      email: 'eneekoruiz@gmail.com',
      jobTitle: 'Ingeniero Informático · Full Stack Developer',
      description: 'Full Stack Developer desde Donostia especializado en React, Next.js, Python y Java. Me obsesiono con los detalles que nadie nota pero todo el mundo siente.',
      image: 'https://eneko.dev/og.png',
      address: { '@type': 'PostalAddress', addressLocality: 'Donostia-San Sebastián', addressRegion: 'País Vasco', addressCountry: 'ES' },
      sameAs: ['https://github.com/eneekoruiz','https://linkedin.com/in/eneekoruiz'],
      knowsAbout: ['JavaScript','TypeScript','React','Next.js','Python','Java','Node.js','PostgreSQL','Docker','CI/CD'],
      alumniOf: { '@type': 'EducationalOrganization', name: 'Universidad del País Vasco / Euskal Herriko Unibertsitatea', url: 'https://www.ehu.eus' },
    },
    {
      '@type': 'SoftwareSourceCode',
      '@id': 'https://eneko.dev/#portfolio-source',
      name: 'Portfolio de Eneko Ruiz',
      description: 'Portfolio personal desarrollado con Next.js 14, React, Tailwind CSS y GSAP.',
      codeRepository: 'https://github.com/eneekoruiz/portfolio',
      programmingLanguage: ['TypeScript','CSS','JavaScript'],
      runtimePlatform: 'Node.js',
      author: { '@id': 'https://eneko.dev/#person' },
      url: 'https://eneko.dev',
      license: 'https://opensource.org/licenses/MIT',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://eneko.dev/#website',
      url: 'https://eneko.dev',
      name: 'Eneko Ruiz — Portfolio',
      description: 'Ingeniero Informático & Full Stack Developer desde Donostia.',
      author: { '@id': 'https://eneko.dev/#person' },
      inLanguage: ['es','en','eu'],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f5f5f7" />
        <meta name="color-scheme" content="light dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SmoothScroll />
          <EasterEgg />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
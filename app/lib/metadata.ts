import type { Metadata } from 'next';

const DOMAIN = 'https://eneko-ruiz.vercel.app';

export const baseMetadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: 'Eneko Ruiz — Ingeniero Informático & Full Stack Developer',
    template: '%s · Eneko Ruiz',
  },
  description: 'Ingeniero Informático & Full Stack Developer desde Donostia. Especializado en Next.js, React, Python y Java. Enfoque en calidad, arquitectura y performance.',
  keywords: ['Eneko Ruiz', 'Full Stack', 'Donostia', 'Software Engineer', 'React', 'Next.js', 'TypeScript', 'Node.js'],
  authors: [{ name: 'Eneko Ruiz', url: DOMAIN }],
  creator: 'Eneko Ruiz',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: DOMAIN,
    siteName: 'Eneko Ruiz',
    title: 'Eneko Ruiz — Full Stack Developer',
    description: 'Ingeniero Informático desde Donostia. Me obsesiono con los detalles que nadie nota pero todo el mundo siente.',
    images: [{ url: `${DOMAIN}/og.png`, width: 1200, height: 630, alt: 'Eneko Ruiz — Full Stack Developer' }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@eneekoruiz',
    title: 'Eneko Ruiz — Full Stack Developer',
    images: [`${DOMAIN}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: DOMAIN,
  },
};

export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${DOMAIN}/#person`,
      name: 'Eneko Ruiz',
      url: DOMAIN,
      email: 'eneekoruiz@gmail.com',
      jobTitle: 'Ingeniero Informático · Full Stack Developer',
      description: 'Full Stack Developer desde Donostia especializado en React, Next.js, Python y Java.',
      image: `${DOMAIN}/og.png`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Donostia-San Sebastián',
        addressRegion: 'País Vasco',
        addressCountry: 'ES',
      },
      sameAs: ['https://github.com/eneekoruiz', 'https://linkedin.com/in/eneekoruiz'],
      knowsAbout: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Python', 'Java', 'Node.js', 'PostgreSQL', 'Docker', 'CI/CD'],
    },
    {
      '@type': 'WebSite',
      '@id': `${DOMAIN}/#website`,
      url: DOMAIN,
      name: 'Eneko Ruiz — Portfolio',
      description: 'Ingeniero Informático & Full Stack Developer desde Donostia.',
      author: { '@id': `${DOMAIN}/#person` },
      inLanguage: ['es', 'en', 'eu'],
    },
  ],
};

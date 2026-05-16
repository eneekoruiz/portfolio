import type { Metadata } from 'next';

const DOMAIN = 'https://eneko-ruiz.vercel.app';

export const baseMetadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: 'Eneko Ruiz — Ingeniero Informático & Full Stack Developer',
    template: '%s · Eneko Ruiz',
  },
  description: 'Ingeniero Informático & Full Stack Developer. Especializado en arquitecturas escalables, Next.js, Python y performance web. Resolviendo problemas complejos con diseño premium.',
  keywords: [
    'Eneko Ruiz', 'Software Engineer', 'Full Stack Developer', 'Next.js Expert', 'React Developer', 
    'Python Engineer', 'Java Backend', 'UI/UX Performance', 'Donostia Software', 'San Sebastian Developer',
    'TypeScript', 'Supabase', 'TailwindCSS', 'GSAP Animations'
  ],
  authors: [{ name: 'Eneko Ruiz', url: DOMAIN }],
  creator: 'Eneko Ruiz',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: DOMAIN,
    siteName: 'Eneko Ruiz Portfolio',
    title: 'Eneko Ruiz — Full Stack Developer & Software Engineer',
    description: 'Ingeniero Informático desde Donostia. Me obsesiono con los detalles que nadie nota pero todo el mundo siente.',
    images: [{ url: `${DOMAIN}/og.png`, width: 1200, height: 630, alt: 'Eneko Ruiz Portfolio' }],
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
    shortcut: '/icon.png',
    apple: '/icon.png',
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
      description: 'Ingeniero Informático especializado en desarrollo Full Stack, arquitecturas reactivas y experiencias web de alto rendimiento.',
      image: `${DOMAIN}/og.png`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Donostia-San Sebastián',
        addressRegion: 'País Vasco',
        addressCountry: 'ES',
      },
      sameAs: ['https://github.com/eneekoruiz', 'https://linkedin.com/in/eneekoruiz'],
      knowsAbout: [
        'JavaScript', 'TypeScript', 'React', 'Next.js', 'Python', 'Java', 'Node.js', 
        'PostgreSQL', 'Docker', 'CI/CD', 'GSAP', 'Framer Motion', 'Cloud Architecture',
        'Performance Optimization', 'Responsive Design'
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${DOMAIN}/#website`,
      url: DOMAIN,
      name: 'Eneko Ruiz — Portfolio Personal',
      description: 'Explora los proyectos y la filosofía de desarrollo de Eneko Ruiz, Ingeniero Informático.',
      author: { '@id': `${DOMAIN}/#person` },
      inLanguage: ['es', 'en', 'eu'],
    },
  ],
};

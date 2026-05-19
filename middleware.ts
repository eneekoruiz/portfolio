import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Content Security Policy (CSP)
 * 
 * AUDIT-READY SECURITY STRATEGY:
 * 1. Production: Implements a Strict Nonce-based CSP for scripts.
 *    - Removes 'unsafe-eval' (prevents code injection via strings).
 *    - Removes 'unsafe-inline' (prevents unauthorized inline scripts).
 *    - Only allows scripts with the correct cryptographic nonce.
 * 2. Development: Retains 'unsafe-eval' and 'unsafe-inline' to support Next.js Fast Refresh (HMR).
 * 3. Style-src: Retains 'unsafe-inline'.
 *    - NECESSITY: Next.js, Tailwind CSS, and GSAP rely on dynamic runtime style injection 
 *      for performance optimization and complex physics-based animations.
 * 4. Protocol Safety: All 'http:' protocols are stripped; only secure 'https:' or 'self' allowed.
 */

export function middleware(request: NextRequest) {
  // Generate a random nonce for each request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';

  // Build the script-src directive
  // Production: Strict nonce-based policy. No unsafe-inline, no unsafe-eval.
  // Development: Relaxed policy for Next.js developer experience.
  const scriptSrc = isDev
    ? "'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.live"
    : `'self' 'nonce-${nonce}' 'sha256-n46vPwSWuMC0W703pBofImv82Z26xo4LXymv0E9caPk=' https://vercel.live https://*.vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com`; 

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://avatars.githubusercontent.com https://raw.githubusercontent.com https://eneko-ruiz.vercel.app;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.github.com https://eneko-ruiz-curriculum.vercel.app https://vercel.live https://*.vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com;
    frame-src 'self' https://eneko-ruiz-curriculum.vercel.app https://vercel.live https://agpeluqueria.vercel.app https://who-are-ya-backend.onrender.com https://pke-web.vercel.app;
    media-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  
  // Set the nonce in a header so RootLayout can access it
  requestHeaders.set('x-nonce', nonce);
  
  // Set the CSP header for both request (Server Components) and response (Browser)
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

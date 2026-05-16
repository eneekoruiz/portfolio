import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // CSP for Production:
  // We explicitly permit 'unsafe-inline' for style-src and script-src to support 
  // GSAP animations and dynamic styles. Nonces have been removed to ensure 
  // that 'unsafe-inline' is properly respected by the browser.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://avatars.githubusercontent.com https://raw.githubusercontent.com https://eneko-ruiz.vercel.app;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.github.com https://eneko-ruiz-curriculum.vercel.app https://vercel.live https://*.vercel.live;
    frame-src 'self' https://eneko-ruiz-curriculum.vercel.app https://vercel.live;
    media-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
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

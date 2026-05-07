import { NextRequest, NextResponse } from 'next/server';

// @ts-ignore
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_API_TOKEN;

export const revalidate = 3600; // 1 hour

const GITHUB_USER = 'eneekoruiz';
const CACHE_TTL = 3600; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Hardened param validation
  const sort = searchParams.get('sort') || 'updated';
  const direction = searchParams.get('direction') || 'desc';
  const per_page = Math.min(parseInt(searchParams.get('per_page') || '30', 10), 100);

  const cleanParams = new URLSearchParams({
    sort,
    direction,
    per_page: per_page.toString(),
  });

  const endpoint = `https://api.github.com/users/${GITHUB_USER}/repos?${cleanParams.toString()}`;
  const token = GITHUB_TOKEN;

  const requestHeaders: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Eneko-Portfolio-Backend',
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(endpoint, {
      headers: requestHeaders,
      // @ts-ignore
      next: { revalidate: CACHE_TTL },
    });

    // Handle Rate Limiting
    if (res.status === 403) {
      const resetTime = res.headers.get('X-RateLimit-Reset');
      return NextResponse.json(
        { error: 'GitHub API rate limit exceeded', resetAt: resetTime },
        { status: 429, headers: { 'Retry-After': resetTime || '3600' } }
      );
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: `GitHub API error: ${errorData.message || res.statusText}` },
        { status: res.status, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const repos = await res.json();

    // Enrich the first 8 non-fork repos with all languages in parallel
    const enrichedRepos = await Promise.all(
      repos
        .filter((r: { fork: boolean }) => !r.fork)
        .slice(0, 8)
        .map(async (repo: { id: number; languages_url: string; language: string | null }) => {
          try {
            const langRes = await fetch(repo.languages_url, {
              headers: requestHeaders,
              // @ts-ignore
              next: { revalidate: CACHE_TTL },
            });
            if (langRes.ok) {
              const langData: Record<string, number> = await langRes.json();
              return { ...repo, all_languages: Object.keys(langData) };
            }
          } catch (e) {
            console.error(`Failed to enrich repo ${repo.id}:`, e);
          }
          return { ...repo, all_languages: repo.language ? [repo.language] : [] };
        })
    );

    const finalData = repos.map((r: { id: number }) => {
      const enriched = enrichedRepos.find(er => er.id === r.id);
      return enriched || r;
    });

    return NextResponse.json(finalData, {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL / 2}`,
      },
    });
  } catch (err) {
    console.error('GitHub API Route error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
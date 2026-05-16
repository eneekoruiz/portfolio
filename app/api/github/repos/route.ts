import { NextRequest, NextResponse } from 'next/server';

/**
 * GitHub API Route - Hardened Error Handling & Security Audit Ready
 * Provides generic, professional error messages without leaking upstream details.
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_API_TOKEN;
const GITHUB_USER = 'eneekoruiz';
const CACHE_TTL = 3600; // 1 hour

// 1. Whitelists
const ALLOWED_SORT = ['updated', 'pushed', 'created', 'full_name'] as const;
const ALLOWED_DIRECTION = ['asc', 'desc'] as const;

type SortOption = (typeof ALLOWED_SORT)[number];
type DirectionOption = (typeof ALLOWED_DIRECTION)[number];

// 2. Generic Error Messages
const ERRORS = {
  INVALID_PARAMS: 'Invalid request parameters',
  RATE_LIMIT: 'GitHub rate limit reached',
  FETCH_FAILED: 'Unable to fetch repositories',
  INTERNAL: 'Internal Server Error',
} as const;

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  languages_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  all_languages?: string[];
  [key: string]: unknown;
}

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // 3. Strict Whitelist Validation (Return 400 instead of silent fallback for audit readiness)
  const s = searchParams.get('sort') || 'updated';
  if (!ALLOWED_SORT.includes(s as SortOption)) {
    return NextResponse.json({ error: ERRORS.INVALID_PARAMS }, { status: 400 });
  }
  const sort = s as SortOption;

  const d = searchParams.get('direction') || 'desc';
  if (!ALLOWED_DIRECTION.includes(d as DirectionOption)) {
    return NextResponse.json({ error: ERRORS.INVALID_PARAMS }, { status: 400 });
  }
  const direction = d as DirectionOption;

  const p = searchParams.get('per_page') || '30';
  const parsedP = parseInt(p, 10);
  if (isNaN(parsedP) || parsedP < 1 || parsedP > 100) {
    return NextResponse.json({ error: ERRORS.INVALID_PARAMS }, { status: 400 });
  }
  const perPage = parsedP;

  // 4. Manual URL Construction
  const cleanParams = new URLSearchParams({
    sort,
    direction,
    per_page: perPage.toString(),
    type: 'owner',
  });

  const endpoint = `https://api.github.com/users/${GITHUB_USER}/repos?${cleanParams.toString()}`;
  const requestHeaders: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Eneko-Portfolio-Backend',
  };

  if (GITHUB_TOKEN) {
    requestHeaders.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(endpoint, {
      headers: requestHeaders,
      next: { revalidate: CACHE_TTL },
    });

    // 5. Handle Rate Limiting (403/429)
    if (res.status === 403 || res.status === 429) {
      const resetTime = res.headers.get('X-RateLimit-Reset');
      console.warn(`GitHub Rate Limit hit. Reset at: ${resetTime}`);
      
      return NextResponse.json(
        { error: ERRORS.RATE_LIMIT },
        { 
          status: 429, 
          headers: { 
            'Retry-After': resetTime ?? '3600',
            'Cache-Control': 'no-store'
          } 
        }
      );
    }

    // 6. Generic Upstream Error Handling
    if (!res.ok) {
      // Log technical details internally
      console.error(`Upstream GitHub Error: ${res.status} ${res.statusText}`);
      
      return NextResponse.json(
        { error: ERRORS.FETCH_FAILED },
        { status: res.status === 404 ? 404 : 502, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const repos: GitHubRepo[] = await res.json();

    // 7. Parallel Enrichment (Hardened)
    const enrichedRepos = await Promise.all(
      repos
        .filter(r => !r.fork)
        .slice(0, 8)
        .map(async (repo) => {
          try {
            const langRes = await fetch(repo.languages_url, {
              headers: requestHeaders,
              next: { revalidate: CACHE_TTL },
            });
            if (langRes.ok) {
              const langData: Record<string, number> = await langRes.json();
              return { ...repo, all_languages: Object.keys(langData) };
            }
          } catch (e) {
            // Silently log enrichment failures to avoid breaking main response
            console.error(`Enrichment failed for repo ${repo.id}:`, e);
          }
          return { ...repo, all_languages: repo.language ? [repo.language] : [] };
        })
    );

    const finalData = repos.map(r => {
      const enriched = enrichedRepos.find(er => er.id === r.id);
      return enriched ?? r;
    });

    // 8. Secure Response
    return NextResponse.json(finalData, {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL / 2}`,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    // 9. Final Fallback for critical failures
    const logMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Critical GitHub Route Failure:', logMsg);
    
    return NextResponse.json(
      { error: ERRORS.INTERNAL },
      { status: 500 }
    );
  }
}
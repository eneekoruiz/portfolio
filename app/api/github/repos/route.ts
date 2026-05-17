import { NextRequest, NextResponse } from 'next/server';

/**
 * GitHub API Route - Hardened Error Handling & Security Audit Ready
 * Provides generic, professional error messages without leaking upstream details.
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_API_TOKEN;
const GITHUB_USER = 'eneekoruiz';
const CACHE_TTL = 3600; // 1 hour

const ALLOWED_SORT = ['updated', 'pushed', 'created', 'full_name'] as const;
const ALLOWED_DIRECTION = ['asc', 'desc'] as const;

type SortOption = (typeof ALLOWED_SORT)[number];
type DirectionOption = (typeof ALLOWED_DIRECTION)[number];

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

interface ValidatedParams {
  sort: SortOption;
  direction: DirectionOption;
  perPage: number;
}

export const revalidate = 3600;

/**
 * Validates and parses query parameters cleanly.
 */
function parseRequestParams(urlStr: string): ValidatedParams | null {
  try {
    const { searchParams } = new URL(urlStr);

    const sortParam = searchParams.get('sort') ?? 'updated';
    if (!ALLOWED_SORT.includes(sortParam as SortOption)) {
      return null;
    }

    const directionParam = searchParams.get('direction') ?? 'desc';
    if (!ALLOWED_DIRECTION.includes(directionParam as DirectionOption)) {
      return null;
    }

    const perPageParam = searchParams.get('per_page') ?? '30';
    const parsed = Number.parseInt(perPageParam, 10);
    if (!Number.isInteger(parsed) || !Number.isFinite(parsed) || parsed < 1 || parsed > 100) {
      return null;
    }

    return {
      sort: sortParam as SortOption,
      direction: directionParam as DirectionOption,
      perPage: parsed,
    };
  } catch {
    return null;
  }
}

/**
 * Enriches a repository with its language details.
 */
async function enrichRepoLanguages(repo: GitHubRepo, headers: HeadersInit): Promise<GitHubRepo> {
  try {
    const langRes = await fetch(repo.languages_url, {
      headers,
      next: { revalidate: CACHE_TTL },
    });
    if (langRes.ok) {
      const langData: Record<string, number> = await langRes.json();
      return { ...repo, all_languages: Object.keys(langData) };
    }
  } catch (e) {
    console.error(`Enrichment failed for repo ${repo.id}:`, e);
  }
  return { ...repo, all_languages: repo.language ? [repo.language] : [] };
}

export async function GET(request: NextRequest) {
  const validated = parseRequestParams(request.url);
  if (!validated) {
    return NextResponse.json({ error: ERRORS.INVALID_PARAMS }, { status: 400 });
  }

  const { sort, direction, perPage } = validated;

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

    // Handle Rate Limiting (403/429)
    if (res.status === 403 || res.status === 429) {
      const resetTime = res.headers.get('X-RateLimit-Reset');
      console.warn(`GitHub Rate Limit hit. Reset at: ${resetTime}`);

      return NextResponse.json(
        { error: ERRORS.RATE_LIMIT },
        {
          status: 429,
          headers: {
            'Retry-After': resetTime ?? '3600',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // Generic Upstream Error Handling
    if (!res.ok) {
      console.error(`Upstream GitHub Error: ${res.status} ${res.statusText}`);
      return NextResponse.json(
        { error: ERRORS.FETCH_FAILED },
        {
          status: res.status === 404 ? 404 : 502,
          headers: { 'Cache-Control': 'no-store' },
        }
      );
    }

    const repos: GitHubRepo[] = await res.json();

    // Parallel Enrichment (Hardened)
    const enrichedRepos = await Promise.all(
      repos
        .filter((r) => !r.fork)
        .slice(0, 8)
        .map((repo) => enrichRepoLanguages(repo, requestHeaders))
    );

    const finalData = repos.map((r) => {
      const enriched = enrichedRepos.find((er) => er.id === r.id);
      return enriched ?? r;
    });

    return NextResponse.json(finalData, {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL / 2}`,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    const logMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Critical GitHub Route Failure:', logMsg);

    return NextResponse.json(
      { error: ERRORS.INTERNAL },
      { status: 500 }
    );
  }
}
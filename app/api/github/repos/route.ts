import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_API_TOKEN;
const GITHUB_USER = "eneekoruiz";
const CACHE_TTL = 3600;
const REQUEST_BUDGET_MS = 7000;
const ALLOWED_SORT = ["updated", "pushed", "created", "full_name"] as const;
const ALLOWED_DIRECTION = ["asc", "desc"] as const;
type SortOption = (typeof ALLOWED_SORT)[number];
type DirectionOption = (typeof ALLOWED_DIRECTION)[number];
const ERRORS = {
  INVALID_PARAMS: "Invalid request parameters",
  RATE_LIMIT: "GitHub rate limit reached",
  FETCH_FAILED: "Unable to fetch repositories",
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
  pushed_at: string;
  size: number;
  all_languages?: string[];
  [key: string]: unknown;
}
interface ValidatedParams {
  sort: SortOption;
  direction: DirectionOption;
  perPage: number;
}
export const revalidate = 3600;

function parseRequestParams(urlStr: string): ValidatedParams | null {
  const { searchParams } = new URL(urlStr);
  const sort = ALLOWED_SORT.find(
    (value) => value === (searchParams.get("sort") ?? "updated"),
  );
  const direction = ALLOWED_DIRECTION.find(
    (value) => value === (searchParams.get("direction") ?? "desc"),
  );
  const value = searchParams.get("per_page") ?? "30";
  if (!sort || !direction || !/^\d{1,3}$/.test(value)) return null;
  const perPage = Number(value);
  return perPage >= 1 && perPage <= 100 ? { sort, direction, perPage } : null;
}
function parseRepository(value: unknown): GitHubRepo | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (
    !Number.isSafeInteger(row.id) ||
    Number(row.id) <= 0 ||
    typeof row.name !== "string" ||
    !/^[\w.-]{1,100}$/.test(row.name) ||
    row.name === "." ||
    row.name === ".." ||
    typeof row.fork !== "boolean" ||
    !(row.description === null || typeof row.description === "string") ||
    !(row.language === null || typeof row.language === "string") ||
    typeof row.pushed_at !== "string" ||
    !Number.isFinite(Date.parse(row.pushed_at)) ||
    !Number.isSafeInteger(row.size) ||
    Number(row.size) < 0 ||
    !Number.isSafeInteger(row.stargazers_count) ||
    Number(row.stargazers_count) < 0
  )
    return null;
  const htmlUrl = `https://github.com/${GITHUB_USER}/${encodeURIComponent(row.name)}`;
  if (
    typeof row.html_url !== "string" ||
    row.html_url.toLowerCase() !== htmlUrl.toLowerCase()
  )
    return null;
  return {
    ...row,
    id: Number(row.id),
    name: row.name,
    full_name: `${GITHUB_USER}/${row.name}`,
    html_url: htmlUrl,
    fork: row.fork,
    description:
      typeof row.description === "string"
        ? row.description.slice(0, 1024)
        : null,
    language:
      typeof row.language === "string" ? row.language.slice(0, 64) : null,
    pushed_at: row.pushed_at,
    updated_at:
      typeof row.updated_at === "string" &&
      Number.isFinite(Date.parse(row.updated_at))
        ? row.updated_at
        : row.pushed_at,
    size: Number(row.size),
    stargazers_count: Number(row.stargazers_count),
    forks_count:
      Number.isSafeInteger(row.forks_count) && Number(row.forks_count) >= 0
        ? Number(row.forks_count)
        : 0,
    // Never forward server credentials to a URL supplied by upstream data.
    languages_url: `https://api.github.com/repos/${GITHUB_USER}/${encodeURIComponent(row.name)}/languages`,
  };
}
function errorResponse(message: string, status: number, retryAfter?: string) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        ...(retryAfter ? { "Retry-After": retryAfter } : {}),
      },
    },
  );
}
function retryDelay(headers: Headers): string {
  const retry = headers.get("Retry-After");
  let delay: number | undefined;
  if (retry && /^\d+$/.test(retry)) delay = Number(retry);
  else if (retry && Number.isFinite(Date.parse(retry)))
    delay = (Date.parse(retry) - Date.now()) / 1000;
  const reset = headers.get("X-RateLimit-Reset");
  if (delay === undefined && reset && /^\d+$/.test(reset))
    delay = Number(reset) - Date.now() / 1000;
  return String(Math.min(86400, Math.max(1, Math.ceil(delay ?? 3600))));
}
async function enrichRepoLanguages(
  repo: GitHubRepo,
  headers: HeadersInit,
  budget: AbortSignal,
): Promise<GitHubRepo> {
  const fallback = {
    ...repo,
    all_languages: repo.language ? [repo.language] : [],
  };
  if (budget.aborted) return fallback;
  try {
    const response = await fetch(repo.languages_url, {
      headers,
      next: { revalidate: CACHE_TTL },
      signal: AbortSignal.any([budget, AbortSignal.timeout(3000)]),
    });
    if (!response.ok) return fallback;
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || Array.isArray(data))
      return fallback;
    const languages = Object.entries(data)
      .filter(
        ([language, bytes]) =>
          language.length > 0 &&
          language.length <= 64 &&
          typeof bytes === "number" &&
          Number.isFinite(bytes) &&
          bytes >= 0,
      )
      .slice(0, 30)
      .map(([language]) => language);
    return {
      ...repo,
      all_languages: languages.length ? languages : fallback.all_languages,
    };
  } catch {
    // Language details are optional; the repository and primary language survive.
    return fallback;
  }
}
async function enrichRepositories(
  repos: GitHubRepo[],
  headers: HeadersInit,
  budget: AbortSignal,
) {
  const selected = repos.filter((repo) => !repo.fork).slice(0, 8);
  const enriched = new Map<number, GitHubRepo>();
  let nextIndex = 0;
  await Promise.all(
    Array.from({ length: Math.min(3, selected.length) }, async () => {
      while (nextIndex < selected.length) {
        const repo = selected[nextIndex++];
        enriched.set(repo.id, await enrichRepoLanguages(repo, headers, budget));
      }
    }),
  );
  return repos.map((repo) => enriched.get(repo.id) ?? repo);
}
export async function GET(request: NextRequest) {
  const validated = parseRequestParams(request.url);
  if (!validated) return errorResponse(ERRORS.INVALID_PARAMS, 400);
  const { sort, direction, perPage } = validated;
  const summary = request.nextUrl.searchParams.get("summary") === "1";
  const parameters = new URLSearchParams({
    sort,
    direction,
    per_page: String(perPage),
    type: "owner",
  });
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Eneko-Portfolio-Backend",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  const budget = AbortSignal.any([
    request.signal,
    AbortSignal.timeout(REQUEST_BUDGET_MS),
  ]);
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?${parameters}`,
      {
        headers,
        next: { revalidate: CACHE_TTL },
        signal: AbortSignal.any([budget, AbortSignal.timeout(4500)]),
      },
    );
    const rateLimited =
      response.status === 429 ||
      (response.status === 403 &&
        (response.headers.get("X-RateLimit-Remaining") === "0" ||
          response.headers.has("Retry-After")));
    if (rateLimited)
      return errorResponse(
        ERRORS.RATE_LIMIT,
        429,
        retryDelay(response.headers),
      );
    if (!response.ok) {
      console.warn(
        "GitHub repository request failed with status",
        response.status,
      );
      return errorResponse(
        ERRORS.FETCH_FAILED,
        response.status === 404 ? 404 : 502,
      );
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) return errorResponse(ERRORS.FETCH_FAILED, 502);
    const seen = new Set<number>();
    const repos = data
      .slice(0, perPage)
      .map(parseRepository)
      .filter((repo): repo is GitHubRepo => repo !== null)
      .filter((repo) => {
        if (seen.has(repo.id)) return false;
        seen.add(repo.id);
        return true;
      });
    if (data.length > 0 && repos.length === 0)
      return errorResponse(ERRORS.FETCH_FAILED, 502);
    const finalData = summary
      ? repos.map((repo) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          language: repo.language,
          pushed_at: repo.pushed_at,
          fork: repo.fork,
          size: repo.size,
          stargazers_count: repo.stargazers_count,
          languages_url: repo.languages_url,
        }))
      : await enrichRepositories(repos, headers, budget);
    return NextResponse.json(finalData, {
      status: 200,
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL / 2}`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    console.warn("GitHub repository request unavailable");
    return errorResponse(ERRORS.FETCH_FAILED, 502);
  }
}

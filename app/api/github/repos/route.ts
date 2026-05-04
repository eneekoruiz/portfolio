import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.toString();
  const endpoint = `https://api.github.com/users/eneekoruiz/repos${search ? `?${search}` : ''}`;
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_API_TOKEN;

  try {
    const res = await fetch(endpoint, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

    let repos = await res.json();

    if (!res.ok) {
      const ghMessage = repos?.message || res.statusText || 'Unknown error';
      return NextResponse.json(
        { error: `${res.status}: ${ghMessage}` },
        { status: res.status, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    // Enrich the first 8 non-fork repos with all languages
    const enrichedRepos = await Promise.all(
      repos.filter((r: any) => !r.fork).slice(0, 8).map(async (repo: any) => {
        try {
          const langRes = await fetch(repo.languages_url, {
            headers: {
              Accept: 'application/vnd.github+json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { revalidate: 3600 } // Cache languages for an hour
          });
          if (langRes.ok) {
            const langData = await langRes.json();
            return { ...repo, all_languages: Object.keys(langData) };
          }
        } catch (_) {}
        return { ...repo, all_languages: repo.language ? [repo.language] : [] };
      })
    );

    // Replace enriched repos back in the list or just return them if we only care about those
    // For simplicity and since useGitHub slices anyway, we can return everything but enriched ones updated
    const finalData = repos.map((r: any) => {
      const enriched = enrichedRepos.find(er => er.id === r.id);
      return enriched || r;
    });

    return NextResponse.json(finalData, {
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return NextResponse.json(
      { error: `502: ${message}` },
      { status: 502 },
    );
  }
}
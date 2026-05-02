import { NextRequest, NextResponse } from 'next/server';

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

    const data = await res.json();
    return NextResponse.json(data, {
      status: res.status,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to fetch GitHub repositories' },
      { status: 502 },
    );
  }
}
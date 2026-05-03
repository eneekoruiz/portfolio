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

    // Propagar error técnico real de GitHub al cliente
    if (!res.ok) {
      const ghMessage = data?.message || res.statusText || 'Unknown error';
      return NextResponse.json(
        { error: `${res.status}: ${ghMessage}` },
        {
          status: res.status,
          headers: { 'Cache-Control': 'no-store' },
        },
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return NextResponse.json(
      { error: `502: ${message}` },
      { status: 502 },
    );
  }
}
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const backend = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';
  const url = new URL(req.url);
  const lang = url.searchParams.get('lang') || 'en';

  const target = `${backend.replace(/\/$/, '')}/api/v2/home-bottom-seo?lang=${encodeURIComponent(
    lang
  )}`;

  const res = await fetch(target, {
    headers: {
      'x-system-key': systemKey,
    },
  });

  const data = await res.text();
  try {
    const json = JSON.parse(data);
    return NextResponse.json(json, { status: res.status });
  } catch {
    return new NextResponse(data, { status: res.status });
  }
}

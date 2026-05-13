import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/v2/camping-offers`, {
      headers: {
        'x-system-key': process.env.API_SYSTEM_KEY || '',
      },
      next: { revalidate: 0 },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Camping offers proxy error:', error);
    return NextResponse.json({ data: [], success: false }, { status: 500 });
  }
}

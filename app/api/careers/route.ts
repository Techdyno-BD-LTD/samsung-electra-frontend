import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/v2/careers`, {
      cache: 'no-store',
      headers: {
        'x-system-key': process.env.API_SYSTEM_KEY || '',
      },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch careers proxy error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch careers' }, { status: 500 });
  }
}

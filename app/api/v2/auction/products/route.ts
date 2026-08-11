import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const backendUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';

  try {
    const { searchParams } = new URL(request.url);
    const response = await fetch(`${backendUrl}/api/v2/auction/products?${searchParams.toString()}`, {
      cache: 'no-store',
      headers: {
        'x-system-key': systemKey,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch auction products' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching auction products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

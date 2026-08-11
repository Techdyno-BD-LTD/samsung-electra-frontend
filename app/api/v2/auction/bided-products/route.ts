import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const backendUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';

  try {
    const authHeader = request.headers.get('Authorization') || '';

    const response = await fetch(`${backendUrl}/api/v2/auction/bided-products`, {
      method: 'GET',
      headers: {
        'x-system-key': systemKey,
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch bided products' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching bided products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

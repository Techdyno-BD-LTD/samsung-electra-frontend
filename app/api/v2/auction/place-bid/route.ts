import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const backendUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';

  try {
    const body = await request.json();
    const authHeader = request.headers.get('Authorization') || '';

    const response = await fetch(`${backendUrl}/api/v2/auction/place-bid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-system-key': systemKey,
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error placing auction bid:', error);
    return NextResponse.json({ error: 'Internal Server Error', success: false }, { status: 500 });
  }
}

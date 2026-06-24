import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const backendUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';

  try {
    const response = await fetch(`${backendUrl}/api/v2/b2b-queries/store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-system-key': systemKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in b2b-queries proxy:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

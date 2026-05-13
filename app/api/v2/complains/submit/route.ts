import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();
    
    const response = await fetch(`${process.env.API_BASE_URL}/api/v2/complains/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-system-key': process.env.API_SYSTEM_KEY || '',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Submit complain proxy error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/v2/faqs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-system-key': process.env.API_SYSTEM_KEY || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch FAQ proxy error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    const response = await fetch(`${process.env.API_BASE_URL}/api/v2/complains/delivered-products`, {
      headers: {
        'x-system-key': process.env.API_SYSTEM_KEY || '',
        'Authorization': authHeader || '',
      },
      next: { revalidate: 0 },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Delivered products proxy error:', error);
    return NextResponse.json({ data: [], success: false }, { status: 500 });
  }
}

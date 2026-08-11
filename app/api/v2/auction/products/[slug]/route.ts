import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const backendUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';

  const authHeader = request.headers.get('authorization') || '';

  try {
    const response = await fetch(`${backendUrl}/api/v2/auction/products/${slug}`, {
      cache: 'no-store',
      headers: {
        'x-system-key': systemKey,
        ...(authHeader ? { 'authorization': authHeader } : {}),
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch auction product details for ${slug}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching auction product details for ${slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

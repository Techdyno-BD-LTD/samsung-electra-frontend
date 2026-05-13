import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/v2/flash-deals/details/${slug}`, {
      headers: {
        'x-system-key': process.env.API_SYSTEM_KEY || '',
      },
      next: { revalidate: 0 },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Flash deal details proxy error:', error);
    return NextResponse.json({ data: [], success: false }, { status: 500 });
  }
}

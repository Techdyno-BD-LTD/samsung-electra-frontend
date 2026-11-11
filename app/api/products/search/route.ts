import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const backendUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const queryString = searchParams.toString();

  try {
    const response = await fetch(`${backendUrl}/api/v2/products/search${queryString ? `?${queryString}` : ''}`, {
      cache: 'no-store',
      headers: {
        'x-system-key': process.env.API_SYSTEM_KEY || '',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to search products' }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

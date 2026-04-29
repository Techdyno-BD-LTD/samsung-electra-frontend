import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const backendUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  
  try {
    const response = await fetch(`${backendUrl}/api/v2/products/new-arrivals`, {
      cache: 'no-store',
      headers: {
        'x-system-key': process.env.API_SYSTEM_KEY || '',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch new arrivals' }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

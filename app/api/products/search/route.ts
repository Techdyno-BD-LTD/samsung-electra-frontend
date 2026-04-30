import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '';
  const keyword = searchParams.get('keyword') || '';
  const page = searchParams.get('page') || '1';
  const categoryId = searchParams.get('category_id');
  
  const backendUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const query = new URLSearchParams();
  if (name) query.append('name', name);
  if (keyword) query.append('keyword', keyword);
  if (categoryId) query.append('category_id', categoryId);
  query.append('page', page);

  try {
    const response = await fetch(`${backendUrl}/api/v2/products/search?${query.toString()}`, {
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

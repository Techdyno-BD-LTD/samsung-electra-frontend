import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const formData = await request.formData();
    
    const response = await fetch(`${process.env.API_BASE_URL}/api/v2/complains/upload`, {
      method: 'POST',
      headers: {
        'x-system-key': process.env.API_SYSTEM_KEY || '',
        'Authorization': authHeader || '',
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload document proxy error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

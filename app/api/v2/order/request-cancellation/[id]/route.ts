import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const authHeader = req.headers.get('authorization');
    
    const response = await fetch(`${process.env.API_BASE_URL}/api/v2/order/request-cancellation/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
        'X-System-Key': process.env.API_SYSTEM_KEY || ''
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Cancellation request proxy error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

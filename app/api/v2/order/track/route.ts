import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const phone = searchParams.get('phone');

  if (!code) {
    return NextResponse.json({ success: false, message: 'Order code is required' }, { status: 400 });
  }

  try {
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/v2/order/track?code=${code}&phone=${phone || ''}`, {
      headers: {
        'x-system-key': process.env.API_SYSTEM_KEY || '',
      },
      next: { revalidate: 0 } // No caching for order status
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Order Track Proxy Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY;

  try {
    const body = await req.json();
    const res = await fetch(`${baseUrl}/api/v2/coupon-apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-system-key': systemKey || '',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to apply coupon' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY;

  try {
    const res = await fetch(`${baseUrl}/api/v2/coupon-list`, {
      headers: {
        'x-system-key': systemKey || '',
      },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch coupons' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/careers`, {
      headers: {
        'x-system-key': process.env.API_SYSTEM_KEY || '',
      },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch careers' }, { status: 500 });
  }
}

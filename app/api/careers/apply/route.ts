import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get('authorization');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/careers/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-system-key': process.env.API_SYSTEM_KEY || '',
        'authorization': authHeader || '',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to submit application' }, { status: 500 });
  }
}

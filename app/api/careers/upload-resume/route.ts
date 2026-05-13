import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const authHeader = req.headers.get('authorization');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/careers/upload-resume`, {
      method: 'POST',
      headers: {
        'x-system-key': process.env.API_SYSTEM_KEY || '',
        'authorization': authHeader || '',
      },
      body: formData,
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to upload resume' }, { status: 500 });
  }
}

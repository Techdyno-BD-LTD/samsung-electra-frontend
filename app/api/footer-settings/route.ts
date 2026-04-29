import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v2';
    const response = await fetch(`${backendUrl}/footer-settings`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-system-key': process.env.API_SYSTEM_KEY || '',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching footer settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch footer settings' },
      { status: 500 }
    );
  }
}

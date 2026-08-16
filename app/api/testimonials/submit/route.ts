import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const backendUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  
  try {
    const body = await req.json();
    const response = await fetch(`${backendUrl}/api/v2/testimonials/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-system-key': process.env.API_SYSTEM_KEY || '',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to submit testimonial' }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

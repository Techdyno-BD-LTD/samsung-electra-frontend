import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    const authHeader = request.headers.get('authorization') || '';

    // The backend route is /api/v2/invoice/download/:id
    const response = await fetch(`${backendUrl}/api/v2/invoice/download/${id}`, {
      headers: {
        'x-system-key': process.env.API_SYSTEM_KEY || '',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return new NextResponse(errorMsg, { status: response.status });
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': response.headers.get('content-disposition') || 'attachment; filename="invoice.pdf"',
      },
    });
  } catch (error) {
    console.error('Invoice Proxy Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

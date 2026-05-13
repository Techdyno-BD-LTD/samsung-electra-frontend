import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;

  if (!baseUrl || !systemKey) {
    return NextResponse.json({ success: false, message: "Server config error" }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const body: Record<string, string> = {};
    formData.forEach((value, key) => {
      body[key] = value.toString();
    });

    // We use application/x-www-form-urlencoded to match what SSLCommerz sends
    const searchParams = new URLSearchParams();
    for (const key in body) {
        searchParams.append(key, body[key]);
    }

    const response = await fetch(`${baseUrl}/api/v2/payment/ssl-success`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-system-key": systemKey,
      },
      body: searchParams.toString(),
      redirect: 'manual', // We want to handle the redirect ourselves
    });

    const location = response.headers.get('location');
    if (location) {
        return NextResponse.redirect(location, 303);
    }

    // If no redirect, return the backend response
    const data = await response.text();
    return new NextResponse(data, { 
        status: response.status,
        headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    console.error("Proxy error for ssl-success:", error);
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 500 });
  }
}

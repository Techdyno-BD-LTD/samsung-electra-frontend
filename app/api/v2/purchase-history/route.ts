import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;
  const authHeader = request.headers.get("authorization");

  if (!baseUrl || !systemKey) {
    return NextResponse.json({ success: false, message: "Server config error" }, { status: 500 });
  }

  try {
    const response = await fetch(`${baseUrl}/api/v2/purchase-history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-system-key": systemKey,
        ...(authHeader ? { "Authorization": authHeader } : {}),
      },
      cache: 'no-store'
    });

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Purchase history proxy error:", error);
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 500 });
  }
}

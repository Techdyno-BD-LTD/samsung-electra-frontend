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
    const response = await fetch(`${baseUrl}/api/v2/customer/info`, {
      method: "GET",
      headers: {
        "x-system-key": systemKey,
        ...(authHeader ? { "Authorization": authHeader } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Customer info proxy error:", error);
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 500 });
  }
}

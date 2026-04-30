import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;
  const authHeader = request.headers.get("authorization");

  if (!baseUrl || !systemKey) {
    return NextResponse.json({ success: false, message: "Server config error" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const response = await fetch(`${baseUrl}/api/v2/profile/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-system-key": systemKey,
        ...(authHeader ? { "Authorization": authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Profile update proxy error:", error);
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 500 });
  }
}

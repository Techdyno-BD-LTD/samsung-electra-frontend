import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;
  const body = await req.json();

  if (!baseUrl || !systemKey) {
    return NextResponse.json({ result: false, message: "Server configuration missing" }, { status: 500 });
  }

  try {
    const response = await fetch(`${baseUrl}/api/v2/auth/social-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-system-key": systemKey,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (data.result && data.access_token) {
      return NextResponse.json({
        result: true,
        message: data.message || "Successfully logged in",
        token: data.access_token,
        user: data.user
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Social login proxy error:", error);
    return NextResponse.json({ result: false, message: "Backend unreachable" }, { status: 500 });
  }
}

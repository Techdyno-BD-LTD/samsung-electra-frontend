import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;
  const authHeader = req.headers.get("authorization");
  const id = params.id;

  if (!baseUrl || !systemKey) {
    return NextResponse.json({ success: false, message: "Server config error" }, { status: 500 });
  }

  try {
    const response = await fetch(`${baseUrl}/api/v2/user/shipping/delete/${id}`, {
      method: "GET",
      headers: {
        "x-system-key": systemKey,
        ...(authHeader ? { "authorization": authHeader } : {}),
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 500 });
  }
}

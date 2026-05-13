import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:5000/api";
    const systemKey = process.env.SYSTEM_KEY || "b292a2c7d7ef4e7aab78f37849196364d961492455d5aa503549ac190ef83068";

    const response = await fetch(`${backendUrl}/v2/exchange-products`, {
      headers: {
        "Content-Type": "application/json",
        "x-system-key": systemKey
      },
      cache: 'no-store'
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

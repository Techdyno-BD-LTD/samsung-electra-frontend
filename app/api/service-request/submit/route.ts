import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;

  if (!baseUrl || !systemKey) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing API configuration.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const authHeader = request.headers.get("Authorization");
    
    // Forward the request to the backend
    const response = await fetch(`${baseUrl}/api/v2/service-requests/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-system-key": systemKey,
        ...(authHeader ? { "Authorization": authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in service request proxy:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}

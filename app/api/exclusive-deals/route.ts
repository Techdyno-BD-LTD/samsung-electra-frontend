import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;

  if (!baseUrl || !systemKey) {
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Missing API_BASE_URL or API_SYSTEM_KEY in frontend env.",
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${baseUrl}/api/v2/exclusive-deals`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "x-system-key": systemKey,
      },
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          status: response.status,
          message: "Failed to fetch exclusive deals from backend.",
          backend: payload,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Unable to reach backend exclusive deals API.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

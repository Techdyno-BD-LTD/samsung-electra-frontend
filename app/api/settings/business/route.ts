import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;

  if (!baseUrl || !systemKey) {
    return NextResponse.json(
      { success: false, message: "Server configuration missing" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${baseUrl}/api/v2/business-settings`, {
      headers: {
        "x-system-key": systemKey,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      ...data,
      system_key: systemKey
    });
  } catch (error) {
    console.error("Error fetching business settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

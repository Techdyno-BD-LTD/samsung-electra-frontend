import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;
  const slug = params.slug;

  if (!baseUrl || !systemKey) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing API_BASE_URL or API_SYSTEM_KEY in frontend env.",
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${baseUrl}/api/v2/category/info/${slug}`, {
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
          message: "Failed to fetch category info from backend.",
          backend: payload,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: (error as Error).message || "Unable to reach backend category info API.",
      },
      { status: 500 }
    );
  }
}

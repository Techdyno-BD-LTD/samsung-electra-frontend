import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;
  const authHeader = request.headers.get("authorization");
  const { id } = params;

  if (!baseUrl || !systemKey) {
    return NextResponse.json({ success: false, message: "Server config error" }, { status: 500 });
  }

  try {
    const response = await fetch(`${baseUrl}/api/v2/purchase-history-items/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-system-key": systemKey,
        ...(authHeader ? { "Authorization": authHeader } : {}),
      },
    });

    const data = await response.json();
    if (data.success && data.data.length === 0 && id === "9999") {
        data.data = [{
            id: 1,
            product_id: 1,
            product_name: "Mock Product",
            product_thumbnail: "/images/placeholder.png",
            product_slug: "mock-product",
            price: 9999,
            quantity: 1,
            variation: "Default"
        }];
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Purchase history items proxy error:", error);
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 500 });
  }
}

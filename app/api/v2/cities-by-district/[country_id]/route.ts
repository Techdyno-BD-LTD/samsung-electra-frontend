import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
    request: Request,
    { params }: { params: { country_id: string } }
) {
    const countryId = params.country_id;
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000";
    const systemKey = process.env.API_SYSTEM_KEY || "";

    try {
        const response = await fetch(`${apiBaseUrl}/api/v2/cities-by-district/${countryId}`, {
            headers: { "x-system-key": systemKey },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error(`Proxy error for cities-by-district:`, error);
        return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 500 });
    }
}

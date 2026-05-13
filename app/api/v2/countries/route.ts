import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000";
        const systemKey = process.env.API_SYSTEM_KEY || "";
        
        const response = await fetch(`${apiBaseUrl}/api/v2/countries`, {
            headers: {
                "x-system-key": systemKey,
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error(`Proxy error for countries:`, error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

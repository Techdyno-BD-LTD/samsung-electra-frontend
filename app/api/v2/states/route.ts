import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getProxy(req: NextRequest, endpoint: string) {
    try {
        const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000";
        const systemKey = process.env.API_SYSTEM_KEY || "";
        
        const response = await fetch(`${apiBaseUrl}${endpoint}`, {
            headers: {
                "x-system-key": systemKey,
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error(`Proxy error for ${endpoint}:`, error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    return getProxy(req, "/api/v2/states");
}

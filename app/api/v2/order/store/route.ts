import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000";
        const systemKey = process.env.API_SYSTEM_KEY || "";
        const authHeader = req.headers.get("authorization") || "";

        const response = await fetch(`${apiBaseUrl}/api/v2/order/store`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-system-key": systemKey,
                "Authorization": authHeader,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Order store proxy error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

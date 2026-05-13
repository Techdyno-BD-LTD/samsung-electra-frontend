import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

async function handleRequest(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    
    if (!path) {
      return NextResponse.json({ success: false, message: "Path is required" }, { status: 400 });
    }

    // Using the same env variables as other proxy routes
    const backendUrl = process.env.API_BASE_URL || "http://localhost:5000/api";
    const systemKey = process.env.API_SYSTEM_KEY || "b292a2c7d7ef4e7aab78f37849196364d961492455d5aa503549ac190ef83068";

    const url = `${backendUrl}/api/v2/${path}`;
    const method = req.method;
    
    let body: any = null;
    const contentTypeHeader = req.headers.get("content-type");

    if (method !== "GET") {
      if (contentTypeHeader?.includes("multipart/form-data")) {
        body = await req.formData();
      } else {
        const jsonBody = await req.json();
        body = JSON.stringify(jsonBody);
      }
    }

    const headers: Record<string, string> = {
      "x-system-key": systemKey,
    };

    if (contentTypeHeader && !contentTypeHeader.includes("multipart/form-data")) {
      headers["Content-Type"] = contentTypeHeader;
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
      cache: 'no-store'
    });

    const responseContentType = response.headers.get("content-type");
    if (responseContentType && responseContentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      console.error(`Non-JSON response from ${url}:`, text.substring(0, 500));
      return NextResponse.json({ success: false, message: "Backend communication error" }, { status: response.status });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

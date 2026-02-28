import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ token: "mock-token", expiresIn: 3600 });
}

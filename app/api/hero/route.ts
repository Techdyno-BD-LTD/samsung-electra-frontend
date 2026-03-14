import heroSectionData from "@/database/hero-section.json";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(heroSectionData);
}

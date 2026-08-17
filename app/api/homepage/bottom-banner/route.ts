import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type BottomBannerIcon = {
  photo: string;
  link: string | null;
};

type BottomBannerItem = {
  image: string | null;
  mobile_image?: string | null;
  mobile_link?: string | null;
  title: string | null;
  subtitle: string | null;
  icons: BottomBannerIcon[];
};

type BottomBannerResponse = {
  data: BottomBannerItem[];
  success: boolean;
  status: number;
};

export async function GET() {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;

  if (!baseUrl || !systemKey) {
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Missing API_BASE_URL or API_SYSTEM_KEY in frontend env.",
        data: [],
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${baseUrl}/api/v2/home-bottom-banner`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "x-system-key": systemKey,
      },
    });

    const payload = (await response.json()) as BottomBannerResponse;

    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Unable to reach backend bottom-banner API.",
        data: [],
      },
      { status: 500 }
    );
  }
}

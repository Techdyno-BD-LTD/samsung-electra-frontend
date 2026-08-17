import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type CategoryItem = {
  id: number;
  name: string;
  slug: string;
  image?: { url?: string | null };
};

type CategoriesApiResponse = {
  data: CategoryItem[];
  success: boolean;
  status: number;
};

export async function GET() {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;

  if (!baseUrl || !systemKey) {
    return NextResponse.json(
      {
        data: null,
        success: false,
        status: 500,
        message: "Missing API_BASE_URL or API_SYSTEM_KEY in frontend env.",
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${baseUrl}/api/v2/categories?limit=100`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "x-system-key": systemKey,
      },
    });

    const payload = (await response.json()) as CategoriesApiResponse;

    if (!response.ok) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          status: response.status,
          message: "Failed to fetch categories from backend.",
          backend: payload,
        },
        { status: response.status }
      );
    }

    const allCategories = payload.data || [];
    // Shuffle and pick 4-5 categories
    const shuffled = [...allCategories].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    return NextResponse.json({
      data: selected,
      success: true,
      status: 200
    }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        status: 500,
        message: "Unable to reach backend categories API.",
      },
      { status: 500 }
    );
  }
}

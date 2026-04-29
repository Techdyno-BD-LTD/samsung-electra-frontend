import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type BannerItem = {
	id: number;
	image: string;
	file_name: string;
	link: string | null;
	external_link: string | null;
};

type BannerApiResponse = {
	data: BannerItem[];
	success: boolean;
	status: number;
};

async function fetchBannerList(baseUrl: string, systemKey: string, path: string): Promise<BannerItem[]> {
	const response = await fetch(`${baseUrl}${path}`, {
		method: "GET",
		cache: "no-store",
		headers: {
			"x-system-key": systemKey,
		},
	});

	if (!response.ok) {
		return [];
	}

	const payload = (await response.json()) as BannerApiResponse;
	return Array.isArray(payload.data) ? payload.data : [];
}

export async function GET() {
	const baseUrl = process.env.API_BASE_URL;
	const systemKey = process.env.API_SYSTEM_KEY;

	if (!baseUrl || !systemKey) {
		return NextResponse.json(
			{
				success: false,
				status: 500,
				message: "Missing API_BASE_URL or API_SYSTEM_KEY in frontend env.",
				data: {
					bannersOne: [],
					bannersTwo: [],
					bannersThree: [],
				},
			},
			{ status: 500 }
		);
	}

	try {
		const [bannersOne, bannersTwo, bannersThree] = await Promise.all([
			fetchBannerList(baseUrl, systemKey, "/api/v2/banners-one"),
			fetchBannerList(baseUrl, systemKey, "/api/v2/banners-two"),
			fetchBannerList(baseUrl, systemKey, "/api/v2/banners-three"),
		]);

		return NextResponse.json(
			{
				success: true,
				status: 200,
				data: {
					bannersOne,
					bannersTwo,
					bannersThree,
				},
			},
			{ status: 200 }
		);
	} catch {
		return NextResponse.json(
			{
				success: false,
				status: 500,
				message: "Unable to reach backend banners APIs.",
				data: {
					bannersOne: [],
					bannersTwo: [],
					bannersThree: [],
				},
			},
			{ status: 500 }
		);
	}
}

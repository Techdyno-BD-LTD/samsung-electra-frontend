import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type BackendSlider = {
	id: number;
	image: string;
	file_name: string;
	external_link: string | null;
};

type BackendSliderResponse = {
	data: {
		text: string;
		sliders: BackendSlider[];
		sliders_mobile?: BackendSlider[];
	};
	success: boolean;
	status: number;
};

export async function GET() {
	const baseUrl = process.env.API_BASE_URL;
	const systemKey = process.env.API_SYSTEM_KEY;

	if (!baseUrl || !systemKey) {
		return NextResponse.json(
			{
				data: { text: "", sliders: [], sliders_mobile: [] },
				success: false,
				status: 500,
				message: "Missing API_BASE_URL or API_SYSTEM_KEY in frontend env.",
			},
			{ status: 500 }
		);
	}

	try {
		const response = await fetch(`${baseUrl}/api/v2/sliders`, {
			method: "GET",
			cache: "no-store",
			headers: {
				"x-system-key": systemKey,
			},
		});

		const payload = (await response.json()) as BackendSliderResponse;

		if (!response.ok) {
			return NextResponse.json(
				{
					data: { text: '', sliders: [], sliders_mobile: [] },
					success: false,
					status: response.status,
					message: "Failed to fetch sliders from backend.",
					backend: payload,
				},
				{ status: response.status }
			);
		}

		return NextResponse.json(payload, { status: 200 });
	} catch {
		return NextResponse.json(
			{
				data: { text: "", sliders: [], sliders_mobile: [] },
				success: false,
				status: 500,
				message: "Unable to reach backend sliders API.",
			},
			{ status: 500 }
		);
	}
}

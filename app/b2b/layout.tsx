import { Metadata } from 'next';

import { getGlobalSettings } from '@/lib/metadata';

interface GlobalSetting {
    type: string;
    value: string;
}

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    const systemKey = process.env.API_SYSTEM_KEY || '';

    try {
        const [pageRes, settings] = await Promise.all([
            fetch(`${baseUrl}/api/v2/pages/b2b`, {
                headers: { 'x-system-key': systemKey },
                next: { revalidate: 3600 }
            }),
            getGlobalSettings()
        ]);
        const json = await pageRes.json();
        const page = json.data?.[0];

        const findSetting = (type: string) => (settings as GlobalSetting[]).find((s) => s.type === type)?.value;
        const globalMetaImage = findSetting("meta_image");
        const siteTitle = findSetting("meta_title") || "Samsung Electra";

        const title = page?.meta_title || "B2B & Corporate Solutions";
        const description = page?.meta_description || "Connect with Samsung Electra for B2B solutions, corporate partnerships, and institutional sales in Bangladesh. Custom retail experiences for your business.";
        const image = page?.meta_image || globalMetaImage || "/og/b2b.png";
        const fullTitle = `${title} | ${siteTitle}`;

        return {
            title: fullTitle,
            description: description,
            openGraph: {
                title: fullTitle,
                description: description,
                images: [image],
            },
            twitter: {
                card: "summary_large_image",
                title: fullTitle,
                description: description,
                images: [image],
            }
        };
    } catch (e) {
        return {
            title: "B2B & Corporate Solutions | Samsung Electra",
            description: "Connect with Samsung Electra for B2B solutions, corporate partnerships, and institutional sales in Bangladesh. Custom retail experiences for your business.",
            openGraph: {
                title: "B2B & Corporate Solutions | Samsung Electra",
                description: "Connect with Samsung Electra for B2B solutions and corporate partnerships.",
                images: ["/og/b2b.png"],
            }
        };
    }
}

export default function B2BLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

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
            fetch(`${baseUrl}/api/v2/pages/frequently-asked-questions`, {
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

        const title = page?.meta_title || "FAQ";
        const description = page?.meta_description || "Find answers to frequently asked questions about Samsung Electra products, services, and policies.";
        const image = page?.meta_image || globalMetaImage || "/og/faq.png";
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
    } catch {
        return {
            title: "FAQ | Samsung Electra",
            description: "Find answers to frequently asked questions about Samsung Electra products, services, and policies.",
            openGraph: {
                title: "FAQ | Samsung Electra",
                description: "Find answers to frequently asked questions about Samsung Electra products, services, and policies.",
                images: ["/og/faq.png"],
            }
        };
    }
}

export default function FaqLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

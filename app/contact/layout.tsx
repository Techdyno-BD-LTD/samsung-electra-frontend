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
            fetch(`${baseUrl}/api/v2/pages/contact-us`, {
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

        const title = page?.meta_title || "Contact Us";
        const description = page?.meta_description || "Get in touch with Samsung Electra for support, inquiries, or feedback. We are here to help you with your connected retail needs.";
        const image = page?.meta_image || globalMetaImage || "/og/contact.png";
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
            title: "Contact Us | Samsung Electra",
            description: "Get in touch with Samsung Electra for support, inquiries, or feedback. We are here to help you with your connected retail needs.",
            openGraph: {
                title: "Contact Us | Samsung Electra",
                description: "Get in touch with Samsung Electra for support, inquiries, or feedback.",
                images: ["/og/contact.png"],
            }
        };
    }
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

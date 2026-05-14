import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteTitle = "Samsung Electra";
    return {
        title: `Careers | ${siteTitle}`,
        description: "Join the Samsung Electra team and build the future of connected retail in Bangladesh.",
        openGraph: {
            title: `Careers | ${siteTitle}`,
            description: "Join the Samsung Electra team and build the future of connected retail in Bangladesh.",
            images: ["/og/careers.png"],
        }
    };
}

export default function CareersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

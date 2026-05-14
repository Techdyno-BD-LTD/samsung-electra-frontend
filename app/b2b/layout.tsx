import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteTitle = "Samsung Electra";
    return {
        title: `B2B & Corporate Solutions | ${siteTitle}`,
        description: "Connect with Samsung Electra for B2B solutions, corporate partnerships, and institutional sales in Bangladesh. Custom retail experiences for your business.",
        openGraph: {
            title: `B2B & Corporate Solutions | ${siteTitle}`,
            description: "Connect with Samsung Electra for B2B solutions and corporate partnerships.",
            images: ["/og/b2b.png"],
        }
    };
}

export default function B2BLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

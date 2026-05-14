import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteTitle = "Samsung Electra";
    return {
        title: `FAQ | ${siteTitle}`,
        description: "Find answers to frequently asked questions about Samsung Electra products, services, and policies.",
        openGraph: {
            title: `FAQ | ${siteTitle}`,
            description: "Find answers to frequently asked questions about Samsung Electra products, services, and policies.",
            images: ["/og/faq.png"],
        }
    };
}

export default function FaqLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

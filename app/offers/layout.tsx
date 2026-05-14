import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteTitle = "Samsung Electra";
    return {
        title: `Offers & Flash Deals | ${siteTitle}`,
        description: "Don't miss out on our limited-time flash deals and special offers. Get premium Samsung products at discounted prices at Electra.",
        openGraph: {
            title: `Offers & Flash Deals | ${siteTitle}`,
            description: "Don't miss out on our limited-time flash deals and special offers.",
            images: ["/og/offers.png"],
        }
    };
}

export default function OffersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

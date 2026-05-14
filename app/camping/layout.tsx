import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteTitle = "Samsung Electra";
    return {
        title: `Camping Offers | ${siteTitle}`,
        description: "Explore exclusive camping offers and seasonal campaigns at Samsung Electra. Get the best deals on your favorite Samsung products.",
        openGraph: {
            title: `Camping Offers | ${siteTitle}`,
            description: "Explore exclusive camping offers and seasonal campaigns at Samsung Electra.",
            images: ["/og/campaign.png"],
        }
    };
}

export default function CampingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

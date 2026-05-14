import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteTitle = "Samsung Electra";
    return {
        title: `Shop by Brand | ${siteTitle}`,
        description: "Explore official Samsung products by category and brand. Find Televisions, Refrigerator, ACs, and more.",
        openGraph: {
            title: `Shop by Brand | ${siteTitle}`,
            description: "Explore official Samsung products by category and brand.",
            images: ["/og/shop.png"],
        }
    };
}

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

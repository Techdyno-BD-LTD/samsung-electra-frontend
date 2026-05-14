import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteTitle = "Samsung Electra";
    return {
        title: `All Categories | ${siteTitle}`,
        description: "Browse all Samsung product categories at Electra. Find refrigerators, TVs, ACs, washing machines, and more.",
        openGraph: {
            title: `All Categories | ${siteTitle}`,
            description: "Browse all Samsung product categories at Electra.",
            images: ["/og/categories.png"],
        }
    };
}

export default function MobileCategoriesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

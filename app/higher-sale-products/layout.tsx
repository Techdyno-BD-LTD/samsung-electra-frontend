import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteTitle = "Samsung Electra";
    return {
        title: `Higher Sale Products | ${siteTitle}`,
        description: "Browse our collection of products available with higher sale and flexible kisti (EMI) payment options. Shop Samsung TVs, Fridges, and more.",
        openGraph: {
            title: `Higher Sale Products | ${siteTitle}`,
            description: "Browse our collection of products available with higher sale and kisti payment options.",
            images: ["/og/higher-sale-products.png"],
        }
    };
}

export default function HigherSaleProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

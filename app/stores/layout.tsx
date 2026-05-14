import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteTitle = "Samsung Electra";
    return {
        title: `Store Locations | ${siteTitle}`,
        description: "Find your nearest Samsung Electra brand shop or service center in Bangladesh. Explore our extensive network of stores across all divisions.",
        openGraph: {
            title: `Store Locations | ${siteTitle}`,
            description: "Find your nearest Samsung Electra brand shop or service center in Bangladesh.",
            images: ["/og/stores.png"],
        }
    };
}

export default function StoresLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

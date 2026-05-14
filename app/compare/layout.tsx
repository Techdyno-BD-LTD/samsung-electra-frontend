import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Compare Products | Samsung Electra",
    description: "Compare features and specifications of different Samsung products to find the perfect one for your needs.",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

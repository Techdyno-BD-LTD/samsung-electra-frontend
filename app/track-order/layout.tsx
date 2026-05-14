import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteTitle = "Samsung Electra";
    return {
        title: `Track Your Order | ${siteTitle}`,
        description: "Track your Samsung Electra order in real-time. Enter your order ID and phone number to see the current status of your delivery.",
        openGraph: {
            title: `Track Your Order | ${siteTitle}`,
            description: "Track your Samsung Electra order in real-time.",
            images: ["/og/track-order.png"],
        }
    };
}

export default function TrackOrderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

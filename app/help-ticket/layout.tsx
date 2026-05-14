import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteTitle = "Samsung Electra";
    return {
        title: `Help Ticket | ${siteTitle}`,
        description: "Submit a help ticket to Samsung Electra for support with your orders, products, or any other inquiries. We are here to assist you.",
        openGraph: {
            title: `Help Ticket | ${siteTitle}`,
            description: "Submit a help ticket to Samsung Electra for support.",
            images: ["/og/help-ticket.png"],
        }
    };
}

export default function HelpTicketLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

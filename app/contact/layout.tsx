import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteTitle = "Samsung Electra";
    return {
        title: `Contact Us | ${siteTitle}`,
        description: "Get in touch with Samsung Electra for support, inquiries, or feedback. We are here to help you with your connected retail needs.",
        openGraph: {
            title: `Contact Us | ${siteTitle}`,
            description: "Get in touch with Samsung Electra for support, inquiries, or feedback.",
            images: ["/og/contact.png"],
        }
    };
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

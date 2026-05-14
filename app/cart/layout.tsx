import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Shopping Cart | Samsung Electra",
    description: "View and manage items in your shopping cart at Samsung Electra.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

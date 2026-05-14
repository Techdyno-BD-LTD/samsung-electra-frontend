import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Checkout | Samsung Electra",
    description: "Complete your purchase at Samsung Electra with our secure checkout process.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

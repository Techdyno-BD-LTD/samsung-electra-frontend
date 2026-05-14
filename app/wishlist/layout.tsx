import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "My Wishlist | Samsung Electra",
    description: "View and manage your favorite Samsung products in your wishlist.",
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import ProductCard from "@/components/common/ProductCard";

type WishlistProduct = {
  id: string;
  title: string;
  brand: string;
  image: string;
  price: string;
  originalPrice: string;
  discountPercent: string;
  saveAmount: string;
  color?: string;
  type?: string;
  weight?: string;
  rating?: number;
  ratingCount?: string;
  brandLogo?: string;
  emiPrice?: string;
  emiPercent?: string;
  tags?: string[];
};

export default function WishlistPage() {
  const wishlistItems = useAppSelector((state) => state.wishlist.items) as WishlistProduct[];

  return (
    <main className="mt-20 pb-10 sm:mt-24 sm:pb-14 lg:mt-16">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[12px] text-slate-500 sm:text-sm">
        <Link href="/" className="transition hover:text-slate-700">
          Home
        </Link>
        <span className="text-slate-400">›</span>
        <span className="font-medium text-slate-700">Wishlist</span>
      </nav>

      <section className="rounded-md bg-slate-100 px-4 py-4 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Product Wishlist</h1>
      </section>

      {wishlistItems.length === 0 ? (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <h2 className="text-xl font-semibold text-slate-800">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-slate-500">Click the heart icon on any product card to add it here.</p>
          <Link
            href="/shop"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[#1f74e8] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1666d4]"
          >
            Browse products
          </Link>
        </section>
      ) : (
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((item) => (
            <ProductCard
              key={item.id}
              title={item.title}
              slug={item.id}
              brand={item.brand}
              brandLogo={item.brandLogo}
              image={item.image}
              rating={item.rating ?? 0}
              ratingCount={item.ratingCount ?? "(0.0)"}
              type={item.type}
              weight={item.weight}
              color={item.color}
              price={item.price}
              originalPrice={item.originalPrice}
              discountPercent={item.discountPercent}
              saveAmount={item.saveAmount}
              emiPrice={item.emiPrice}
              emiPercent={item.emiPercent}
              tags={item.tags ?? ["Cash On Delivery", "0% EMI", "Free Delivery"]}
              isSale
            />
          ))}
        </section>
      )}
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import ProductCard from "@/components/common/ProductCard";

export default function WishlistPage() {
  const router = useRouter();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/wishlist");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

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
              type={item.type || item.category}
              weight={item.weight}
              color={item.color}
              price={String(item.price)}
              originalPrice={item.originalPrice ? String(item.originalPrice) : undefined}
              discountPercent={item.discountLabel}
              saveAmount={item.saveAmount ? String(item.saveAmount) : undefined}
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

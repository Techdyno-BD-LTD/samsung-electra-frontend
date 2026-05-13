"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  cover_image: string | null;
  parent_id: number;
};

type Brand = {
  id: number;
  name: string;
  slug: string;
  logo: string;
};

export default function MobileCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/brands")
        ]);

        const catData = await catRes.json();
        const brandData = await brandRes.json();

        if (catData.success && Array.isArray(catData.data)) {
          setCategories(catData.data.filter((c: Category) => c.parent_id === 0));
        }

        if (brandData.success && Array.isArray(brandData.data)) {
          setBrands(brandData.data.slice(0, 4)); // Show top 4 as prominent pills
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFB] mt-10 pb-24 md:hidden">
      {/* Search Header */}


      <div className="p-5">
        {/* Categories Section */}
        <section className="mb-10">
          <h2 className="mb-8 text-center text-[18px] font-bold text-slate-900 tracking-tight">Categories Product</h2>
          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center rounded-2xl border border-gray-50 bg-white p-3 shadow-sm transition-all active:scale-95 active:bg-gray-50"
                >
                  <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-gray-50/50">
                    <Image
                      src={cat.cover_image || cat.icon || "/assets/img/placeholder.jpg"}
                      alt={cat.name}
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <span className="text-center text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Brands Section */}
        <section className="mb-10">
          <h2 className="mb-8 text-center text-[18px] font-bold text-slate-900 tracking-tight">Brands</h2>
          <div className="grid grid-cols-2 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.slug}`}
                className="flex items-center justify-center rounded-full border border-gray-100 bg-white px-6 py-4 shadow-sm transition-all active:scale-95 hover:border-blue-200"
              >
                <div className="relative h-7 w-full max-w-[110px]">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Our Store Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E88E5] to-[#1565C0] p-5 text-white shadow-xl shadow-blue-500/20">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wide">Our Store</span>
              <div className="mt-1 h-0.5 w-8 bg-white/40" />
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-black backdrop-blur-sm">
              42+
            </div>

            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="opacity-90">Exclusive</span>
              <span className="text-white/40">/</span>
              <span className="opacity-90">Outlets</span>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-6 -bottom-6 h-20 w-20 rounded-full bg-blue-400/20 blur-2xl" />
        </div>
      </div>
    </div>
  );
}

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
  number_of_products?: number;
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
  const [activeTab, setActiveTab] = useState<"categories" | "brands">("categories");
  
  // Pagination states
  const [catPage, setCatPage] = useState(0);
  const [brandPage, setBrandPage] = useState(0);
  const itemsPerPage = 8;
  const brandsPerPage = 4;

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
          // Filter root categories
          setCategories(catData.data.filter((c: Category) => c.parent_id === 0));
        }

        if (brandData.success && Array.isArray(brandData.data)) {
          setBrands(brandData.data);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Pagination calculation
  const totalCatPages = Math.ceil(categories.length / itemsPerPage);
  const displayedCategories = categories.slice(catPage * itemsPerPage, (catPage + 1) * itemsPerPage);

  const totalBrandPages = Math.ceil(brands.length / brandsPerPage);
  const displayedBrands = brands.slice(brandPage * brandsPerPage, (brandPage + 1) * brandsPerPage);

  return (
    <div className="min-h-screen bg-white mt-12 pb-24 md:hidden px-4">
      {/* Tab bar header */}
      <div className="flex justify-center pt-6 pb-2">
        <div className="flex border border-slate-200 rounded-full p-1 bg-white shadow-sm w-full max-w-[320px]">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
              activeTab === "categories"
                ? "bg-[#2563EB] text-white"
                : "bg-white text-slate-700"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("brands")}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
              activeTab === "brands"
                ? "bg-[#2563EB] text-white"
                : "bg-white text-slate-700"
            }`}
          >
            Brands
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      ) : activeTab === "categories" ? (
        /* Categories View */
        <div className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            {displayedCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center rounded-2xl bg-[#F0F5FF] p-4 border border-slate-50 transition-all active:scale-95 shadow-sm"
              >
                <div className="relative mb-3 h-24 w-full overflow-hidden rounded-xl">
                  <Image
                    src={cat.cover_image || cat.icon || "/assets/img/placeholder.jpg"}
                    alt={cat.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-center text-[13px] font-bold text-slate-800 leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Categories Pagination Dots */}
          {totalCatPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: totalCatPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCatPage(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    catPage === idx ? "bg-blue-600 w-5" : "bg-slate-350"
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Brands View */
        <div className="pt-6">
          <h2 className="text-xl font-medium text-slate-800 text-center mb-8">
            Search By Brands
          </h2>

          <div className="flex flex-col items-center gap-6">
            {displayedBrands.map((brand, idx) => {
              // Emulate the active/highlighted style for Samsung in the mockup
              const isSamsung = brand.name.toLowerCase() === "samsung";
              
              return (
                <Link
                  key={brand.id}
                  href={`/brand/${brand.slug}`}
                  className={`flex items-center justify-center rounded-2xl border px-6 py-4 w-full max-w-[240px] h-[68px] transition-all active:scale-95 ${
                    isSamsung
                      ? "bg-[#2563EB] border-[#2563EB] text-white shadow-lg"
                      : "bg-white border-slate-200 text-slate-800 shadow-sm"
                  }`}
                >
                  <div className="relative h-8 w-full max-w-[140px]">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className={`object-contain ${isSamsung ? "brightness-0 invert" : ""}`}
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Brands Pagination Dots */}
          {totalBrandPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: totalBrandPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setBrandPage(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    brandPage === idx ? "bg-blue-600 w-5" : "bg-slate-350"
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

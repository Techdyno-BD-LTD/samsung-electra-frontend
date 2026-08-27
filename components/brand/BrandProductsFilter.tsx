"use client";

import { useState } from "react";
import BrandProductCarouselSection from "./BrandProductCarouselSection";

type CategoryProduct = {
  id: number;
  name: string;
  slug: string;
  category: {
    name: string;
    slug: string;
  } | null;
  [key: string]: unknown;
};

type BrandSection = {
  id: string;
  title: string;
  tabLabel: string;
  products: CategoryProduct[];
};

type BrandProductsFilterProps = {
  categoryList: BrandSection[];
  brandName: string;
};

export default function BrandProductsFilter({
  categoryList,
  brandName,
}: BrandProductsFilterProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");

  const filteredCategories =
    selectedCategoryId === "all"
      ? categoryList
      : categoryList.filter((cat) => cat.id === selectedCategoryId);

  return (
    <>
      {categoryList.length > 0 && (
        <section className="mx-auto w-full max-w-[1840px] px-4 pb-5 md:px-8">
          {/* Horizontal scroll on mobile, flex-wrap centered on desktop */}
          <div className="flex items-center justify-start md:justify-center gap-3 border-b border-gray-300 pb-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-nowrap md:flex-wrap">
            {/* "All" Button */}
            <button
              onClick={() => setSelectedCategoryId("all")}
              className={`min-w-[100px] md:min-w-[152px] rounded-full border px-5 py-1.5 text-center text-sm md:text-[15px] font-medium transition-all duration-200 flex-shrink-0 ${
                selectedCategoryId === "all"
                  ? "border-black bg-black text-white shadow-md scale-[1.02]"
                  : "border-gray-300 bg-white text-gray-700 hover:border-[#215A9B] hover:text-[#215A9B]"
              }`}
            >
              All
            </button>

            {/* Category Buttons */}
            {categoryList.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`min-w-[120px] md:min-w-[152px] rounded-full border px-5 py-1.5 text-center text-sm md:text-[15px] font-medium transition-all duration-200 flex-shrink-0 ${
                  selectedCategoryId === category.id
                    ? "border-black bg-black text-white shadow-md scale-[1.02]"
                    : "border-gray-300 bg-white text-gray-700 hover:border-[#215A9B] hover:text-[#215A9B]"
                }`}
              >
                {category.tabLabel}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Product Sections */}
      <div className="pb-12 transition-all duration-300">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            <BrandProductCarouselSection
              id={category.id}
              title={category.title}
              products={category.products}
              seeMoreHref={`/products?brand=${encodeURIComponent(brandName)}`}
            />
          </div>
        ))}
      </div>
    </>
  );
}

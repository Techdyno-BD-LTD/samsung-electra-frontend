"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import brands from "@/database/brands.json";

type BrandCategory = {
  id: number;
  name: string;
  categoryLogo: string;
  image: string;
};

type BrandTab = {
  id: number;
  name: string;
  tabLogo: string;
  categories: BrandCategory[];
};

export default function OurBrands() {
  const brandTabs = brands as BrandTab[];
  const [activeBrandId, setActiveBrandId] = useState<number>(brandTabs[0]?.id ?? 1);

  const activeBrand = useMemo(
    () => brandTabs.find((brand) => brand.id === activeBrandId) ?? brandTabs[0],
    [activeBrandId, brandTabs]
  );

  if (!activeBrand) {
    return null;
  }

  return (
    <section className="mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-[2.1rem]">Our Brands</h2>
        <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-transparent via-[#2F73BD]/70 to-transparent" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {brandTabs.map((brand) => {
          const isActive = brand.id === activeBrandId;
          return (
            <button
              key={brand.id}
              type="button"
              onClick={() => setActiveBrandId(brand.id)}
              className={`group border border-slate-200 px-2 py-4 text-center transition-all duration-200 ${
                isActive ? "bg-[#f3f3f3]" : "bg-white"
              }`}
              aria-label={`Show ${brand.name} categories`}
              aria-pressed={isActive}
            >
              <div className="relative mx-auto h-10 w-full max-w-[180px] sm:h-12">
                <Image
                  src={brand.tabLogo}
                  alt={`${brand.name} logo`}
                  fill
                  sizes="(max-width: 640px) 120px, 170px"
                  className={`object-contain transition-all duration-200 ${
                    isActive ? "opacity-100" : "opacity-90 group-hover:opacity-100"
                  }`}
                />
              </div>
              <div
                className={`mt-3 h-[3px] w-full transition-colors duration-200 ${
                  isActive ? "bg-[#2F73BD]" : "bg-[#2F73BD]/45 group-hover:bg-[#2F73BD]/70"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-0 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
        {activeBrand.categories.slice(0, 4).map((category) => (
          <article
            key={`${activeBrand.id}-${category.id}`}
            className="border border-slate-200  px-4 pb-3 pt-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2F73BD]/30 hover:shadow-md"
          >
            <div className="relative mx-auto h-7 w-full max-w-[130px]">
              <Image
                src={category.categoryLogo}
                alt={`${activeBrand.name} category logo`}
                fill
                sizes="130px"
                className="object-contain"
              />
            </div>

            <div className="relative mx-auto mt-5 h-[200px] w-full max-w-[320px] sm:h-[260px]">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="210px"
                className="object-contain"
              />
            </div>

            <h3 className="mt-5 text-center text-base font-medium text-slate-900">
              {category.name}
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
}

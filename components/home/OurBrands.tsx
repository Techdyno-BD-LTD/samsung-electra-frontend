"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Skeleton from "@/components/common/Skeleton";

type Category = {
  id: number;
  name: string;
  slug: string;
  banner: string;
  icon: string;
  cover_image: string;
  parent_id: number;
};

type Brand = {
  id: number;
  name: string;
  slug: string;
  logo: string;
};

type BrandSection = {
  row_index: number;
  brand: Brand;
  selected_categories: Category[];
};

export default function OurBrands() {
  const [brandSections, setBrandSections] = useState<BrandSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Our Brands");
  const [activeRowIndex, setActiveRowIndex] = useState<number>(0);

  useEffect(() => {
    async function fetchBrandSections() {
      try {
        const res = await fetch("/api/brands/section");
        const data = await res.json();
        if (data?.success && Array.isArray(data?.data)) {
          setBrandSections(data.data);
          setTitle(data.title || "Our Brands");
          if (data.data.length > 0) {
            setActiveRowIndex(data.data[0].row_index);
          }
        }
      } catch (error) {
        console.error("Error fetching brand sections:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBrandSections();
  }, []);

  const activeSection = useMemo(
    () => brandSections.find((section) => section.row_index === activeRowIndex) || brandSections[0],
    [activeRowIndex, brandSections]
  );

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-10">
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!activeSection) {
    return null;
  }

  return (
    <section className="mx-auto">
      <div className="text-center">
        <h2 className="text-[18px] font-semibold text-slate-900 sm:text-[2.1rem]">{title}</h2>
        <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-transparent via-[#2F73BD]/70 to-transparent" />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-4 sm:gap-3">
        {brandSections.map((section) => {
          const isActive = section.row_index === activeRowIndex;
          return (
            <button
              key={section.row_index}
              type="button"
              onClick={() => setActiveRowIndex(section.row_index)}
              className={`group border border-slate-200 px-2 py-1 text-center transition-all duration-200 ${
                isActive ? "bg-[#f3f3f3]" : "bg-white"
              }`}
              aria-label={`Show ${section.brand.name} categories`}
              aria-pressed={isActive}
            >
              <div className="relative mx-auto h-10 w-full max-w-[180px] sm:h-12">
                <Image
                  src={section.brand.logo}
                  alt={`${section.brand.name} logo`}
                  fill
                  sizes="(max-width: 640px) 120px, 170px"
                  className={`object-contain transition-all duration-200 ${
                    isActive ? "opacity-100" : "opacity-90 group-hover:opacity-100"
                  }`}
                />
              </div>
              <div
                className={`mt-1 h-[3px] w-full transition-colors duration-200 ${
                  isActive ? "bg-[#2F73BD]" : "bg-[#2F73BD]/45 group-hover:bg-[#2F73BD]/70"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-0 grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
        {activeSection.selected_categories.slice(0, 4).map((category) => (
          <article
            key={`${activeSection.row_index}-${category.id}`}
            className="border border-slate-200  px-4 pb-3 pt-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2F73BD]/30 hover:shadow-md"
          >
            <div className="relative mx-auto h-7 w-full max-w-[130px]">
              <Image
                src={activeSection.brand.logo}
                alt={`${activeSection.brand.name} category logo`}
                fill
                sizes="130px"
                className="object-contain"
              />
            </div>

            <div className="relative mx-auto mt-5 h-[200px] w-full max-w-[320px] sm:h-[260px]">
              <Image
                src={category.cover_image || "/assets/img/placeholder.jpg"}
                alt={category.name}
                fill
                sizes="210px"
                className="object-contain"
              />
            </div>

            <h3 className="mt-5 text-center text-[12px] xl:text-base font-medium text-slate-900">
              {category.name}
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
}

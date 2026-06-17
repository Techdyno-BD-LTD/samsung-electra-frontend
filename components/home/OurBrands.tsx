"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    const tolerance = 2;
    setCanScrollLeft(slider.scrollLeft > tolerance);
    setCanScrollRight(slider.scrollLeft < slider.scrollWidth - slider.clientWidth - tolerance);
  };

  const scrollByOneCard = (direction: 1 | -1) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const firstCard = slider.querySelector("[data-brand-category-card]") as HTMLDivElement | null;
    if (!firstCard) return;

    const sliderStyles = window.getComputedStyle(slider);
    const gap = parseFloat(sliderStyles.columnGap || sliderStyles.gap || "0") || 0;
    const shift = firstCard.offsetWidth + gap;

    slider.scrollBy({
      left: shift * direction,
      behavior: "smooth",
    });
  };

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

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const onScroll = () => updateScrollState();
    const onResize = () => updateScrollState();

    slider.scrollLeft = 0;
    updateScrollState();
    slider.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    return () => {
      slider.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [activeSection, activeSection?.selected_categories?.length]);

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

  const hasMultipleCategories = activeSection.selected_categories.length > 2;

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

      {/* Desktop categories grid (exactly as it was) */}
      <div className="mt-4 hidden sm:grid grid-cols-2 gap-3 xl:grid-cols-4">
        {activeSection.selected_categories.slice(0, 4).map((category) => (
          <Link
            key={`${activeSection.row_index}-${category.id}-desktop`}
            href={`/category/${category.slug}?brands=${activeSection.brand.slug}`}
            className="block border border-slate-200 bg-white px-4 pb-3 pt-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2F73BD]/30 hover:shadow-md"
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
          </Link>
        ))}
      </div>

      {/* Mobile view */}
      {hasMultipleCategories ? (
        <div className="relative mt-4 block sm:hidden">
          <button
            type="button"
            onClick={() => scrollByOneCard(-1)}
            disabled={!canScrollLeft}
            aria-label="Previous categories"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300"
          >
            <FaChevronLeft className="h-3 w-3" />
          </button>

          <button
            type="button"
            onClick={() => scrollByOneCard(1)}
            disabled={!canScrollRight}
            aria-label="Next categories"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300"
          >
            <FaChevronRight className="h-3 w-3" />
          </button>

          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {activeSection.selected_categories.map((category) => (
              <Link
                key={`${activeSection.row_index}-${category.id}-slider`}
                href={`/category/${category.slug}?brands=${activeSection.brand.slug}`}
                data-brand-category-card
                className="min-w-[70%] snap-start block border border-slate-200 bg-white px-4 pb-3 pt-6 shadow-sm transition-all duration-200 hover:border-[#2F73BD]/30 hover:shadow-md"
              >
                <div className="relative mx-auto h-6 w-full max-w-[100px]">
                  <Image
                    src={activeSection.brand.logo}
                    alt={`${activeSection.brand.name} category logo`}
                    fill
                    sizes="100px"
                    className="object-contain"
                  />
                </div>

                <div className="relative mx-auto mt-4 h-[160px] w-full max-w-[240px]">
                  <Image
                    src={category.cover_image || "/assets/img/placeholder.jpg"}
                    alt={category.name}
                    fill
                    sizes="180px"
                    className="object-contain"
                  />
                </div>

                <h3 className="mt-4 text-center text-[12px] font-medium text-slate-900">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2 block sm:hidden">
          {activeSection.selected_categories.map((category) => (
            <Link
              key={`${activeSection.row_index}-${category.id}-grid-mobile`}
              href={`/category/${category.slug}?brands=${activeSection.brand.slug}`}
              className="block border border-slate-200 bg-white px-4 pb-3 pt-6 shadow-sm transition-all duration-200 hover:border-[#2F73BD]/30 hover:shadow-md"
            >
              <div className="relative mx-auto h-6 w-full max-w-[100px]">
                <Image
                  src={activeSection.brand.logo}
                  alt={`${activeSection.brand.name} category logo`}
                  fill
                  sizes="100px"
                  className="object-contain"
                />
              </div>

              <div className="relative mx-auto mt-4 h-[160px] w-full max-w-[240px]">
                <Image
                  src={category.cover_image || "/assets/img/placeholder.jpg"}
                  alt={category.name}
                  fill
                  sizes="180px"
                  className="object-contain"
                />
              </div>

              <h3 className="mt-4 text-center text-[12px] font-medium text-slate-900">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

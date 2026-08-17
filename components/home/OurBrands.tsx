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
  const [subtitle, setSubtitle] = useState("There are many variations of Home Appliances");
  const [activeRowIndex, setActiveRowIndex] = useState<number>(0);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    const tolerance = 5;
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
          setSubtitle(data.subtitle || "There are many variations of Home Appliances");
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

    // Initial check after rendering categories
    setTimeout(updateScrollState, 100);

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

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 pt-0 pb-8 select-none">
      {/* Title & Subtitle */}
      <div className="text-center flex flex-col items-center justify-center mb-4">
        <h2 className="text-xl lg:text-[32px] 2xl:text-[48px] font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
        <p className="text-sm lg:text-[16px]  2xl:text-[20px] max-w-[900px] md:text-base text-gray-900 mt-2">
          {subtitle}
        </p>
      </div>

      {/* Brand Tabs */}
      <div className="flex justify-center border-b border-gray-100 max-w-[1550px] mx-auto mb-4">
        <div 
          className="grid w-full" 
          style={{ gridTemplateColumns: `repeat(${brandSections.length}, minmax(0, 1fr))` }}
        >
          {brandSections.map((section) => {
            const isActive = section.row_index === activeRowIndex;
            return (
              <button
                key={section.row_index}
                type="button"
                onClick={() => setActiveRowIndex(section.row_index)}
                className={`lg:py-3.5 flex flex-col items-center justify-center transition-all duration-300 border-b-[10px] ${
                  isActive ? "border-blue-600 bg-white" : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
                aria-label={`Show ${section.brand.name} categories`}
                aria-pressed={isActive}
              >
                <div className="relative h-12 w-24 lg:w-72 2xl:w-96">
                  <Image
                    src={section.brand.logo}
                    alt={`${section.brand.name} logo`}
                    fill
                    sizes="180px"
                    className="object-contain"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Choose Category Header */}
      <div className="text-center mb-1 lg:mb-3">
        <h3 className="text-xl lg:text-[28px] py-1 lg:py-3 font-medium text-gray-800 tracking-normal">Choose Category</h3>
      </div>

      {/* Sliding Categories Wrapper (Desktop & Mobile) */}
      <div className="relative max-w-[1550px] mx-auto px-4 md:px-0">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollByOneCard(-1)}
            aria-label="Previous categories"
            className="absolute left-0 md:-left-20 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 lg:h-16 lg:w-16 items-center justify-center rounded-full border border-gray-100 bg-[#F1F2F2] shadow-md transition-all hover:bg-gray-50 text-gray-600"
          >
            <FaChevronLeft className="h-4 w-4 lg:h-6 lg:w-6" />
          </button>
        )}

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollByOneCard(1)}
            aria-label="Next categories"
            className="absolute right-0 md:-right-20 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 lg:h-16 lg:w-16 items-center justify-center rounded-full border border-gray-100 bg-[#F1F2F2] shadow-md transition-all hover:bg-gray-50 text-gray-600"
          >
            <FaChevronRight className="h-4 w-4 lg:h-6 lg:w-6" />
          </button>
        )}

        {/* Categories Horizontal Scroll viewport */}
        <div
          ref={sliderRef}
          onScroll={updateScrollState}
          className="flex overflow-x-auto scroll-smooth gap-3 sm:gap-6 py-4 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {activeSection.selected_categories.map((category) => (
            <Link
              key={`${activeSection.row_index}-${category.id}-card`}
              href={`/category/${category.slug}?brands=${activeSection.brand.slug}`}
              data-brand-category-card
              className="group flex-shrink-0 w-[calc(50%-6px)] sm:w-[295px] block rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Top blue-grey category block */}
              <div className="relative bg-[#F1F6FD] w-full h-[180px] sm:h-[350px] px-3 sm:px-4 flex flex-col justify-end pb-3 sm:pb-4">
                {/* Brand Logo Top-Center */}
                <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 h-5 w-24 sm:h-10 sm:w-40 flex items-center justify-center text-center">
                  <Image
                    src={activeSection.brand.logo}
                    alt={activeSection.brand.name}
                    fill
                    sizes="80px"
                    className="object-contain object-center"
                  />
                </div>

                {/* Wishlist Heart Icon Top-Right */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white rounded-full p-1 sm:p-1.5 shadow-sm text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>

                {/* Share Icon below Heart */}
                <div className="absolute top-9 sm:top-11 right-3 sm:right-4 bg-white rounded-full p-1 sm:p-1.5 shadow-sm text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185zm0-10.628a2.25 2.25 0 103.933-2.186 2.25 2.25 0 00-3.933 2.186z"/>
                  </svg>
                </div>

                {/* Cover Image */}
                <div className="relative mx-auto h-[110px] sm:h-[220px] w-full max-w-[120px] sm:max-w-[230px]">
                  <Image
                    src={category.cover_image || "/assets/img/placeholder.jpg"}
                    alt={category.name}
                    fill
                    sizes="230px"
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Bottom white section */}
              <div className="bg-white py-4 sm:py-8 px-2 sm:px-4 flex flex-col items-center">
                <h3 className="text-center text-xs sm:text-sm lg:text-[24px] font-medium tracking-wide text-[#6D6E71] mb-2 sm:mb-3 line-clamp-1">
                  {category.name}
                </h3>
                <span className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white px-5 py-1.5 sm:px-10 sm:py-2 rounded-lg text-[10px] sm:text-xs mt-2 sm:mt-5 lg:text-lg font-semibold hover:bg-blue-700 transition-colors">
                  See More
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

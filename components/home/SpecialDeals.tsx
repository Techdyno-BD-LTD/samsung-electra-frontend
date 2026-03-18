"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/common/ProductCard";
import flashDealsData from "@/database/flashdeals.json";

type SpecialDealProduct = {
  id: number;
  brand?: string;
  brandLogo?: string;
  title?: string;
  image?: string;
  dealLabel?: string;
  quickDetailsLabel?: string;
  type?: string;
  countdown: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  price?: string;
  originalPrice?: string;
  saveAmount?: string;
  discountPercent?: string;
};

type SpecialDeals = {
  title: string;
  specialLabel: string;
  allDealsLabel: string;
  allDealsHref: string;
  countdown: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  products: SpecialDealProduct[];
};

const data = flashDealsData.specialDeals as SpecialDeals;

export default function SpecialDeals() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    const tolerance = 2;
    setCanScrollLeft(slider.scrollLeft > tolerance);
    setCanScrollRight(
      slider.scrollLeft < slider.scrollWidth - slider.clientWidth - tolerance
    );
  };

  const scrollByOneCard = (direction: 1 | -1) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const firstCard = slider.querySelector("[data-special-card]") as HTMLDivElement | null;
    if (!firstCard) return;
    const sliderStyles = window.getComputedStyle(slider);
    const gap = Number.parseFloat(sliderStyles.columnGap || sliderStyles.gap || "0") || 0;
    const shift = firstCard.offsetWidth + gap;
    slider.scrollBy({ left: shift * direction, behavior: "smooth" });
  };

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
  }, []);

  return (
    <section className="mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h2 className="text-[18px] font-semibold text-slate-900 sm:text-[2.1rem]">
            {data.title}
          </h2>
          <span className="text-slate-300">|</span>
          <p className="text-xl font-medium text-[#1B57A6] sm:text-[2rem]">
            {data.specialLabel}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-end gap-1.5 mr-4 text-[#1B57A6] sm:gap-2">
            <div className="text-center">
              <p className="text-xl font-semibold leading-none sm:text-[42px]">
                {data.countdown.days}
              </p>
              <p className="mt-1 text-xs text-[#6b93cd]">Days</p>
            </div>
            <span className="pb-5 text-2xl">:</span>
            <div className="text-center">
              <p className="text-xl font-semibold leading-none sm:text-[42px]">
                {data.countdown.hours}
              </p>
              <p className="mt-1 text-xs text-[#6b93cd]">Hour</p>
            </div>
            <span className="pb-5 text-2xl">:</span>
            <div className="text-center">
              <p className="text-xl font-semibold leading-none sm:text-[42px]">
                {data.countdown.minutes}
              </p>
              <p className="mt-1 text-xs text-[#6b93cd]">Minute</p>
            </div>
            <span className="pb-5 text-2xl">:</span>
            <div className="text-center">
              <p className="text-xl font-semibold leading-none sm:text-[42px]">
                {data.countdown.seconds}
              </p>
              <p className="mt-1 text-xs text-[#6b93cd]">Second</p>
            </div>
          </div>

          <Link
            href={data.allDealsHref}
            className="inline-flex items-center gap-2 rounded-md border border-[#89a8d6] px-4 py-2 text-lg font-medium text-[#1B57A6] transition hover:bg-[#f4f8ff] sm:text-2xl"
          >
            {data.allDealsLabel}
            <span aria-hidden>›</span>
          </Link>
        </div>
      </div>

      <div className="mt-3 h-[2px] w-[260px] bg-gradient-to-r from-[#2F73BD] via-[#2F73BD]/50 to-transparent sm:w-[380px]" />

      {/* Slider */}
      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByOneCard(-1)}
          disabled={!canScrollLeft}
          aria-label="Show previous special deals"
          className="absolute left-2 top-[240px] z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:left-0 sm:h-11 sm:w-11 sm:-translate-x-1/2 sm:top-[280px]"
        >
          <FaChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <button
          type="button"
          onClick={() => scrollByOneCard(1)}
          disabled={!canScrollRight}
          aria-label="Show next special deals"
          className="absolute right-2 top-[240px] z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:right-0 sm:h-11 sm:w-11 sm:translate-x-1/2 sm:top-[280px]"
        >
          <FaChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {data.products.map((product) => (
            <div
              key={product.id}
              data-special-card
              className="min-w-[88%] snap-start sm:min-w-[48%] lg:min-w-[32%]"
            >
              <ProductCard
                cardVariant="specialDeal"
                brand={product.brand}
                brandLogo={product.brandLogo}
                title={product.title}
                image={product.image}
                type={product.type}
                dealLabel={product.dealLabel}
                quickDetailsLabel={product.quickDetailsLabel}
                dealDays={product.countdown.days}
                dealHours={product.countdown.hours}
                dealMinutes={product.countdown.minutes}
                dealSeconds={product.countdown.seconds}
                price={product.price}
                originalPrice={product.originalPrice}
                saveAmount={product.saveAmount}
                discountPercent={product.discountPercent}
                dealImageHeight="260px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

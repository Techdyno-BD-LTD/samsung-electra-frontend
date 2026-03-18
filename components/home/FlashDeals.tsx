"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaRegClock } from "react-icons/fa";
import ProductCard from "@/components/common/ProductCard";
import flashDealsData from "@/database/flashdeals.json";

type DealCountdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

type FlashDealProduct = {
  id: number;
  brand?: string;
  brandLogo?: string;
  title?: string;
  image?: string;
  dealLabel?: string;
  stockLabel?: string;
  quickDetailsLabel?: string;
  countdown: DealCountdown;
  bids?: string;
  views?: string;
  startingFrom?: string;
  bidButtonLabel?: string;
};

type FlashDeal = {
  id: string;
  name: string;
  isActive?: boolean;
  countdown: DealCountdown;
  products: FlashDealProduct[];
};

export default function FlashDeals() {
  const deals = flashDealsData.deals as FlashDeal[];
  const initialDeal = deals.find((deal) => deal.isActive) ?? deals[0];

  const [activeDealId] = useState(initialDeal?.id ?? "");
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const activeDeal = useMemo(
    () => deals.find((deal) => deal.id === activeDealId) ?? deals[0],
    [activeDealId, deals]
  );

  const updateScrollState = () => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    const tolerance = 2;
    setCanScrollLeft(slider.scrollLeft > tolerance);
    setCanScrollRight(slider.scrollLeft < slider.scrollWidth - slider.clientWidth - tolerance);
  };

  const scrollByOneCard = (direction: 1 | -1) => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    const firstCard = slider.querySelector("[data-flash-card]") as HTMLDivElement | null;
    if (!firstCard) {
      return;
    }

    const sliderStyles = window.getComputedStyle(slider);
    const gap = Number.parseFloat(sliderStyles.columnGap || sliderStyles.gap || "0") || 0;
    const shift = firstCard.offsetWidth + gap;

    slider.scrollBy({
      left: shift * direction,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

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
  }, [activeDealId]);

  if (!activeDeal) {
    return null;
  }

  return (
    <section className="mx-auto space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h2 className="text-[18px] font-semibold text-slate-900 sm:text-[2.1rem]">{flashDealsData.title}</h2>
          
          <span className="text-slate-300">|</span>
          <p className="flex items-center gap-2 text-xl font-base text-[#1B57A6] sm:text-[2rem]">
            <FaRegClock className="h-5 w-5 sm:h-6 sm:w-6" />
            {flashDealsData.contestLabel}
          </p>
        </div>
        

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* {deals.length > 1 && (
            <div className="flex items-center gap-2 rounded-full border border-[#d6e1f1] bg-white px-2 py-1">
              {deals.map((deal) => (
                <button
                  key={deal.id}
                  type="button"
                  onClick={() => setActiveDealId(deal.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition sm:text-sm ${
                    deal.id === activeDeal.id
                      ? "bg-[#1B57A6] text-white"
                      : "text-[#1B57A6] hover:bg-[#eef4fc]"
                  }`}
                >
                  {deal.name}
                </button>
              ))}
            </div>
          )} */}

          <div className="flex items-end gap-1.5 mr-10 text-[#1B57A6] sm:gap-2">
            <div className="text-center">
              <p className="text-xl font-semibold leading-none sm:text-[42px]">{activeDeal.countdown.days}</p>
              <p className="mt-1 text-xs text-[#6b93cd]">Days</p>
            </div>
            <span className="pb-5 text-2xl">:</span>
            <div className="text-center">
              <p className="text-xl font-semibold leading-none sm:text-[42px]">{activeDeal.countdown.hours}</p>
              <p className="mt-1 text-xs text-[#6b93cd]">Hour</p>
            </div>
            <span className="pb-5 text-2xl">:</span>
            <div className="text-center">
              <p className="text-xl font-semibold leading-none sm:text-[42px]">{activeDeal.countdown.minutes}</p>
              <p className="mt-1 text-xs text-[#6b93cd]">Minute</p>
            </div>
            <span className="pb-5 text-2xl">:</span>
            <div className="text-center">
              <p className="text-xl font-semibold leading-none sm:text-[42px]">{activeDeal.countdown.seconds}</p>
              <p className="mt-1 text-xs text-[#6b93cd]">Second</p>
            </div>
          </div>

          <Link
            href={flashDealsData.allDealsHref}
            className="inline-flex items-center gap-2 rounded-md border border-[#89a8d6] px-4 py-2 text-lg font-medium text-[#1B57A6] transition hover:bg-[#f4f8ff] sm:text-2xl"
          >
            {flashDealsData.allDealsLabel}
            <span aria-hidden>›</span>
          </Link>
        </div>
      </div>
      <div className="mt-3 h-[2px] w-[260px] bg-gradient-to-r from-[#2F73BD] via-[#2F73BD]/50 to-transparent sm:w-[380px]" />

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByOneCard(-1)}
          disabled={!canScrollLeft}
          aria-label="Show previous flash deal products"
          className="absolute left-2 top-[210px] z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:left-0 sm:h-11 sm:w-11 sm:-translate-x-1/2 sm:top-[245px]"
        >
          <FaChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <button
          type="button"
          onClick={() => scrollByOneCard(1)}
          disabled={!canScrollRight}
          aria-label="Show next flash deal products"
          className="absolute right-2 top-[210px] z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:right-0 sm:h-11 sm:w-11 sm:translate-x-1/2 sm:top-[245px]"
        >
          <FaChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {activeDeal.products.map((product) => (
            <div
              key={`${activeDeal.id}-${product.id}`}
              data-flash-card
              className="min-w-[88%] snap-start sm:min-w-[48%] lg:min-w-[31.5%] xl:min-w-[24%] 2xl:min-w-[19%]"
            >
              <ProductCard
                cardVariant="flashDeal"
                brand={product.brand}
                brandLogo={product.brandLogo}
                title={product.title}
                image={product.image}
                dealLabel={product.dealLabel}
                stockLabel={product.stockLabel}
                quickDetailsLabel={product.quickDetailsLabel}
                dealDays={product.countdown.days}
                dealHours={product.countdown.hours}
                dealMinutes={product.countdown.minutes}
                dealSeconds={product.countdown.seconds}
                bidsCount={product.bids}
                viewsCount={product.views}
                startingFrom={product.startingFrom}
                bidButtonLabel={product.bidButtonLabel}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

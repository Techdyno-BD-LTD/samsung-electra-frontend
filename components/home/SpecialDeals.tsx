"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/common/ProductCard";
import { formatCurrency } from "@/lib/currencyUtils";
import Skeleton from "@/components/common/Skeleton";

type FlashDealListItem = {
  id: number;
  slug: string;
  homepage: number;
};

type FlashDealProductDetails = {
  id: number;
  name: string;
  slug: string;
  thumbnail_image: string;
  unit_price: number;
  brand?: {
    id: number;
    name: string;
    logo: string;
  };
  category?: {
    id: number;
    name: string;
  };
  stroked_price?: string;
  main_price?: string;
  discount?: string;
  discount_type?: string;
};

type FlashDealProduct = {
  product_id: number;
  discount: number;
  discount_type: string;
  product: FlashDealProductDetails;
};

type FlashDeal = {
  id: number;
  title: string;
  subtitle: string | null;
  slug: string;
  banner: string;
  start_date: number;
  end_date: number;
  banner_subtitle_top?: string;
  products?: FlashDealProduct[];
};

export default function SpecialDeals() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [flashDeal, setFlashDeal] = useState<FlashDeal | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [loading, setLoading] = useState(true);

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
    async function fetchDeal() {
      try {
        const listRes = await fetch("/api/flash-deals");
        const listJson = await listRes.json();
        if (listJson.success && listJson.data?.length > 0) {
          const homepageDeal = listJson.data.find((d: FlashDealListItem) => d.homepage === 1);
          if (homepageDeal) {
            const detailRes = await fetch(`/api/flash-deals/details/${homepageDeal.slug}`);
            const detailJson = await detailRes.json();
            if (detailJson.success && detailJson.data?.length > 0) {
              setFlashDeal(detailJson.data[0]);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeal();
  }, []);

  useEffect(() => {
    if (!flashDeal?.end_date) return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = flashDeal.end_date - now;

      if (remaining <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(remaining / (3600 * 24)).toString().padStart(2, '0');
      const hours = Math.floor((remaining % (3600 * 24)) / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((remaining % 3600) / 60).toString().padStart(2, '0');
      const seconds = Math.floor(remaining % 60).toString().padStart(2, '0');

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [flashDeal?.end_date]);

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
  }, [flashDeal]);

  if (loading) {
    return (
      <section className="mx-auto w-full">
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </section>
    );
  }

  if (!flashDeal) {
    return null;
  }

  return (
    <section className="mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h2 className="text-[18px] font-semibold text-slate-900 sm:text-[2.1rem]">
            {flashDeal.title}
          </h2>
          {/* {flashDeal.banner_subtitle_top && (
            <>
              <span className="text-slate-300">|</span>
              <p className="text-xl font-medium text-[#1B57A6] sm:text-[2rem] flex items-center gap-2">
                <span className="text-2xl">★</span> {flashDeal.banner_subtitle_top}
              </p>
            </>
          )} */}
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-end gap-1.5 mr-4 text-[#1B57A6] sm:gap-2">
            <div className="text-center">
              <p className="text-xl font-semibold leading-none sm:text-[42px]">
                {timeLeft.days}
              </p>
              <p className="mt-1 text-xs text-[#6b93cd]">Days</p>
            </div>
            <span className="pb-5 text-2xl">:</span>
            <div className="text-center">
              <p className="text-xl font-semibold leading-none sm:text-[42px]">
                {timeLeft.hours}
              </p>
              <p className="mt-1 text-xs text-[#6b93cd]">Hour</p>
            </div>
            <span className="pb-5 text-2xl">:</span>
            <div className="text-center">
              <p className="text-xl font-semibold leading-none sm:text-[42px]">
                {timeLeft.minutes}
              </p>
              <p className="mt-1 text-xs text-[#6b93cd]">Minute</p>
            </div>
            <span className="pb-5 text-2xl">:</span>
            <div className="text-center">
              <p className="text-xl font-semibold leading-none sm:text-[42px]">
                {timeLeft.seconds}
              </p>
              <p className="mt-1 text-xs text-[#6b93cd]">Second</p>
            </div>
          </div>

          <Link
            href={`/flash-deals/${flashDeal.slug}`}
            className="inline-flex items-center gap-2 rounded-md border border-[#89a8d6] px-4 py-2 text-lg font-medium text-[#1B57A6] transition hover:bg-[#f4f8ff] sm:text-2xl"
          >
            All Deals
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
          className="absolute left-1 top-[220px] lg:left-5 sm:top-[220px] lg:top-[250px] z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:left-0 sm:h-11 sm:w-11 sm:-translate-x-1/2 "
        >
          <FaChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <button
          type="button"
          onClick={() => scrollByOneCard(1)}
          disabled={!canScrollRight}
          aria-label="Show next special deals"
          className="absolute right-1 top-[220px] lg:right-7 sm:top-[220px] lg:top-[250px] z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:right-0 sm:h-11 sm:w-11 sm:translate-x-1/2 "
        >
          <FaChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {flashDeal.products?.map((pd: FlashDealProduct) => {
            const product = pd.product;
            if (!product) return null;

            const originalPrice = product.stroked_price || "";
            const price = product.main_price || "";
            const discountPercent = product.discount || "";

            const originalPriceNum = (product as any).stroked_price_raw || (product as any).unit_price || 0;
            const finalPriceNum = (product as any).main_price_raw || 0;
            const savings = Math.max(0, originalPriceNum - finalPriceNum);
            const saveAmount = savings > 0 ? `Save : ${formatCurrency(savings)}` : "";

            return (
              <div
                key={product.id}
                data-special-card
                className="w-[65%] sm:w-[48%] lg:w-[32%] shrink-0 snap-start"
              >
                <ProductCard
                  cardVariant="specialDeal"
                  brand={product.brand?.name}
                  brandLogo={product.brand?.logo}
                  title={product.name}
                  slug={product.slug}
                  image={product.thumbnail_image}
                  type={product.category?.name || "Appliance"}
                  dealLabel={flashDeal.banner_subtitle_top || "Cashback"}
                  quickDetailsLabel="Quick Details"
                  dealDays={timeLeft.days}
                  dealHours={timeLeft.hours}
                  dealMinutes={timeLeft.minutes}
                  dealSeconds={timeLeft.seconds}
                  price={price}
                  originalPrice={originalPrice}
                  saveAmount={saveAmount}
                  discountPercent={discountPercent}
                  dealImageHeight="260px"
                  productData={product as any}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

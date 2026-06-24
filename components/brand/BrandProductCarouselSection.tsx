"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/common/ProductCard";

type CategoryProduct = {
  id: number;
  [key: string]: unknown;
};

type BrandProductCarouselSectionProps = {
  id: string;
  title: string;
  products: CategoryProduct[];
  seeMoreHref?: string;
};

export default function BrandProductCarouselSection({
  id,
  title,
  products,
  seeMoreHref = "/products",
}: BrandProductCarouselSectionProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    const tolerance = 2;
    setCanScrollLeft(slider.scrollLeft > tolerance);
    setCanScrollRight(
      slider.scrollLeft < slider.scrollWidth - slider.clientWidth - tolerance
    );
  };

  const scrollByOneCard = (direction: 1 | -1) => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    const firstCard = slider.querySelector("[data-brand-card]") as HTMLDivElement | null;
    if (!firstCard) {
      return;
    }

    const styles = window.getComputedStyle(slider);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
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
  }, [products.length]);

  return (
    <section id={id} className="mx-auto w-full max-w-[1840px] px-4 py-5 md:px-8">
      <div className="mb-4 flex items-center justify-between  pt-4">
        <h2 className="lg:text-[28px] text-[20px] font-semibold leading-none text-gray-900">{title}</h2>
        <Link
          href={seeMoreHref}
          className="inline-flex items-center gap-2 rounded border border-[#98b7df] px-3 py-1 text-sm font-medium text-[#3576c7] hover:bg-[#f5f9ff]"
        >
          See more
          <FaChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByOneCard(-1)}
          disabled={!canScrollLeft}
          aria-label={`Show previous ${title} products`}
          className="absolute -left-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-40 md:flex"
        >
          <FaChevronLeft className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => scrollByOneCard(1)}
          disabled={!canScrollRight}
          aria-label={`Show next ${title} products`}
          className="absolute -right-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-40 md:flex"
        >
          <FaChevronRight className="h-3.5 w-3.5" />
        </button>

        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div
              key={product.id}
              data-brand-card
              className="w-[88%] flex-shrink-0 sm:w-[48%] md:w-[31.5%] lg:w-[24%] xl:w-[19.4%]"
            >
              <ProductCard productData={product as any} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

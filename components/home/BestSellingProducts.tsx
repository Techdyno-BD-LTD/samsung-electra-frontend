"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/common/ProductCard";
import { Product } from "@/types/product";
import Skeleton from "@/components/common/Skeleton";

export default function BestSellingProducts() {
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/best-seller");
        const data = await res.json();
        if (data?.success && Array.isArray(data?.data)) {
          setDynamicProducts(data.data);
        } else {
          setDynamicProducts([]);
        }
      } catch (error) {
        console.error("Error fetching best selling products:", error);
        setDynamicProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

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

    const firstCard = slider.querySelector("[data-bestseller-card]") as HTMLDivElement | null;
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
  }, [dynamicProducts]);

  return (
    <section className="mx-auto space-y-6">
      <div>
        <h2 className="text-[18px] font-semibold text-slate-900 sm:text-[2.1rem]">Best Selling / Top Selling</h2>
        <div className="mt-3 h-[2px] w-[260px] bg-gradient-to-r from-[#2F73BD] via-[#2F73BD]/50 to-transparent sm:w-[380px]" />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByOneCard(-1)}
          disabled={!canScrollLeft}
          aria-label="Show previous best selling products"
          className="absolute left-1 top-[120px] lg:left-5 sm:top-[220px] lg:top-[250px] z-50 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:left-0 sm:h-11 sm:w-11 sm:-translate-x-1/2 "
        >
          <FaChevronLeft className="h-2 w-2 sm:h-4 sm:w-4" />
        </button>

        <button
          type="button"
          onClick={() => scrollByOneCard(1)}
          disabled={!canScrollRight}
          aria-label="Show next best selling products"
          className="absolute right-1 top-[120px] lg:right-7 sm:top-[220px] lg:top-[250px] z-50 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:right-0 sm:h-11 sm:w-11 sm:translate-x-1/2 "
        >
          <FaChevronRight className="h-2 w-2 sm:h-4 sm:w-4" />
        </button>

        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {loading ? (
            <div className="flex h-[300px] w-full items-center justify-center">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
          ) : dynamicProducts.length === 0 ? (
            <div className="flex w-full items-center justify-center py-20 text-slate-500">
              No products found.
            </div>
          ) : (
            dynamicProducts.map((product) => (
              <div
                key={product.id}
                data-bestseller-card
                className="min-w-[65%] snap-start sm:min-w-[48%] lg:min-w-[31.5%] xl:min-w-[24%] 2xl:min-w-[19%]"
              >
                <ProductCard productData={product} isBestSeller={true} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

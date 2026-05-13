"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/common/ProductCard";
import { useAppSelector } from "@/store/hooks";



// const fallbackStatusBadges: ProductBadge[] = ["New", "Hot", "Sold Out", "Special", ""];

type RecommendedProduct = {
  id: number;
  name: string;
  slug: string;
  thumbnail_image: string;
  main_price: string;
  stroked_price: string;
  badge_value?: string;
};

export default function PeopleAlsoBought() {
  const cartItems = useAppSelector(state => state.cart.items);
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      const productIds = cartItems.map(item => item.productId).filter(Boolean);
      try {
        const response = await fetch('/api/v2/people-also-bought', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_ids: productIds })
        });
        const result = await response.json();
        if (result.success) {
          setRecommendedProducts(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [cartItems]);

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

    const firstCard = slider.querySelector("[data-popular-card]") as HTMLDivElement | null;
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

    updateScrollState();
    slider.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    return () => {
      slider.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [recommendedProducts]);

  if (cartItems.length === 0) {
    return null;
  }

  if (!loading && recommendedProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-full overflow-hidden mx-auto space-y-6 mt-12 lg:mt-16 2xl:mt-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-[18px] font-semibold text-slate-900 sm:text-[2.1rem]">People also bought</h2>
          <div className="mt-5 h-[2px] w-[260px] bg-gradient-to-r from-[#2F73BD] via-[#2F73BD]/50 to-transparent sm:w-[380px]" />
        </div>
      </div>

      <div className="relative w-full max-full">
        <button
          type="button"
          onClick={() => scrollByOneCard(-1)}
          disabled={!canScrollLeft}
          aria-label="Show previous product"
          className="absolute left-1 top-1/3 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:left-0 sm:h-11 sm:w-11 sm:-translate-x-1/2"
        >
          <FaChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <button
          type="button"
          onClick={() => scrollByOneCard(1)}
          disabled={!canScrollRight}
          aria-label="Show next product"
          className="absolute right-1 top-1/3 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:right-0 sm:h-11 sm:w-11 sm:translate-x-1/2"
        >
          <FaChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {loading ? (
            // Skeleton or loading state
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[calc(50%-6px)] flex-shrink-0 animate-pulse bg-gray-100 h-64 rounded-xl sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(25%-12px)] 2xl:w-[calc(20%-13px)]" />
            ))
          ) : (
            recommendedProducts.map((product) => (
              <div
                key={product.id}
                data-popular-card
                className="w-[calc(50%-6px)] flex-shrink-0 overflow-hidden snap-start sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(25%-12px)] 2xl:w-[calc(20%-13px)]"
              >
                <ProductCard
                  title={product.name}
                  slug={product.slug}
                  image={product.thumbnail_image}
                  price={product.main_price}
                  originalPrice={product.stroked_price}
                  statusBadge={product.badge_value || ""}
                  productData={product}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

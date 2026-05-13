"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/common/ProductCard";
import { Product } from "@/types/product";
// import products from "@/database/popularproducts.json";

type ProductBadge = "New" | "Hot" | "Sold Out" | "Special" | "";

const fallbackStatusBadges: ProductBadge[] = ["New", "Hot", "Sold Out", "Special", ""];

export default function PopularProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/popular");
        const json = await response.json();
        if (json.success) {
          setFeaturedProducts(json.data.slice(0, 10));
        }
      } catch (error) {
        console.error("Failed to fetch popular products:", error);
      } finally {
        setLoading(false);
      }
    };
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
  }, [featuredProducts]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2F73BD] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <section className="mx-auto space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-[18px] font-semibold text-slate-900 sm:text-[2.1rem]">Popular Products</h2>
          <div className="mt-5 h-[2px] w-[260px] bg-gradient-to-r from-[#2F73BD] via-[#2F73BD]/50 to-transparent sm:w-[380px]" />
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByOneCard(-1)}
          disabled={!canScrollLeft}
          aria-label="Show previous product"
          className="absolute left-1 top-[120px] lg:left-5 sm:top-[220px] lg:top-[250px]  z-50 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:left-0 sm:h-11 sm:w-11 sm:-translate-x-1/2 "
        >
          <FaChevronLeft className="h-2 w-2 sm:h-4 sm:w-4" />
        </button>

        <button
          type="button"
          onClick={() => scrollByOneCard(1)}
          disabled={!canScrollRight}
          aria-label="Show next product"
          className="absolute right-1 top-[120px] lg:right-7 sm:top-[220px] lg:top-[250px]  z-50 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:right-0 sm:h-11 sm:w-11 sm:translate-x-1/2 "
        >
          <FaChevronRight className="h-2 w-2 sm:h-4 sm:w-4" />
        </button>

        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              data-popular-card
              className="min-w-[65%] snap-start sm:min-w-[48%] lg:min-w-[31.5%] xl:min-w-[24%] 2xl:min-w-[19%]"
            >
              <ProductCard
                productData={product}
                statusBadge={fallbackStatusBadges[index] || ""}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


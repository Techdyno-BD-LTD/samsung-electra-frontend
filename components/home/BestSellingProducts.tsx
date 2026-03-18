"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/common/ProductCard";
import products from "@/database/bestselling.json";

type BestSellingProduct = (typeof products)[number];

type Category = {
  key: string;
  label: string;
  matcher: (product: BestSellingProduct) => boolean;
};

const categories: Category[] = [
  {
    key: "all",
    label: "All",
    matcher: () => true,
  },
  {
    key: "tv-audio",
    label: "Tv & Audio",
    matcher: (product) => /tv|audio/i.test(product.title),
  },
  {
    key: "refrigerator",
    label: "Refrigerator",
    matcher: (product) => /refrigerator|fridge/i.test(product.title),
  },
  {
    key: "washing-machine",
    label: "Washing Machine",
    matcher: (product) => /washing/i.test(product.title),
  },
  {
    key: "microwave",
    label: "Microwave",
    matcher: (product) => /microwave|oven/i.test(product.title),
  },
  {
    key: "kitchen-appliance",
    label: "Kitchen Appliance",
    matcher: (product) => /kitchen|appliance/i.test(product.title),
  },
  {
    key: "personal-care",
    label: "Personal Care",
    matcher: (product) => /personal|care|dryer|trimmer/i.test(product.title),
  },
];

export default function BestSellingProducts() {
  const [activeCategory, setActiveCategory] = useState("all");
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredProducts = useMemo(() => {
    const selected = categories.find((item) => item.key === activeCategory);
    if (!selected) {
      return products;
    }
    const matched = products.filter(selected.matcher);
    return matched.length > 0 ? matched : products;
  }, [activeCategory]);

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
  }, [filteredProducts]);

  return (
    <section className="mx-auto space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-slate-900 sm:text-[2.1rem]">Best Selling / Top Selling</h2>
          <div className="mt-3 h-[2px] w-[260px] bg-gradient-to-r from-[#2F73BD] via-[#2F73BD]/50 to-transparent sm:w-[380px]" />
        </div>

        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-2 pb-1">
            {categories.map((category) => {
              const isActive = activeCategory === category.key;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setActiveCategory(category.key)}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition ${
                    isActive
                      ? "bg-black font-medium text-white"
                      : "bg-slate-200 font-normal text-slate-800 hover:bg-slate-300"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByOneCard(-1)}
          disabled={!canScrollLeft}
          aria-label="Show previous best selling products"
          className="absolute left-2 top-[170px] z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:left-0 sm:h-11 sm:w-11 sm:-translate-x-1/2 sm:top-[220px]"
        >
          <FaChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <button
          type="button"
          onClick={() => scrollByOneCard(1)}
          disabled={!canScrollRight}
          aria-label="Show next best selling products"
          className="absolute right-2 top-[170px] z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:right-0 sm:h-11 sm:w-11 sm:translate-x-1/2 sm:top-[220px]"
        >
          <FaChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              data-bestseller-card
              className="min-w-[48%] snap-start sm:min-w-[48%] lg:min-w-[31.5%] xl:min-w-[24%] 2xl:min-w-[19%]"
            >
              <ProductCard {...product} isBestSeller={Boolean(product.isBestSeller)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

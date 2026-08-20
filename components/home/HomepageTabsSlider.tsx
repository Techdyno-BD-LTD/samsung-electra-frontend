"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ProductCard from "../common/ProductCard";
import Skeleton from "../common/Skeleton";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ProductData } from "../common/AddToCartModal";

type TabType = "new-arrivals" | "hot-sale" | "top-rated";

export default function HomepageTabsSlider() {
  const [activeTab, setActiveTab] = useState<TabType>("new-arrivals");
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      setLoading(true);
      try {
        let endpoint = "/api/products/new-arrivals";
        if (activeTab === "hot-sale") {
          endpoint = "/api/products/hot-sale";
        } else if (activeTab === "top-rated") {
          endpoint = "/api/products/top-rated";
        }

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch products");
        const json = await res.json();
        
        if (isMounted) {
          // APIs return data array
          setProducts(json.data || []);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainer.current) {
      const container = scrollContainer.current;
      const scrollAmount = container.clientWidth;
      const target = container.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: target,
        behavior: "smooth",
      });
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "new-arrivals", label: "New Arrival" },
    { id: "hot-sale", label: "Hot Sale" },
    { id: "top-rated", label: "Top Rated" },
  ];

  return (
    <section className="w-full max-w-[1700px] mx-auto px-4 select-none relative">
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-slider-item {
          width: calc(50% - 5px) !important;
          min-width: calc(50% - 5px) !important;
          flex-shrink: 0 !important;
        }
        @media (min-width: 640px) {
          .custom-slider-item {
            width: calc(50% - 16px) !important;
            min-width: calc(50% - 16px) !important;
          }
        }
        @media (min-width: 768px) {
          .custom-slider-item {
            width: calc(33.33% - 16px) !important;
            min-width: calc(33.33% - 16px) !important;
          }
        }
        @media (min-width: 1536px) {
          .custom-slider-item {
            width: calc(25% - 18px) !important;
            min-width: calc(25% - 18px) !important;
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />
      
      {/* Tabs list and See All Button wrapper */}
      <div className="flex items-center justify-center lg:justify-between mb-6 sm:mb-8 gap-4">
        {/* Tabs list (left-aligned) */}
        <div className="flex gap-2.5 sm:gap-4 overflow-x-auto pb-1 justify-center lg:justify-start scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-poppins sm:px-6 sm:py-3 rounded-lg text-sm sm:text-[18px] font-semibold tracking-wide border transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white border-[#2563EB]"
                    : "bg-white text-[#2563EB] border-blue-400 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* See All Button */}
        <Link
          href={`/search?tab=${activeTab}`}
          className="px-4 py-2 sm:px-6 sm:py-2.5 hidden lg:block rounded-lg text-sm sm:text-[18px] font-semibold text-blue-600 border border-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 flex-shrink-0"
        >
          See All
        </Link>
      </div>

      {/* Slider Viewport Container */}
      <div className="relative w-full group">
        
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll("left")}
          aria-label="Previous slide"
          className="absolute -left-3 sm:-left-7 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f1f1f1] hover:bg-gray-250 text-gray-700 hover:scale-105 transition-all active:scale-95"
        >
          <FaChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll("right")}
          aria-label="Next slide"
          className="absolute -right-3 sm:-right-7 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f1f1f1] hover:bg-gray-250 text-gray-700 hover:scale-105 transition-all active:scale-95"
        >
          <FaChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        {/* Scrollable Flex Container */}
        <div
          ref={scrollContainer}
          className="flex w-full gap-2.5 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
          style={{
            scrollSnapType: "x mandatory",
          }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="custom-slider-item"
              >
                <Skeleton className="h-[250px] sm:h-[400px] w-full rounded-2xl" />
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="w-full text-center py-12 text-gray-400">
              No products found.
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="custom-slider-item"
                style={{
                  scrollSnapAlign: "start",
                }}
              >
                <ProductCard
                  cardVariant="default"
                  title={product.name}
                  brand={product.brand?.name}
                  brandLogo={product.brand?.logo}
                  category={product.category?.name}
                  slug={product.slug}
                  image={product.thumbnail_image}
                  price={`৳ ${(product.main_price ?? 0).toLocaleString("en-US")}`}
                  originalPrice={`৳ ${(product.stroked_price ?? 0).toLocaleString("en-US")}`}
                  discountPercent={product.discount}
                  rating={product.rating}
                  ratingCount={product.rating_count?.toString()}
                  productData={product}
                  statusBadge={
                    activeTab === "new-arrivals" ? "New" :
                    activeTab === "hot-sale" ? "hot" :
                    activeTab === "top-rated" ? "top rated" : ""
                  }
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

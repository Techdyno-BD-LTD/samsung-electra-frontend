"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { HiOutlineSquares2X2, HiOutlineBars3 } from "react-icons/hi2";
import ProductCard from "@/components/common/ProductCard";
import AuctionMobileFilterDrawer from "./AuctionMobileFilterDrawer";
import Skeleton from "@/components/common/Skeleton";
import { ProductData } from "@/components/common/AddToCartModal";

interface Product {
  id: number;
  name: string;
  slug: string;
  thumbnail_img: string;
  brand_name?: string;
  brand?: { name: string; slug: string };
  starting_bid?: number;
  highest_bid?: number;
  total_bids?: number;
  auction_start_date?: number;
  auction_end_date?: number;
  unit_price?: number;
}

export default function AuctionProductGrid({ filteringAttributes }: { filteringAttributes?: any }) {
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---- Fetch Auction Products ---- */
  const fetchAuctionProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v2/auction/products");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
      }
    } catch (err) {
      console.error("Error fetching auction products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuctionProducts();
  }, [fetchAuctionProducts]);

  /* ---- Client-Side Filter & Sort ---- */
  const filteredProducts = useMemo(() => {
    // 1. Parse URL Filter values
    const selectedBrands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 200000;
    const selectedStatus = searchParams.get("status") || "all";

    return products.filter((p) => {
      // Brand filter
      const bName = p.brand_name || p.brand?.name || "";
      const bSlug = p.brand?.slug || bName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (selectedBrands.length > 0 && !selectedBrands.includes(bSlug)) {
        return false;
      }

      // Price filter (on current price)
      const currentPrice = p.highest_bid || p.starting_bid || p.unit_price || 0;
      if (currentPrice < minPrice || currentPrice > maxPrice) {
        return false;
      }

      // Status filter
      const now = Math.floor(Date.now() / 1000);
      const startTime = p.auction_start_date || 0;
      const endTime = p.auction_end_date || 0;

      if (selectedStatus === "live") {
        if (now < startTime || now > endTime) return false;
      } else if (selectedStatus === "upcoming") {
        if (now >= startTime) return false;
      } else if (selectedStatus === "closed") {
        if (now <= endTime) return false;
      }

      return true;
    });
  }, [products, searchParams]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortOption === "price-low") {
      list.sort((a, b) => {
        const valA = a.highest_bid || a.starting_bid || a.unit_price || 0;
        const valB = b.highest_bid || b.starting_bid || b.unit_price || 0;
        return valA - valB;
      });
    } else if (sortOption === "price-high") {
      list.sort((a, b) => {
        const valA = a.highest_bid || a.starting_bid || a.unit_price || 0;
        const valB = b.highest_bid || b.starting_bid || b.unit_price || 0;
        return valB - valA;
      });
    } else if (sortOption === "newest") {
      list.sort((a, b) => b.id - a.id);
    } else if (sortOption === "bids-high") {
      list.sort((a, b) => (b.total_bids || 0) - (a.total_bids || 0));
    }
    return list;
  }, [filteredProducts, sortOption]);

  return (
    <div className="flex flex-col gap-4">
      {/* ═══════════════ DESKTOP TOOLBAR (Hidden on Mobile) ═══════════════ */}
      <div className="hidden lg:flex items-center justify-between rounded-md border border-slate-200 bg-[#f4f4f4] px-4 py-2.5">
        <div className="flex items-center gap-4">
          <span className="text-[13px] font-medium text-slate-500">
            <span className="font-semibold text-[#2B7FE8]">{sortedProducts.length}</span>{" "}
            Items Found
          </span>

          <div className="hidden items-center gap-1 sm:flex">
            <span className="mr-1 text-[12px] text-slate-400">
              Product View :
            </span>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${viewMode === "grid" ? "bg-slate-100 text-[#2B7FE8]" : "text-slate-400 hover:text-slate-600"}`}
            >
              <HiOutlineSquares2X2 className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${viewMode === "list" ? "bg-slate-100 text-[#2B7FE8]" : "text-slate-400 hover:text-slate-600"}`}
            >
              <HiOutlineBars3 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="cursor-pointer appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-8 text-[13px] text-slate-600 outline-none transition focus:border-blue-400"
          >
            <option value="default">Select Sort Option</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="bids-high">Most Bids</option>
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* ═══════════════ MOBILE TOOLBAR ═══════════════ */}
      <div className="flex lg:hidden flex-col gap-3 px-1 py-2 bg-[#F4F4F4] border-y border-slate-100">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-full border border-slate-300 bg-white py-1 pl-5 pr-10 text-[12px] text-slate-700 outline-none transition shadow-sm"
            >
              <option value="default">Select Sort Option</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="bids-high">Most Bids</option>
            </select>
            <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>

          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-5 py-1 text-[12px] text-slate-700 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            <span>Filter</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-sm"
          >
            <HiOutlineSquares2X2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <h2 className="text-[14px] font-semibold text-slate-800 -mt-1 mb-2 px-1">
        Showing {sortedProducts.length} of {products.length} Products
      </h2>

      {/* ═══════════════ PRODUCT GRID ═══════════════ */}
      <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4 lg:grid-cols-3" : "flex flex-col gap-4"}>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 w-full col-span-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="flex w-full items-center justify-center py-20 text-slate-500 col-span-full">
            No products found matching your filters.
          </div>
        ) : (
          sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              cardVariant="auction"
              title={product.name}
              slug={product.slug}
              image={product.thumbnail_img}
              brand={product.brand_name || product.brand?.name}
              startingBid={product.starting_bid}
              highestBid={product.highest_bid}
              totalBids={product.total_bids}
              auctionStartDate={product.auction_start_date}
              auctionEndDate={product.auction_end_date}
              productData={product as unknown as ProductData}
            />
          ))
        )}
      </div>

      <AuctionMobileFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filteringAttributes={filteringAttributes}
      />
    </div>
  );
}

"use client"
import { useState, useMemo } from "react";
import { HiOutlineSquares2X2, HiOutlineBars3 } from "react-icons/hi2";
import ProductCard from "@/components/common/ProductCard";
import { ProductData } from "../common/AddToCartModal";

interface CampaignProductGridProps {
  products: ProductData[];
}

export default function CampaignProductGrid({ products }: CampaignProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState("default");

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortOption === "price-low") {
      sorted.sort((a, b) => (a.calculable_price || 0) - (b.calculable_price || 0));
    } else if (sortOption === "price-high") {
      sorted.sort((a, b) => (b.calculable_price || 0) - (a.calculable_price || 0));
    } else if (sortOption === "newest") {
      sorted.sort((a, b) => Number(b.id) - Number(a.id));
    }
    return sorted;
  }, [products, sortOption]);

  const totalItems = sortedProducts.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Tool bar */}
      <div className="flex items-center justify-between rounded-md border border-slate-200 bg-[#f4f4f4] px-4 py-2.5">
        <div className="flex items-center gap-4">
          <span className="text-[13px] font-medium text-slate-500">
            <span className="font-semibold text-[#2B7FE8]">{totalItems}</span>{" "}
            Items Found
          </span>

          <div className="hidden items-center gap-1 sm:flex">
            <span className="mr-1 text-[12px] text-slate-400">
              Product View :
            </span>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${viewMode === "grid" ? "bg-white text-[#2B7FE8] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <HiOutlineSquares2X2 className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${viewMode === "list" ? "bg-white text-[#2B7FE8] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
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
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 sm:gap-4" : "flex flex-col gap-4"}>
        {sortedProducts.length === 0 ? (
          <div className="flex w-full items-center justify-center py-20 text-slate-500 col-span-full">
            No products found for this campaign.
          </div>
        ) : (
          sortedProducts.map((product) => (
            <ProductCard 
                key={product.id} 
                productData={product} 
            />
          ))
        )}
      </div>
    </div>
  );
}

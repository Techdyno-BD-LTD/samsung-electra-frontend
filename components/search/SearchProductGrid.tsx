"use client"
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { HiOutlineSquares2X2, HiOutlineBars3 } from "react-icons/hi2";
import ProductCard from "@/components/common/ProductCard";
import MobileFilterDrawer from "@/components/category/MobileFilterDrawer";
import Skeleton from "@/components/common/Skeleton";

type SearchProductGridProps = {
  query: string;
  categoryId?: string | null;
  filteringAttributes?: { 
    id: number; 
    name: string; 
    values: { id: number; name: string; code?: string }[] 
  }[];
};

export default function SearchProductGrid({ query, categoryId, filteringAttributes }: SearchProductGridProps) {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sourceProducts, setSourceProducts] = useState<{ id: number; name: string; slug: string; calculable_price: number; brand_name?: string; brand?: { name: string }; attributes?: { name: string; values: string[] }[]; color_name?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ---- Fetch Products ---- */
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        let url = `/api/products/search?name=${encodeURIComponent(query)}`;
        if (categoryId) {
          url += `&category_id=${categoryId}`;
        }
        const response = await fetch(url);
        if (response.ok) {
          const payload = await response.json();
          setSourceProducts(payload.data || []);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (query) {
      fetchProducts();
    }
  }, [query, categoryId]);

  /* ---- Client-Side Filtering ---- */
  const filteredProducts = useMemo(() => {
    let filtered = [...sourceProducts];

    // 1. Price Filtering
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;
    filtered = filtered.filter(p => {
      const price = p.calculable_price || 0;
      return price >= minPrice && price <= maxPrice;
    });

    // 2. Brand Filtering
    const selectedBrands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand_name || p.brand?.name || ""));
    }

    // 3. Attribute Filtering
    searchParams.forEach((value, key) => {
      if (key.startsWith("attr_")) {
        const attrName = key.replace("attr_", "");
        const selectedValues = value.split(/[|,]/).filter(Boolean);
        if (selectedValues.length > 0) {
          const selectedValuesLower = selectedValues.map(v => v.toLowerCase());
          filtered = filtered.filter(p => {
            const pAttrs = p.attributes || [];
            return pAttrs.some((pa: { name: string; values: string[] }) => 
              pa.name.toLowerCase() === attrName && 
              pa.values.some((v: string) => selectedValuesLower.includes(v.toLowerCase()))
            ) || (attrName === 'color' && selectedValuesLower.includes((p.color_name || '').toLowerCase()));
          });
        }
      }
    });

    // 4. Sorting
    if (sortOption === "price-low") {
      filtered.sort((a, b) => (a.calculable_price || 0) - (b.calculable_price || 0));
    } else if (sortOption === "price-high") {
      filtered.sort((a, b) => (b.calculable_price || 0) - (a.calculable_price || 0));
    } else if (sortOption === "newest") {
      filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return filtered;
  }, [sourceProducts, searchParams, sortOption]);

  const totalItems = filteredProducts.length;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="hidden lg:flex items-center justify-between rounded-md border border-slate-200 bg-[#f4f4f4] px-4 py-2.5">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-3 p-4 border border-slate-100 rounded-xl">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ═══════════════ DESKTOP TOOLBAR ═══════════════ */}
      <div className="hidden lg:flex items-center justify-between rounded-md border border-slate-200 bg-[#f4f4f4] px-4 py-2.5">
        <div className="flex items-center gap-4">
          <span className="text-[13px] font-medium text-slate-500">
            <span className="font-semibold text-[#2B7FE8]">{totalItems}</span>{" "}
            Items Found for &quot;{query}&quot;
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
            <option value="popular">Most Popular</option>
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
              <option value="popular">Most Popular</option>
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
        {totalItems} Items Found for &quot;{query}&quot;
      </h2>

      {/* ═══════════════ PRODUCT GRID ═══════════════ */}
      <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-4"}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} productData={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-700">No products found</h3>
          <p className="mt-2 text-slate-500">We couldn&apos;t find any products matching your search query or filters.</p>
        </div>
      )}

      {/* Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filteringAttributes={filteringAttributes}
      />
    </div>
  );
}

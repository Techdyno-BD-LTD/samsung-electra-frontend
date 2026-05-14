"use client";

import { useState, useEffect } from "react";
import { HiChevronUp } from "react-icons/hi2";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface FilterValue {
  id: number;
  name: string;
  code?: string;
}

interface FilteringAttribute {
  id: number;
  name: string;
  values: FilterValue[];
}

interface Brand {
  id: number;
  name: string;
  slug: string;
}

interface CategoryFilterPanelProps {
  filteringAttributes?: FilteringAttribute[];
}

export default function CategoryFilterPanel({ filteringAttributes = [] }: CategoryFilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* ---- State for Filters ---- */
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [attributeFilters, setAttributeFilters] = useState<Record<string, string[]>>({});

  /* ---- UI Open/Close States ---- */
  const [priceOpen, setPriceOpen] = useState(true);
  const [brandsOpen, setBrandsOpen] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  /* ---- Initialize from URL ---- */
  useEffect(() => {
    const brandsFromUrl = searchParams.get("brands")?.split(",") || [];
    setSelectedBrands(brandsFromUrl.filter(Boolean));

    const minP = Number(searchParams.get("minPrice")) || 0;
    const maxP = Number(searchParams.get("maxPrice")) || 200000;
    setMinPrice(minP);
    setMaxPrice(maxP);

    const attrs: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith("attr_")) {
        attrs[key] = value.split(/[|,]/).filter(Boolean);
      }
    });
    setAttributeFilters(attrs);
  }, [searchParams]);

  /* ---- Fetch Brands ---- */
  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch("/api/brands");
        if (res.ok) {
          const payload = await res.json();
          setBrands(payload.data || []);
        }
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    }
    fetchBrands();
  }, []);

  /* ---- Update URL ---- */
  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleBrand = (slug: string) => {
    const next = selectedBrands.includes(slug)
      ? selectedBrands.filter((s) => s !== slug)
      : [...selectedBrands, slug];
    setSelectedBrands(next);
    updateUrl({ brands: next.join(",") });
  };

  const toggleAttribute = (attrName: string, valueName: string) => {
    const key = `attr_${attrName.toLowerCase()}`;
    const current = attributeFilters[key] || [];
    const next = current.includes(valueName)
      ? current.filter((v) => v !== valueName)
      : [...current, valueName];
    
    const nextFilters = { ...attributeFilters, [key]: next };
    setAttributeFilters(nextFilters);
    updateUrl({ [key]: next.join(",") });
  };

  const handlePriceChange = () => {
    updateUrl({ minPrice: minPrice.toString(), maxPrice: maxPrice.toString() });
  };

  const resetAttribute = (attrName: string) => {
    const key = `attr_${attrName.toLowerCase()}`;
    setAttributeFilters(prev => ({ ...prev, [key]: [] }));
    updateUrl({ [key]: null });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ═══════════════ BRANDS SECTION ═══════════════ */}
      <div className="rounded-md border border-slate-200 bg-white px-4 py-4">
        <div
          onClick={() => setBrandsOpen(!brandsOpen)}
          className="flex w-full cursor-pointer items-center justify-between"
        >
          <h3 className="text-[24px] font-semibold text-slate-800">Brands</h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBrands([]);
                updateUrl({ brands: null });
              }}
              className="text-[12px] font-medium text-slate-400 transition hover:text-red-500"
            >
              Reset
            </button>
            <HiChevronUp className={`h-4 w-4 text-slate-400 transition-transform ${brandsOpen ? "" : "rotate-180"}`} />
          </div>
        </div>
        <div className="mt-2 h-[2.5px] w-[50%] rounded-full bg-gradient-to-r from-[#2B7FE8] via-[#2B7FE8]/60 to-transparent" />
        
        <div className={`overflow-hidden transition-all duration-300 ${brandsOpen ? "mt-4 max-h-[400px] overflow-y-auto opacity-100 pr-2 custom-scrollbar" : "max-h-0 opacity-0"}`}>
          <ul className="flex flex-col gap-2.5">
            {brands.map((brand) => {
              const checked = selectedBrands.includes(brand.slug);
              return (
                <li key={brand.id}>
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${checked ? "border-slate-800 bg-slate-800" : "border-slate-300 bg-white"}`}>
                      {checked && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleBrand(brand.slug)} />
                    <span className="text-[16px] text-slate-600">{brand.name}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ═══════════════ PRICE RANGE SECTION ═══════════════ */}
      <div className="rounded-md border border-slate-200 bg-white px-4 py-4">
        <div
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex w-full cursor-pointer items-center justify-between"
        >
          <h3 className="text-[24px] font-semibold text-slate-800">Price Range</h3>
          <HiChevronUp className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${priceOpen ? "" : "rotate-180"}`} />
        </div>
        <div className="mt-2 h-[2.5px] w-[50%] rounded-full bg-gradient-to-r from-[#2B7FE8] via-[#2B7FE8]/60 to-transparent" />
        
        <div className={`overflow-hidden transition-all duration-300 ${priceOpen ? "mt-4 max-h-[250px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="mb-3 flex items-center justify-between text-[18px] text-slate-700">
            <span>৳{minPrice.toLocaleString()}</span>
            <span className="text-slate-400">—</span>
            <span>৳{maxPrice.toLocaleString()}</span>
          </div>

          <div className="relative mt-6 h-6">
            <input
              type="range"
              min={0}
              max={200000}
              step={1000}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              onMouseUp={handlePriceChange}
              onTouchEnd={handlePriceChange}
              className="absolute pointer-events-none appearance-none z-20 h-1 w-full bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2B7FE8] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
            />
            <input
              type="range"
              min={0}
              max={200000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              onMouseUp={handlePriceChange}
              onTouchEnd={handlePriceChange}
              className="absolute pointer-events-none appearance-none z-20 h-1 w-full bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2B7FE8] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
            />
            <div className="absolute top-2 h-1 w-full bg-slate-200 rounded-full" />
            <div 
              className="absolute top-2 h-1 bg-[#2B7FE8] rounded-full" 
              style={{
                left: `${(minPrice / 200000) * 100}%`,
                width: `${((maxPrice - minPrice) / 200000) * 100}%`
              }}
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              onBlur={handlePriceChange}
              className="w-full rounded border border-slate-200 px-2 py-1.5 text-center text-[16px] text-slate-600 outline-none focus:border-blue-400"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              onBlur={handlePriceChange}
              className="w-full rounded border border-slate-200 px-2 py-1.5 text-center text-[16px] text-slate-600 outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* ═══════════════ DYNAMIC ATTRIBUTE SECTIONS ═══════════════ */}
      {filteringAttributes.map((attr) => {
        const isOpen = openSections[attr.name] !== false; // Default open
        const selectedValues = attributeFilters[`attr_${attr.name.toLowerCase()}`] || [];
        const isColor = attr.name.toLowerCase() === 'color';

        return (
          <div key={attr.id} className="rounded-md border border-slate-200 bg-white px-4 py-4">
            <div
              onClick={() => setOpenSections(prev => ({ ...prev, [attr.name]: !isOpen }))}
              className="flex w-full cursor-pointer items-center justify-between"
            >
              <h3 className="text-[24px] font-semibold text-slate-800">{attr.name}</h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetAttribute(attr.name);
                  }}
                  className="text-[12px] font-medium text-slate-400 transition hover:text-red-500"
                >
                  Reset
                </button>
                <HiChevronUp className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "" : "rotate-180"}`} />
              </div>
            </div>
            <div className="mt-2 h-[2.5px] w-[50%] rounded-full bg-gradient-to-r from-[#2B7FE8] via-[#2B7FE8]/60 to-transparent" />

            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "mt-4 max-h-[300px] overflow-y-auto opacity-100 pr-2 custom-scrollbar" : "max-h-0 opacity-0"}`}>
              {isColor ? (
                <div className="grid grid-cols-5 gap-2 pb-2">
                  {attr.values.map((val) => {
                    const checked = selectedValues.includes(val.name);
                    return (
                      <button
                        key={val.id}
                        type="button"
                        onClick={() => toggleAttribute(attr.name, val.name)}
                        className={`group relative flex h-8 w-8 items-center justify-center rounded-full border transition-all ${checked ? "border-[#2B7FE8] scale-110 shadow-sm" : "border-slate-200 hover:border-slate-400"}`}
                        title={val.name}
                      >
                        <span 
                          className="h-6 w-6 rounded-full border border-black/5" 
                          style={{ backgroundColor: val.code || '#ddd' }}
                        />
                        {checked && (
                          <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#2B7FE8] text-[8px] text-white">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {attr.values.map((val) => {
                    const checked = selectedValues.includes(val.name);
                    return (
                      <li key={val.id}>
                        <label className="flex cursor-pointer items-center gap-2.5">
                          <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${checked ? "border-slate-800 bg-slate-800" : "border-slate-300 bg-white"}`}>
                            {checked && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </span>
                          <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleAttribute(attr.name, val.name)} />
                          <span className="text-[16px] text-slate-600">{val.name}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

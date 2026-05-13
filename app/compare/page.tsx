"use client";
import Image from "next/image";
import Link from "next/link";
import { FaSearch, FaShareAlt, FaTrashAlt } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
// Forced refresh to fix cached ReferenceError
import { clearCompare, removeAtIndex, setCompareAtIndex, CompareItem } from "@/store/features/compare/compareSlice";

type CompareSlot = CompareItem | null;

function getUniversalKeys() {
  return ["Brand", "Category"];
}

export default function ComparePage() {
  const dispatch = useAppDispatch();
  const slots = useAppSelector((state) => state.compare.slots) as CompareSlot[];
  const [queries, setQueries] = useState(["", "", ""]);
  const [suggestions, setSuggestions] = useState<Array<any[]>>([[], [], []]);
  const [isLoading, setIsLoading] = useState([false, false, false]);

  const compareGridClass =
    "grid grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[240px_repeat(2,minmax(0,1fr))] 2xl:grid-cols-[300px_repeat(3,minmax(0,1fr))]";
  const mobileSlots = slots.slice(0, 2);

  const selectedItems = slots.filter(Boolean) as CompareItem[];
  const universalKeys = useMemo(() => getUniversalKeys(), []);

  const categorySpecific = useMemo(() => {
    const grouped = new Map<string, string[]>();

    selectedItems.forEach((item) => {
      const category = item.category || "Other";
      const keys: string[] = [];
      if (item.specifications) {
        item.specifications.forEach(s => {
          if (!keys.includes(s.label)) {
            keys.push(s.label);
          }
        });
      }

      const existing = grouped.get(category) || [];
      keys.forEach((key) => {
        if (!existing.includes(key)) {
          existing.push(key);
        }
      });
      if (existing.length > 0) {
        grouped.set(category, existing);
      }
    });

    return Array.from(grouped.entries());
  }, [selectedItems]);

  useEffect(() => {
    queries.forEach((query, index) => {
      if (query.trim().length > 1) {
        const timer = setTimeout(async () => {
          setIsLoading(prev => prev.map((v, i) => i === index ? true : v));
          try {
            const res = await fetch(`/api/products/search?name=${encodeURIComponent(query)}`);
            const json = await res.json();
            if (json.success && json.data) {
              setSuggestions(prev => prev.map((v, i) => i === index ? json.data : v));
            }
          } catch (err) {
            console.error(err);
          } finally {
            setIsLoading(prev => prev.map((v, i) => i === index ? false : v));
          }
        }, 500);
        return () => clearTimeout(timer);
      } else {
        setSuggestions(prev => prev.map((v, i) => i === index ? [] : v));
      }
    });
  }, [queries]);

  const handleSetSlot = async (index: number, backendItem: any) => {
    // Clear query and suggestions first
    setQueries(prev => prev.map((v, i) => i === index ? "" : v));
    setSuggestions(prev => prev.map((v, i) => i === index ? [] : v));

    // Fetch full details for specifications
    try {
      const res = await fetch(`/api/products/${backendItem.slug}`);
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        const fullItem = json.data[0];
        const compareItem: CompareItem = {
          id: fullItem.id,
          slug: fullItem.slug,
          title: fullItem.name,
          brand: fullItem.brand_name || fullItem.brand?.name || "",
          image: fullItem.thumbnail_image,
          price: fullItem.main_price,
          originalPrice: fullItem.stroked_price,
          discountPercent: fullItem.discount,
          saveAmount: "", // Backend doesn't provide this directly in mini/detail
          category: fullItem.category?.name,
          specifications: fullItem.specifications || [],
          rating: fullItem.rating,
          ratingCount: String(fullItem.rating_count),
        };
        dispatch(setCompareAtIndex({ index, item: compareItem }));
      }
    } catch (err) {
      console.error("Failed to fetch product details for compare", err);
    }
  };

  return (
    <main className="mt-12 pb-10 sm:mt-24 sm:pb-14 lg:mt-16">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[12px] text-slate-500 sm:text-sm">
        <Link href="/" className="transition hover:text-slate-700">Home</Link>
        <span className="text-slate-400">›</span>
        <span className="font-medium text-slate-700">Shop</span>
      </nav>

      <div className="mb-4 hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Compare Selected Product</h1>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => dispatch(clearCompare())}
            className="inline-flex items-center gap-2 rounded-md bg-[#fff1f1] px-3 py-1.5 text-[11px] font-semibold text-red-500 sm:px-4 sm:py-2 sm:text-xs"
          >
            <FaTrashAlt className="h-3 w-3" />
            Remove all
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-500 sm:px-4 sm:py-2 sm:text-xs">
            <FaShareAlt className="h-3 w-3" />
            Share
          </button>
        </div>
      </div>

      <div className="mb-4 sm:hidden">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-[28px] font-semibold leading-none text-slate-900">Compare</h1>
          <button
            type="button"
            onClick={() => dispatch(clearCompare())}
            className="rounded-md border border-red-400 px-3 py-2 text-[14px] font-semibold text-red-500"
          >
            Clear All
          </button>
        </div>

        <div className="rounded-md bg-[#ececec] p-3">
          <div className="grid grid-cols-2 gap-3">
            {mobileSlots.map((slot, index) => {
              const currentSuggestions = suggestions[index];

              return (
                <div key={`mobile-search-${index}`} className="relative">
                  <p className="mb-2 text-[12px] font-semibold text-slate-800">Compare with</p>
                  <div className="relative">
                    <input
                      value={queries[index]}
                      onChange={(event) =>
                        setQueries((prev) => prev.map((value, idx) => (idx === index ? event.target.value : value)))
                      }
                      placeholder={slot?.title ? slot.title : "Search product"}
                      className="h-11 w-full rounded-full border border-slate-300 bg-white px-3 pr-11 text-[12px] outline-none placeholder:text-slate-400 focus:border-[#2b7fe8]"
                    />
                    <button className="absolute right-1.5 top-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2b7fe8] text-white">
                      <FaSearch className="h-3.5 w-3.5" />
                    </button>

                    {queries[index].trim() && currentSuggestions.length > 0 && (
                      <div className="absolute top-12 z-20 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
                        {currentSuggestions.map((item) => (
                          <button
                            key={`${item.id}-mobile-${index}`}
                            type="button"
                            onClick={() => handleSetSlot(index, item)}
                            className="flex w-full items-center gap-2 border-b border-slate-100 px-3 py-2 text-left hover:bg-slate-50 last:border-b-0"
                          >
                            <Image src={item.thumbnail_image} alt={item.name} width={36} height={36} className="h-9 w-9 rounded object-cover" />
                            <span className="line-clamp-2 text-[11px] font-semibold text-slate-800">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {mobileSlots.map((slot, index) => (
            <article key={`mobile-card-${index}`} className="overflow-hidden rounded-[6px] border border-slate-300 bg-white">
              <div className="px-2.5 pt-2">
                <p className="line-clamp-1 text-[10px] leading-none text-slate-500">{slot?.type || slot?.category || ""}</p>
                <button type="button" onClick={() => dispatch(removeAtIndex(index))} className="mt-1 inline-flex items-center gap-1 text-[10px] leading-none text-red-500">
                  <FaTrashAlt className="h-2.5 w-2.5" />
                  Remove
                </button>
              </div>

              <div className="px-2.5 pt-2">
                <h3 className="line-clamp-3 min-h-[38px] text-[13px] font-semibold leading-[1.25] text-slate-900">
                  {slot?.title || "Select a product to compare"}
                </h3>
              </div>

              <div className="flex h-[118px] items-center justify-center px-2.5 py-2">
                {slot ? (
                  <Image src={slot.image} alt={slot.title} width={180} height={120} className="h-[96px] w-auto object-contain" />
                ) : (
                  <div className="h-[96px] w-full rounded bg-[#f3f3f3]" />
                )}
              </div>

              {slot ? (
                <div className="px-2.5 pb-2">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] leading-none">
                    <span className="text-[14px] font-bold text-[#0c73da]">{slot.price}</span>
                    <span className="text-slate-400 line-through">{slot.originalPrice}</span>
                    <span className="text-red-500">{slot.discountPercent}</span>
                    <span className="rounded bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">{slot.saveAmount}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => dispatch(removeAtIndex(index))}
                      className="h-6 min-w-[72px] rounded-full bg-slate-100 px-3 text-[11px] font-semibold text-slate-700"
                    >
                      Remove
                    </button>
                    <Link
                      href={`/products/${slot.slug}`}
                      className="inline-flex h-6 min-w-[80px] items-center justify-center rounded-full bg-[#2b7fe8] px-3 text-[11px] font-semibold text-white"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="px-2.5 pb-2">
                  <div className="flex items-center gap-1.5 text-[11px] leading-none text-slate-400">
                    <span className="text-[14px] font-bold">--</span>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-md border border-slate-200 bg-white">
          {universalKeys.map((key) => (
            <div key={`mobile-common-${key}`} className="border-b border-slate-200 last:border-b-0">
              <div className="bg-[#f4f4f4] px-3 py-3 text-[13px] font-semibold uppercase tracking-wide text-slate-800">{key}</div>
              <div className="grid grid-cols-2 divide-x divide-slate-200 text-[12px] text-slate-700">
                {mobileSlots.map((slot, index) => {
                  const value = slot ? (key === "Brand" ? slot.brand : key === "Category" ? slot.category : "-") : "-";
                  return (
                    <div key={`mobile-common-${key}-${index}`} className="min-h-[58px] px-3 py-3 leading-5">
                      {value}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {categorySpecific.map(([category, keys]) => (
            <div key={`mobile-category-${category}`} className="border-b border-slate-200 last:border-b-0">
              <div className="bg-[#f4f4f4] px-3 py-3 text-[13px] font-semibold uppercase tracking-wide text-slate-800">{category} Specific Attributes</div>
              {keys.map((key) => (
                <div key={`mobile-${category}-${key}`} className="border-t border-slate-200">
                  <div className="px-3 py-3 text-[13px] font-medium text-slate-800">{key}</div>
                  <div className="grid grid-cols-2 divide-x divide-slate-200 text-[12px] text-slate-700">
                    {mobileSlots.map((slot, index) => {
                      const value = slot ? (slot.specifications?.find(s => s.label === key)?.value || "-") : "-";
                      return (
                        <div key={`mobile-${category}-${key}-${index}`} className="min-h-[58px] px-3 py-3 leading-5">
                          {value}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="hidden overflow-x-auto rounded-xl border border-slate-300 bg-white sm:block">
        <div className="min-w-[360px] sm:min-w-[640px] lg:min-w-[860px] 2xl:min-w-[1080px]">
          <div className={`${compareGridClass} border-b border-slate-300`}>
            <div className="min-h-[320px] border-r border-slate-300 bg-[#efefef] p-4 sm:min-h-[340px] sm:p-6">
              <h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl">Compare Products</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
                Find and select products to see the differences and similarities between them
              </p>
            </div>

            {slots.map((slot, index) => {
              const currentSuggestions = suggestions[index];
              const slotVisibilityClass = index === 0 ? "" : index === 1 ? "hidden lg:block" : "hidden 2xl:block";
              return (
                <div key={index} className={`relative min-h-[320px] border-r border-slate-300 p-3 sm:min-h-[340px] sm:p-4 last:border-r-0 ${slotVisibilityClass}`}>
                  <div className="relative">
                    <input
                      value={queries[index]}
                      onChange={(event) =>
                        setQueries((prev) => prev.map((value, idx) => (idx === index ? event.target.value : value)))
                      }
                      placeholder="Search your favorite accessories"
                      className="h-10 w-full rounded-full border border-slate-300 px-3 pr-10 text-xs outline-none focus:border-[#2b7fe8] sm:h-11 sm:px-4 sm:pr-12 sm:text-sm"
                    />
                    <button className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#2b7fe8] text-white sm:h-8 sm:w-8">
                      <FaSearch className="h-3.5 w-3.5" />
                    </button>

                    {queries[index].trim() && currentSuggestions.length > 0 && (
                      <div className="absolute top-12 z-20 max-h-72 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
                        {currentSuggestions.map((item) => (
                          <button
                            key={`${item.id}-${index}`}
                            type="button"
                            onClick={() => handleSetSlot(index, item)}
                            className="flex w-full items-center gap-2 border-b border-slate-100 px-3 py-2 text-left hover:bg-slate-50 last:border-b-0 sm:gap-3 sm:py-2.5"
                          >
                            <Image src={item.thumbnail_image} alt={item.name} width={40} height={40} className="h-9 w-9 rounded object-cover sm:h-10 sm:w-10" />
                            <span className="line-clamp-2 text-[11px] font-semibold text-slate-800 sm:text-xs">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {slot ? (
                    <div className="mt-3 sm:mt-4">
                      <div className="flex h-[150px] items-center justify-center rounded-md bg-[#f3f3f3] sm:h-[180px]">
                        <Image src={slot.image} alt={slot.title} width={210} height={140} className="h-[120px] w-auto object-contain sm:h-[140px]" />
                      </div>

                      <h3 className="mt-3 text-sm font-semibold leading-tight text-slate-900 sm:mt-4 sm:text-lg">{slot.title}</h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:mt-3 sm:gap-3 sm:text-sm">
                        <span className="text-base font-bold text-[#0c73da] sm:text-xl">{slot.price}</span>
                        <span className="text-slate-400 line-through">{slot.originalPrice}</span>
                        <span className="text-red-500">{slot.discountPercent}</span>
                        <span className="rounded bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white sm:text-xs">{slot.saveAmount}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-2 sm:mt-4">
                        <button
                          type="button"
                          onClick={() => dispatch(removeAtIndex(index))}
                          className="h-7 min-w-[84px] rounded-full bg-slate-100 px-3 text-[11px] font-semibold text-slate-700 sm:h-8 sm:min-w-[108px] sm:px-5 sm:text-sm"
                        >
                          Remove
                        </button>
                        <Link
                          href={`/products/${slot.slug}`}
                          className="inline-flex h-7 min-w-[100px] items-center justify-center rounded-full bg-[#2b7fe8] px-3 text-[11px] font-semibold text-white sm:h-8 sm:min-w-[130px] sm:px-5 sm:text-sm"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {universalKeys.map((key) => (
            <div key={key} className={`${compareGridClass} border-b border-slate-300 text-xs sm:text-sm lg:text-base`}>
              <div className="border-r border-slate-300 bg-[#efefef] px-3 py-3 font-semibold text-slate-900 sm:px-4 sm:py-4">{key}</div>
              {slots.map((slot, index) => {
                const value = slot ? (key === "Brand" ? slot.brand : key === "Category" ? slot.category : "-") : "";
                const slotVisibilityClass = index === 0 ? "" : index === 1 ? "hidden lg:block" : "hidden 2xl:block";
                return (
                  <div key={`${key}-${index}`} className={`border-r border-slate-300 px-3 py-3 text-slate-800 last:border-r-0 sm:px-4 sm:py-4 ${slotVisibilityClass}`}>
                    {value}
                  </div>
                );
              })}
            </div>
          ))}

          {categorySpecific.map(([category, keys]) => (
            <div key={category}>
              <div className={`${compareGridClass} border-b border-slate-300 bg-[#f8f8f8] text-xs sm:text-sm`}>
                <div className="col-span-2 px-3 py-2.5 font-semibold text-slate-700 lg:col-span-3 2xl:col-span-4 sm:px-4 sm:py-3">{category} Specific Attributes</div>
              </div>

              {keys.map((key) => (
                <div key={`${category}-${key}`} className={`${compareGridClass} border-b border-slate-300 text-xs sm:text-sm lg:text-base`}>
                  <div className="border-r border-slate-300 bg-[#efefef] px-3 py-3 font-semibold text-slate-900 sm:px-4 sm:py-4">{key}</div>
                  {slots.map((slot, index) => {
                    const value = slot ? (slot.specifications?.find(s => s.label === key)?.value || "-") : "";
                    const slotVisibilityClass = index === 0 ? "" : index === 1 ? "hidden lg:block" : "hidden 2xl:block";
                    return (
                      <div key={`${category}-${key}-${index}`} className={`border-r border-slate-300 px-3 py-3 text-slate-800 last:border-r-0 sm:px-4 sm:py-4 ${slotVisibilityClass}`}>
                        {value}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

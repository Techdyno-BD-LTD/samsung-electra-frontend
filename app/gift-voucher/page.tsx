"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight, FaStar, FaTimes, FaThLarge } from "react-icons/fa";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/features/cart/cartSlice";
import { showToast } from "@/store/features/toast/toastSlice";
import Skeleton from "@/components/common/Skeleton";

interface VoucherProduct {
  id: number;
  name: string;
  slug: string;
  thumbnail_img: string;
  thumbnail: string;
  unit_price: number;
  current_stock: number;
  description: string | null;
}

export default function GiftVoucherPage() {
  const dispatch = useAppDispatch();
  const [vouchers, setVouchers] = useState<VoucherProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDenominations, setSelectedDenominations] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<string>("default");
  const [selectedVoucherForModal, setSelectedVoucherForModal] = useState<VoucherProduct | null>(null);

  useEffect(() => {
    async function loadVouchers() {
      try {
        const res = await fetch("/api/v2/gift-vouchers");
        if (res.ok) {
          const json = await res.json();
          setVouchers(json.data || []);
        }
      } catch (err) {
        console.error("Failed to load gift vouchers:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVouchers();
  }, []);

  // Extract denominations and counts for the sidebar filter
  const denominationCounts: Record<number, number> = {};
  vouchers.forEach((v) => {
    const val = Math.floor(v.unit_price);
    denominationCounts[val] = (denominationCounts[val] || 0) + 1;
  });

  const availableDenominations = Object.keys(denominationCounts)
    .map(Number)
    .sort((a, b) => b - a); // Higher value first

  const handleDenominationChange = (val: number) => {
    if (selectedDenominations.includes(val)) {
      setSelectedDenominations(selectedDenominations.filter((d) => d !== val));
    } else {
      setSelectedDenominations([...selectedDenominations, val]);
    }
  };

  const resetFilters = () => {
    setSelectedDenominations([]);
    setSortOption("default");
  };

  // Filter logic
  let filteredVouchers = vouchers;
  if (selectedDenominations.length > 0) {
    filteredVouchers = vouchers.filter((v) =>
      selectedDenominations.includes(Math.floor(v.unit_price))
    );
  }

  // Sort logic
  if (sortOption === "price-asc") {
    filteredVouchers = [...filteredVouchers].sort((a, b) => a.unit_price - b.unit_price);
  } else if (sortOption === "price-desc") {
    filteredVouchers = [...filteredVouchers].sort((a, b) => b.unit_price - a.unit_price);
  } else if (sortOption === "newest") {
    filteredVouchers = [...filteredVouchers].sort((a, b) => b.id - a.id);
  }

  const handleAddToCartClick = (voucher: VoucherProduct) => {
    dispatch(
      addToCart({
        id: `voucher-${voucher.id}`,
        productId: voucher.id,
        title: voucher.name,
        brand: "Samsung Electra",
        image: voucher.thumbnail || "/images/electrawm.png",
        price: String(voucher.unit_price),
        originalPrice: String(voucher.unit_price),
        discountPercent: "0%",
        saveAmount: "0",
        quantity: 1,
        slug: voucher.slug,
        type: "Gift Voucher",
      })
    );
    dispatch(
      showToast({
        message: `${voucher.name} has been added to your cart.`,
        type: "success",
      })
    );
    setSelectedVoucherForModal(null);
  };

  return (
    <div className="w-full py-4 space-y-6 select-none px-4 lg:px-0">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-[11px] md:text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <FaChevronRight className="w-2 h-2 text-slate-400" />
        <span className="text-slate-800 font-semibold">Gift Voucher</span>
      </nav>

      {/* Main Grid: Sidebar + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-[260px] flex-shrink-0">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Voucher Type</h2>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-6 w-full rounded" />)
              ) : availableDenominations.length === 0 ? (
                <p className="text-xs text-slate-400">No vouchers available</p>
              ) : (
                availableDenominations.map((denom) => (
                  <label
                    key={denom}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedDenominations.includes(denom)}
                        onChange={() => handleDenominationChange(denom)}
                        className="w-4.5 h-4.5 border-slate-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                        ৳{denom.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      {denominationCounts[denom]}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Content Section */}
        <div className="flex-1 space-y-6">
          {/* Header Controls */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold">
              <span>Product View :</span>
              <div className="bg-black text-white p-2 rounded-md shadow-sm">
                <FaThLarge className="text-sm" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="default">Select Sort Option</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Vouchers Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[1.8] w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4 rounded" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredVouchers.length === 0 ? (
            <div className="border-2 border-dashed border-slate-150 rounded-2xl p-16 text-center text-slate-500">
              <p className="text-base font-semibold">No vouchers match the selected criteria.</p>
              <button
                onClick={resetFilters}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  {/* Voucher Premium Gold Design Display */}
                  <div className="relative aspect-[1.8] w-full bg-slate-900 overflow-hidden flex items-center justify-center p-4">
                    {voucher.thumbnail ? (
                      <Image
                        src={voucher.thumbnail}
                        alt={voucher.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      // Gold Gradient fallback ticket card
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-between p-6">
                        <div className="flex flex-col text-slate-900">
                          <span className="text-[10px] tracking-widest font-black uppercase text-amber-900/60">
                            SAMSUNG ELECTRA
                          </span>
                          <span className="text-2xl font-black italic tracking-wide mt-2">
                            Gift Voucher
                          </span>
                          <span className="text-[9px] font-bold text-amber-900/60 mt-4">
                            THANK YOU FOR SHOPPING WITH US
                          </span>
                        </div>
                        <div className="bg-slate-950 text-amber-400 px-4 py-6 rounded-lg text-center shadow-lg border border-amber-500/30 flex flex-col justify-center min-w-[90px]">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            Value
                          </span>
                          <span className="text-lg font-black mt-1">
                            ৳{Math.floor(voucher.unit_price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                          In stock
                        </span>
                        <div className="flex items-center gap-1.5 text-amber-500">
                          <FaStar className="text-xs" />
                          <span className="text-xs font-bold text-slate-600">(3.4)</span>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                        {voucher.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => setSelectedVoucherForModal(voucher)}
                      className="w-full bg-slate-950 text-white py-3 rounded-xl text-sm font-bold tracking-wide hover:bg-blue-600 transition-all duration-200 mt-auto"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedVoucherForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col max-h-[90vh]">
            <button
              onClick={() => setSelectedVoucherForModal(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>

            {/* Modal Image display */}
            <div className="relative aspect-[1.8] w-full bg-slate-900">
              {selectedVoucherForModal.thumbnail ? (
                <Image
                  src={selectedVoucherForModal.thumbnail}
                  alt={selectedVoucherForModal.name}
                  fill
                  sizes="500px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-between p-8">
                  <div className="flex flex-col text-slate-900">
                    <span className="text-xs tracking-widest font-black uppercase text-amber-900/60">
                      SAMSUNG ELECTRA
                    </span>
                    <span className="text-3xl font-black italic tracking-wide mt-2">
                      Gift Voucher
                    </span>
                    <span className="text-[10px] font-bold text-amber-900/60 mt-6">
                      THANK YOU FOR SHOPPING WITH US
                    </span>
                  </div>
                  <div className="bg-slate-950 text-amber-400 px-5 py-8 rounded-xl text-center shadow-2xl border border-amber-500/30 flex flex-col justify-center min-w-[110px]">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      Value
                    </span>
                    <span className="text-xl font-black mt-1">
                      ৳{Math.floor(selectedVoucherForModal.unit_price).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Info & CTA */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
                  In stock
                </span>
                <span className="text-xl font-black text-blue-600">
                  ৳{selectedVoucherForModal.unit_price.toLocaleString()} BDT
                </span>
              </div>

              <h2 className="text-xl font-black text-slate-800">{selectedVoucherForModal.name}</h2>

              {selectedVoucherForModal.description && (
                <div className="text-sm text-slate-500 leading-relaxed font-medium">
                  {selectedVoucherForModal.description}
                </div>
              )}

              <button
                onClick={() => handleAddToCartClick(selectedVoucherForModal)}
                className="w-full bg-[#2b7fe8] text-white py-4 rounded-2xl text-sm font-bold tracking-wide hover:bg-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/10"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

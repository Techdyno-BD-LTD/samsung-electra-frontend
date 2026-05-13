"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { formatCurrency } from "@/lib/currencyUtils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWishlist, removeFromWishlistAsync } from "@/store/features/wishlist/wishlistSlice";
import { showToast } from "@/store/features/toast/toastSlice";
import { addToCart } from "@/store/features/cart/cartSlice";

const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (slug: string) => {
    dispatch(removeFromWishlistAsync(slug)).then((result) => {
      if (removeFromWishlistAsync.fulfilled.match(result)) {
        dispatch(showToast({
          message: "Removed from Wishlist",
          type: 'info',
        }));
      }
    });
  };

  const handleAddToCart = (item: {
    id: string;
    productId: number;
    title: string;
    brand: string;
    image: string;
    price: string | number;
    originalPrice?: string | number;
    discountLabel?: string;
    saveAmount?: string | number;
    category?: string;
  }) => {
    dispatch(addToCart({
      id: item.id,
      productId: item.productId,
      title: item.title,
      brand: item.brand,
      image: item.image,
      price: String(item.price),
      originalPrice: String(item.originalPrice || item.price),
      discountPercent: item.discountLabel || "0%",
      saveAmount: String(item.saveAmount || "0"),
      quantity: 1,
      slug: item.id,
      type: item.category || 'Product',
    }));
  };

  if (loading && items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 lg:p-20 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 flex flex-col items-center justify-center text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-600">Loading your wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 lg:p-20 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 flex flex-col items-center justify-center text-center">
        <div className="relative w-32 h-32 mb-6">
          <Image
            src="/images/shop.png"
            alt="Empty Wishlist"
            width={128}
            height={128}
            className="opacity-20 translate-y-2 grayscale"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <FiShoppingBag className="text-6xl text-blue-100" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-slate-200 rounded-full flex items-center justify-center bg-white">
              <span className="text-2xl font-bold text-slate-300">×</span>
            </div>
          </div>
        </div>
        <p className="text-slate-600 mb-2 font-medium">Wishlist is empty</p>
        <Link
          href="/shop"
          className="bg-[#2b7fe8] text-white px-10 py-3 rounded-full font-semibold transition-all hover:bg-[#1a6ed9] hover:-translate-y-0.5 mt-6"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-6 border-b border-slate-100 flex items-baseline gap-2">
          <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">My Wishlist</h2>
          <span className="text-xs text-slate-500 font-medium">({items.length < 10 ? `0${items.length}` : items.length}) Items</span>
        </div>

        <div className="p-6 lg:p-6 space-y-8">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col lg:flex-row items-center gap-8 lg:gap-8 pb-8 last:pb-0 border-b last:border-b-0 border-slate-50">
              {/* Product Image */}
              <div className="w-48 h-48 rounded-xl border border-slate-100 flex items-center justify-center p-4">
                <Image
                  src={(typeof item.image === 'string' && (item.image.startsWith('/') || item.image.startsWith('http'))) 
                    ? item.image 
                    : "/images/electrawm.png"}
                  alt={item.title}
                  width={160}
                  height={160}
                  className="object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col gap-1.5 text-center lg:text-left">
                <p className="text-[13px] text-slate-400 font-semibold uppercase tracking-wide">
                  {item.brand} | <span className="font-medium normal-case">{item.category}</span>
                </p>
                <Link href={`/products/${item.id}`} className="hover:text-[#2b7fe8] transition-colors">
                  <h4 className="text-lg lg:text-xl font-semibold text-slate-800 leading-tight">
                    {item.title}
                  </h4>
                </Link>
                {item.model && (
                  <div className="text-[13px] text-slate-500 font-medium mt-1">
                    Model : {item.model}
                  </div>
                )}
                
                <button 
                  onClick={() => handleRemove(item.id)}
                  className="flex items-center justify-center lg:justify-start gap-1.5 text-red-500 hover:text-red-600 transition-colors text-xs font-semibold mt-4"
                >
                  <FiTrash2 className="text-sm" />
                  <span>Remove</span>
                </button>
              </div>

              {/* Price & Action */}
              <div className="flex flex-col items-center lg:items-end gap-3 min-w-[200px]">
                <div className="flex flex-col items-center lg:items-end">
                  <div className="text-2xl lg:text-3xl font-semibold text-[#2b7fe8] leading-none mb-1">
                    {formatCurrency(Number(item.price))}
                  </div>
                  {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400 line-through">
                        {formatCurrency(Number(item.originalPrice))}
                      </span>
                      {item.discountLabel && (
                        <span className="text-xs font-bold text-emerald-500">
                          {item.discountLabel}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {item.saveAmount && (
                  <div className="bg-red-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-lg mb-2">
                    Save : {typeof item.saveAmount === 'number' ? formatCurrency(item.saveAmount) : item.saveAmount}
                  </div>
                )}

                <button 
                  onClick={() => handleAddToCart(item)}
                  className="bg-[#2b7fe8] text-white w-full lg:w-fit px-12 py-3 rounded-lg text-sm font-semibold hover:bg-[#1a6ed9] transition-all shadow-sm"
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FaGavel } from "react-icons/fa";
import { useAppSelector } from "@/store/hooks";
import ProductCard from "@/components/common/ProductCard";
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
interface BidItem {
  product_id: number;
  bid_amount: number;
  bid_time: string;
  product: Product | null;
}

const BidsPage = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [items, setItems] = useState<BidItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBidedProducts = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch("/api/v2/auction/bided-products", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const payload = await response.json();

      if (payload.success) {
        setItems(payload.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch bided products:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBidedProducts();
  }, [fetchBidedProducts]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
      <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl lg:text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <FaGavel className="text-[#004b91] h-5 w-5" /> My Bids
        </h2>
        <span className="text-[13px] font-medium text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
          <span className="font-semibold text-[#2B7FE8]">{items.length}</span> Items Bid On
        </span>
      </div>

      <div className="p-6 lg:p-8">
        {items.length === 0 ? (
          <div className="py-12 lg:py-20 flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 mb-6 flex items-center justify-center bg-slate-50 border-2 border-slate-100 rounded-full">
              <FaGavel className="text-6xl text-slate-300 rotate-12" />
            </div>
            <p className="text-slate-600 mb-8 max-w-sm">
              You haven&apos;t placed any bids on active auction products yet.
            </p>
            <Link
              href="/bidding"
              className="bg-[#2b7fe8] text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-[#1a6ed9] hover:-translate-y-0.5"
            >
              Browse Auctions
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {items.map((item) => {
              if (!item.product) return null;
              return (
                <ProductCard
                  key={item.product_id}
                  cardVariant="auction"
                  title={item.product.name}
                  slug={item.product.slug}
                  image={item.product.thumbnail_img}
                  brand={item.product.brand_name || item.product.brand?.name}
                  startingBid={item.product.starting_bid}
                  highestBid={item.product.highest_bid}
                  totalBids={item.product.total_bids}
                  auctionStartDate={item.product.auction_start_date}
                  auctionEndDate={item.product.auction_end_date}
                  productData={item.product as unknown as ProductData}
                  userBidAmount={item.bid_amount}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BidsPage;

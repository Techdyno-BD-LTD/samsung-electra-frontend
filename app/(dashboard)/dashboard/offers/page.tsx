"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag, FiCalendar } from "react-icons/fi";
import Skeleton from "@/components/common/Skeleton";

interface CampingOffer {
  id: number;
  title: string;
  slug: string;
  banner: string;
  start_date: number;
  end_date: number;
  created_at: string;
}

const formatUnixDate = (unix: number | null) => {
  if (!unix) return "N/A";
  const date = new Date(unix * 1000);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTimeAgo = (dateStr: string | null) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} Minute${diffInMinutes > 1 ? "s" : ""} Ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} Hour${diffInHours > 1 ? "s" : ""} Ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} Day${diffInDays > 1 ? "s" : ""} Ago`;
};

const OffersPage = () => {
  const [offers, setOffers] = useState<CampingOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch("/api/v2/camping-offers");
        const json = await res.json();
        if (json.success) {
          setOffers(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard offers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="aspect-[3/1] lg:aspect-[4/1] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 lg:p-20 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 flex flex-col items-center justify-center text-center">
        <div className="relative w-32 h-32 mb-6">
          <Image
            src="/images/shop.png"
            alt="Empty Offers"
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
        <p className="text-slate-600 mb-2 font-medium">Offer is empty</p>
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
        <div className="p-6 lg:p-6 border-b border-slate-100">
          <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">My Offers</h2>
        </div>

        <div className="p-6 lg:p-6 space-y-8">
          {offers.map((offer) => (
            <div key={offer.id} className="group">
              <Link href={`/camping/details/${offer.slug}`}>
                <div className="relative w-full aspect-[3/1] lg:aspect-[4/1] rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-transform duration-300 hover:scale-[1.01]">
                  <Image
                    src={offer.banner}
                    alt={offer.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <div className="mt-4 flex flex-col gap-1 px-2">
                <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                  <FiCalendar className="text-slate-400" />
                  <span>{formatUnixDate(offer.start_date)} - {formatUnixDate(offer.end_date)}</span>
                </div>
                <p className="text-[11px] text-slate-400 px-5">{getTimeAgo(offer.created_at)}</p>
              </div>
              <div className="h-[1px] bg-slate-50 mt-8 group-last:hidden"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersPage;

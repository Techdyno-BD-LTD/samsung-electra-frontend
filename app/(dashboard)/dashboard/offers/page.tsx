"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag, FiCalendar } from "react-icons/fi";

const OffersPage = () => {
  const offers = [
    {
      id: 1,
      image: "/images/slider01.png",
      dateRange: "22 Jan 2026 - 22 Feb 2026",
      timeAgo: "2 Hour Ago"
    },
    {
      id: 2,
      image: "/images/slider02.png", // Assuming slider02 exists as seen in previous list_dir
      dateRange: "22 Jan 2026 - 22 Feb 2026",
      timeAgo: "2 Hour Ago"
    }
  ];

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
              <div className="relative w-full aspect-[3/1] lg:aspect-[4/1] rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-transform duration-300 hover:scale-[1.01]">
                <Image
                  src={offer.image}
                  alt="Offer Banner"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 flex flex-col gap-1 px-2">
                <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                  <FiCalendar className="text-slate-400" />
                  <span>{offer.dateRange}</span>
                </div>
                <p className="text-[11px] text-slate-400 px-5">{offer.timeAgo}</p>
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

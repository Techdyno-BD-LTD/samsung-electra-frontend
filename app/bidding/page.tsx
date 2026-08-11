'use client';

import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi2";
import { FaGavel } from "react-icons/fa";
import AuctionFilterPanel from "@/components/auction/AuctionFilterPanel";
import AuctionProductGrid from "@/components/auction/AuctionProductGrid";
import AuctionFAQ from "@/components/auction/AuctionFAQ";

export default function BiddingPage() {
  return (
    <div className="lg:mt-16  mx-auto px-4">
      {/* ═══════════════ MOBILE NAVIGATION (Hidden on Desktop) ═══════════════ */}
      <div className="mb-4 lg:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <HiChevronLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* ═══════════════ BREADCRUMB (Hidden on Mobile) ═══════════════ */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 hidden items-center gap-2 text-[12px] leading-none text-slate-500 lg:flex lg:text-sm"
      >
        <Link href="/" className="transition hover:text-blue-600">
          Home
        </Link>
        <span className="text-slate-400">›</span>
        <span className="text-slate-700 font-medium">Bidding Products</span>
      </nav>

      {/* ═══════════════ MAIN LAYOUT ═══════════════ */}
      <div className="flex flex-col gap-4 lg:grid lg:items-stretch lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">
        {/* Desktop Sidebar (Left side metadata summary) */}
        <div className="hidden lg:flex lg:flex-col">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Auctions</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Place bids on premium appliances. Win high-quality electronics directly from our verified stock at competitive prices.
            </p>
          </div>
        </div>

        {/* Hero banner */}
        <div className="min-w-0">
          <div className="relative w-full rounded-2xl overflow-hidden h-[160px] md:h-[200px] bg-gradient-to-r from-blue-600 to-indigo-900 flex items-center justify-between px-8 md:px-16 text-white shadow-sm">
            <div>
              <span className="bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Live Auctions
              </span>
              <h1 className="text-xl md:text-3xl font-extrabold mt-2">Bidding & Bids Panel</h1>
              <p className="text-xs md:text-sm text-blue-100/80 mt-1 max-w-lg">
                Exclusive prices on active items. Starting prices and current maximum bids are listed below.
              </p>
            </div>
            <div className="absolute right-10 bottom-0 opacity-10 pointer-events-none transform translate-y-2">
              <FaGavel className="w-36 h-36 text-white rotate-12" />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ FILTER + PRODUCTS SECTION ═══════════════ */}
      <div className="mt-4 lg:mt-6 flex gap-[1%]">
        {/* Desktop Filter panel — 24% width (Hidden on Mobile) */}
        <aside className="hidden w-[24%] shrink-0 lg:block">
          <AuctionFilterPanel />
        </aside>

        {/* Product grid — takes remaining space */}
        <div className="min-w-0 flex-1 lg:w-[73%]">
          <AuctionProductGrid />
        </div>
      </div>

      {/* Auction FAQ section */}
      <div className="mt-8 lg:mt-0">
        <AuctionFAQ auctionName="Auctions" />
      </div>
    </div>
  );
}

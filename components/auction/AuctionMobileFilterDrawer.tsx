"use client";

import React, { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import AuctionFilterPanel from "./AuctionFilterPanel";

interface AuctionMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filteringAttributes?: { 
    id: number; 
    name: string; 
    values: { id: number; name: string; code?: string }[] 
  }[];
}

const AuctionMobileFilterDrawer: React.FC<AuctionMobileFilterDrawerProps> = ({ isOpen, onClose, filteringAttributes }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-[70] h-full w-[80%] bg-slate-50 shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between bg-white px-4 py-4 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">Filters</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <HiOutlineXMark className="h-6 w-6" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
            <AuctionFilterPanel filteringAttributes={filteringAttributes} />
          </div>

          {/* Footer / Apply Button */}
          <div className="bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-[#2B7FE8] py-3 text-lg font-bold text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionMobileFilterDrawer;

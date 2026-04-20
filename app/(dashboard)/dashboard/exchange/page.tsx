"use client";

import React from "react";
import Image from "next/image";
import { FiShoppingBag } from "react-icons/fi";

const ExchangeProductPage = () => {

  const categories = [
    { name: "Refrigerator", image: "/images/electrafridge.png" },
    { name: "Washing Machine", image: "/images/electrawm.png" },
    { name: "Deep Freezer", image: "/images/electradeep.png" },
    { name: "LED TV", image: "/images/electratv.png" }
  ];

  return (
    <div className="flex flex-col gap-6 ">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-8 border-slate-100">
          <h2 className="text-xl lg:text-xl font-semibold text-slate-800 mb-6">Select below what you want to exchange.</h2>
          
          {/* Product Category Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <div key={i} className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-between group cursor-pointer transition-all hover:shadow-md hover:bg-white hover:-translate-y-1">
                <div className="relative w-full aspect-square mb-4">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 text-center">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State / Application Section */}
        <div className="p-12 lg:p-20 border-t border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 mb-6">
            <Image
              src="/images/shop.png"
              alt="Empty Exchange"
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
          <p className="text-slate-500 mb-8 font-medium">
             You have not listed any exchange item.
          </p>
          <button className="bg-[#2b7fe8] text-white px-10 py-3.5 rounded-full font-bold transition-all hover:bg-[#1a6ed9] hover:-translate-y-0.5 shadow-md">
             Apply for Exchange product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExchangeProductPage;

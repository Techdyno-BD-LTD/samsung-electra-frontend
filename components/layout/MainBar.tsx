"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { useAppSelector } from "@/store/hooks";

export default function MainBar() {
  const [mounted, setMounted] = useState(false);
  const cartTotalCount = useAppSelector((state) => 
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="bg-white border-b h-[4.75rem]  flex items-center border-slate-200">
      <div className="mainwidth">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/electralogo.webp"
              alt="SAMSUNG electra"
              width={283}
              height={48}
              className="h-8 md:h-10 lg:h-12 w-auto"
            />

          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl mx-8">
            <div className="relative flex items-stretch h-12 overflow-hidden border-2 border-[#0054A6] rounded-lg">
              {/* Category Select Section */}
              <div className="flex items-center bg-white border-r border-[#0054A6]">
                <select className="px-4 bg-transparent text-sm font-semibold text-[#002B5B] focus:outline-none cursor-pointer appearance-none">
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Mobile</option>
                  <option>TV</option>
                  <option>Appliances</option>
                </select>
                {/* Optional: Add a custom chevron icon here if you want to match the image's arrow */}
              </div>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search For Products Brand And More..."
                className="flex-1 px-4 py-2 text-sm text-slate-400 focus:outline-none"
              />

              {/* Search Button - Full Height Blue Background */}
              <button className="flex items-center justify-center w-14 bg-[#0054A6] text-white hover:bg-blue-800 transition-colors">
                <FaSearch className="h-5 w-5" />
              </button>
            </div>
          </div>




          {/* Action Buttons */}
         <div className="flex items-center gap-8">
  {/* Wishlist */}
  <button className="flex items-center gap-3 tracking-tight font-medium text-[#001e3c] hover:opacity-80 transition">
    <Image
      src="/images/heart.png"
      alt="Wishlist"
      width={20}
      height={20}
      quality={100} 
      priority // Ensures it loads immediately without compression artifacts
    />
    <span className="text-base">Wishlist</span>
  </button>

  {/* Compare */}
  <button className="flex items-center gap-3 tracking-tight font-medium text-[#001e3c] hover:opacity-80 transition">
    <Image
      src="/images/compare.png"
      alt="Compare"
      width={20}
      height={20}
      quality={100}
      priority
    />
    <span className="text-base">Compare</span>
  </button>

  {/* Cart with Badge */}
  <Link href="/cart" className="relative flex items-center gap-3 tracking-tight font-medium text-[#001e3c] hover:opacity-80 transition">
    <div className="relative flex items-center justify-center">
      <Image
        src="/images/shopping-cart.png"
        alt="Cart"
        width={24}
        height={24}
        quality={100}
        priority
      />
      {mounted && cartTotalCount > 0 && (
        <span className="absolute -top-1.5 -right-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#ef4444] text-[9px] font-bold text-white border-2 border-white leading-none">
          {cartTotalCount < 10 ? `0${cartTotalCount}` : cartTotalCount}
        </span>
      )}
    </div>
    <span className="text-base">Cart</span>
  </Link>

  {/* Login Button */}
  <button className="flex items-center gap-2 rounded-[5px] bg-[#2b85ff] px-5 py-2.5 text-white shadow-sm hover:bg-blue-600 transition">
    <Image
      src="/images/loginavatar.png"
      alt="Login"
      width={18}
      height={18}
      quality={100}
      priority
      className="brightness-0 invert"
    />
    <span className="text-[15px] font-medium">Login</span>
  </button>
</div>
        </div>
      </div>
    </div>
  );
}

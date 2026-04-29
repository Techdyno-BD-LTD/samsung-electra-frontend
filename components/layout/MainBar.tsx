"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/lib/productSearchCatalog";
import { logout } from "@/store/features/auth/authSlice";

export default function MainBar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const cartTotalCount = useAppSelector((state) => 
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );
  const wishlistTotalCount = useAppSelector((state) => state.wishlist.items.length);
  const compareTotalCount = useAppSelector((state) => state.compare.slots.filter(Boolean).length);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let mountedFlag = true;

    async function loadHeader() {
      try {
        const response = await fetch("/api/header", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json();
        if (mountedFlag) {
          setLogoUrl(payload?.data?.logo?.url?.trim() || null);
        }
      } catch {
        if (mountedFlag) setLogoUrl(null);
      }
    }

    loadHeader();
    return () => {
      mountedFlag = false;
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(`/api/products/search?name=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const payload = await response.json();
          setSuggestions(payload.data?.slice(0, 7) || []);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="bg-white border-b h-[4.75rem]  flex items-center border-slate-200">
      <div className="mainwidth">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          {logoUrl ? (
            <Link href="/" className="flex items-center">
              <Image
                src={logoUrl}
                alt="SAMSUNG electra"
                width={283}
                height={48}
                className="h-8 md:h-10 lg:h-12 w-auto"
              />
            </Link>
          ) : null}

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl mx-8">
            <div className="relative">
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
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="flex-1 px-4 py-2 text-sm text-slate-400 focus:outline-none"
              />

              {/* Search Button - Full Height Blue Background */}
              <button onClick={handleSearch} className="flex items-center justify-center w-14 bg-[#0054A6] text-white hover:bg-blue-800 transition-colors">
                <FaSearch className="h-5 w-5" />
              </button>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-[52px] z-40 max-h-80 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug || item.id}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center gap-3 border-b border-slate-100 px-3 py-2.5 hover:bg-slate-50 last:border-b-0"
                    >
                      <Image src={item.thumbnail_image || item.image} alt={item.name || item.title} width={42} height={42} className="h-10 w-10 rounded object-cover" />
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-xs font-semibold text-slate-800">{item.name || item.title}</p>
                        <p className="line-clamp-1 text-[11px] text-slate-500">{item.category_name || item.category || "Product"}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>




          {/* Action Buttons */}
         <div className="flex items-center gap-8">
  {/* Wishlist */}
  <Link href="/wishlist" className="relative flex items-center gap-3 tracking-tight font-medium text-[#001e3c] hover:opacity-80 transition">
    <div className="relative flex items-center justify-center">
      <Image
        src="/images/heart.png"
        alt="Wishlist"
        width={20}
        height={20}
        quality={100}
        priority
      />
      {mounted && wishlistTotalCount > 0 && (
        <span className="absolute -top-1.5 -right-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#ef4444] text-[9px] font-bold text-white border-2 border-white leading-none">
          {wishlistTotalCount < 10 ? `0${wishlistTotalCount}` : wishlistTotalCount}
        </span>
      )}
    </div>
    <span className="text-base">Wishlist</span>
  </Link>

  {/* Compare */}
  <Link href="/compare" className="relative flex items-center gap-3 tracking-tight font-medium text-[#001e3c] hover:opacity-80 transition">
    <div className="relative flex items-center justify-center">
      <Image
        src="/images/compare.png"
        alt="Compare"
        width={20}
        height={20}
        quality={100}
        priority
      />
      {mounted && compareTotalCount > 0 && (
        <span className="absolute -top-1.5 -right-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#ef4444] text-[9px] font-bold text-white border-2 border-white leading-none">
          {compareTotalCount < 10 ? `0${compareTotalCount}` : compareTotalCount}
        </span>
      )}
    </div>
    <span className="text-base">Compare</span>
  </Link>

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

  {/* Login / Profile Dropdown */}
  {mounted && (
    isAuthenticated ? (
      <div className="group relative">
        <button className="flex items-center gap-2 rounded-full border-2 border-gray-100 p-0.5 hover:border-[#2b85ff] transition-all duration-300">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-50">
            <Image
              src={user?.avatar || "/images/loginavatar.png"}
              alt="User"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        </button>
        
        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 min-w-[200px] overflow-hidden py-2">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Welcome</p>
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
            </div>
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#2b85ff] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    ) : (
      <Link href="/login" className="flex items-center gap-2 rounded-[5px] bg-[#2b85ff] px-5 py-2.5 text-white shadow-sm hover:bg-blue-600 transition">
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
      </Link>
    )
  )}
</div>
        </div>
      </div>
    </div>
  );
}

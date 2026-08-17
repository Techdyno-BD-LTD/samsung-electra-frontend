"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaUser, FaTimes } from "react-icons/fa";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { BiGitCompare } from "react-icons/bi";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";

import { logout } from "@/store/features/auth/authSlice";
import { removeFromCart } from "@/store/features/cart/cartSlice";
import { clearWishlist } from "@/store/features/wishlist/wishlistSlice";

export default function MainBar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartTotalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.toString().replace(/[^0-9.-]+/g, "")) || 0;
    return total + (price * item.quantity);
  }, 0);
  const wishlistTotalCount = useAppSelector((state) => state.wishlist.items.length);
  const compareTotalCount = useAppSelector((state) => state.compare.slots.filter(Boolean).length);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [suggestions, setSuggestions] = useState<unknown[]>([]);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);

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
      try {
        const response = await fetch(`/api/products/search?name=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const payload = await response.json();
          setSuggestions(payload.data?.slice(0, 7) || []);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
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
    dispatch(clearWishlist());
    router.push("/login");
  };

  return (
    <div className="bg-black   flex items-center ">
      <div className="lg:w-10/12 w-full mx-auto">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          {logoUrl ? (
            <Link href="/" className="flex items-center">
              <Image
                src={logoUrl}
                alt="SAMSUNG electra"
                width={283}
                height={48}
                className="h-8 md:h-10 lg:h-8 w-auto"
              />
            </Link>
          ) : null}

          {/* Search Bar */}
          <div className="flex-1 max-w-[620px] mx-8">
            <div className="relative">
              <div className="relative flex items-stretch h-12 border-2 border-[#0054A6] rounded-lg">
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
                className="flex-1 px-4 py-2 text-sm text-slate-800 bg-white focus:outline-none rounded-l-lg"
              />

              {/* Search Button - Full Height Blue Background */}
              <button onClick={handleSearch} className="flex items-center justify-center w-14 bg-[#266BF9] text-white hover:bg-blue-800 transition-colors rounded-r-md">
                <FaSearch className="h-5 w-5" />
              </button>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-[52px] z-40 max-h-80 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
                  {(suggestions as { id: number | string; slug?: string; name?: string; title?: string; thumbnail_image?: string; image?: string; category_name?: string; category?: { name?: string } }[]).map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug || item.id}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center gap-3 border-b border-slate-100 px-3 py-2.5 hover:bg-slate-50 last:border-b-0"
                    >
                      <Image src={item.thumbnail_image || item.image || "/images/wm2.png"} alt={item.name || item.title || "Product"} width={42} height={42} className="h-10 w-10 rounded object-cover" />
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-xs font-semibold text-slate-800">{item.name || item.title}</p>
                        <p className="line-clamp-1 text-[11px] text-slate-500">{item.category_name || item.category?.name || "Product"}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative flex items-center gap-3 tracking-tight font-medium text-[#ffffff] hover:opacity-80 transition">
              <div className="relative flex items-center justify-center">
                <FiHeart className="w-6 h-6 text-[#2b85ff]" />
                {mounted && wishlistTotalCount > 0 && (
                  <span className="absolute -top-4 -right-4 flex h-[18px] w-[18px] items-center justify-center text-[18px] font-base tracking-wider text-[#F7941D]  leading-none">
                    {wishlistTotalCount < 10 ? `0${wishlistTotalCount}` : wishlistTotalCount}
                  </span>
                )}
              </div>
              <span className="text-sm tracking-wide">Wishlist</span>
            </Link>

            {/* Compare */}
            <Link href="/compare" className="relative flex items-center gap-2 tracking-tight font-medium text-[#ffffff] hover:opacity-80 transition">
              <div className="relative flex items-center justify-center">
                <BiGitCompare className="w-6 h-6 text-[#2b85ff]" />
                {mounted && compareTotalCount > 0 && (
                  <span className="absolute -top-4 -right-4 flex h-[18px] w-[18px] items-center justify-center text-[18px] font-base tracking-wider text-[#F7941D]  leading-none">
                    {compareTotalCount < 10 ? `0${compareTotalCount}` : compareTotalCount}
                  </span>
                )}
              </div>
              <span className="text-sm tracking-wide">Compare</span>
            </Link>

            {/* Cart with Dropdown */}
            <div className="relative group/cart-nav">
              <button
                onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
                className="relative flex items-center gap-2 tracking-tight font-medium mr-2 text-[#ffffff] hover:opacity-80 transition"
              >
                <div className="relative flex items-center justify-center">
                  <FiShoppingCart className="w-6 h-6 text-[#2b85ff]" />
                  {mounted && cartTotalCount > 0 && (
                    <span className="absolute -top-4 -right-4 flex h-[18px] w-[18px] items-center justify-center text-[18px] font-base tracking-wider text-[#F7941D]  leading-none">
                      {cartTotalCount < 10 ? `0${cartTotalCount}` : cartTotalCount}
                    </span>
                  )}
                </div>
                <span className="text-sm tracking-wide">Cart</span>
              </button>

              {isCartDropdownOpen && (
                <>
                  {/* Backdrop for mobile or just to close on click outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsCartDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-[350px] bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
            <h3 className="font-bold text-[#001E3C] text-[15px]">Cart Items</h3>
            <button 
              onClick={() => setIsCartDropdownOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Items List */}
          <div className="max-h-[300px] overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors group/item">
                  <div className="relative w-16 h-20 flex-shrink-0 bg-white border border-slate-100 rounded p-1">
                    <Image
                      src={item.image || "/images/wm2.png"}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-[13px] font-bold text-[#001E3C] line-clamp-2 leading-tight mb-1">{item.title}</h4>
                    <p className="text-[13px] text-slate-500 font-medium">
                      {item.quantity}x ৳{item.price.toString().replace(/[^0-9,.]+/g, "")}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFromCart(item.id));
                    }}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <FaTimes className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-300 mb-3">
                  <Image src="/images/shopping-cart.png" alt="Empty" width={24} height={24} className="opacity-20" />
                </div>
                <p className="text-sm font-medium text-slate-500">Your cart is empty</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[15px] font-medium text-slate-600">Subtotal</span>
                <span className="text-[16px] font-bold text-[#001E3C]">৳{cartSubtotal.toLocaleString()}</span>
              </div>
              <Link
                href="/cart"
                onClick={() => setIsCartDropdownOpen(false)}
                className="flex items-center justify-center w-full h-11 bg-[#0054A6] text-white font-bold rounded hover:bg-blue-800 transition-all active:scale-[0.98]"
              >
                View cart
              </Link>
            </div>
          )}
        </div>
      </>
    )}
  </div>

  {/* Login / Profile Dropdown */}
  {mounted && (
    isAuthenticated ? (
      <div className="group relative">
        <button className="flex items-center gap-2 rounded-full border-2 border-gray-100 p-0.5 hover:border-[#2b85ff] transition-all duration-300">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-50 bg-slate-50 flex items-center justify-center">
            {(typeof user?.avatar_original === 'string' && (user.avatar_original.startsWith('/') || user.avatar_original.startsWith('http'))) ||
            (typeof user?.avatar === 'string' && (user.avatar.startsWith('/') || user.avatar.startsWith('http'))) ? (
              <Image
                src={(typeof user?.avatar_original === 'string' && (user.avatar_original.startsWith('/') || user.avatar_original.startsWith('http')))
                  ? user.avatar_original
                  : user?.avatar || ''}
                alt="User"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <FaUser className="text-slate-400 text-lg" />
            )}
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

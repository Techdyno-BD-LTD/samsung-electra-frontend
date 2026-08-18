"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {  
  FaBars,    
} from "react-icons/fa";
import { useAppSelector } from "@/store/hooks";

type HeaderNavItem = {
  id: number;
  title: string;
  link: string;
  external_link: string | null;
  children?: Array<{ id: number; title: string; link: string; external_link: string | null }>;
};

type HeaderResponse = {
  data?: {
    logo?: { url?: string | null };
    topbar?: {
      support_text?: string | null;
      utility_links?: Array<{ id: number; title: string; link: string; external_link: string | null; icon: string | null }>;
    };
    navigation?: HeaderNavItem[];
  };
  success: boolean;
  status: number;
};

type NavItem = {
  title: string;
  href: string;
  hasDropdown: boolean;
  items: Array<{ name: string; href: string }>;
};

export default function MobileNavbar() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [supportText, setSupportText] = useState<string | null>(null);
  const [utilityLinks, setUtilityLinks] = useState<Array<{ id: number; title: string; link: string; external_link: string | null; icon: string | null }>>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<{
    facebook?: string | null;
    instagram?: string | null;
    youtube?: string | null;
    linkedin?: string | null;
    whatsapp?: string | null;
  }>({});
  const cartTotalCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const [orderId, setOrderId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const wishlistItemCount = useAppSelector((state) => state.wishlist.items.length);
  const compareCount = useAppSelector((state) => state.compare.slots.filter(Boolean).length);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchCategories, setSearchCategories] = useState<any[]>([]);
  
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    if (isSearchOpen) {
      document.documentElement.classList.add("mobile-search-open");
    } else {
      document.documentElement.classList.remove("mobile-search-open");
    }
    return () => {
      document.documentElement.classList.remove("mobile-search-open");
    };
  }, [isSearchOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products/search?name=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const payload = await response.json();
          setSearchResults(payload.data || []);
        }
      } catch (error) {
        console.error("Error searching products:", error);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function loadTrendingCategories() {
      try {
        const res = await fetch("/api/categories/random");
        if (res.ok) {
          const json = await res.json();
          setSearchCategories(json.data || []);
        }
      } catch (err) {
        console.error("Failed to load search categories:", err);
      }
    }
    loadTrendingCategories();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadHeader() {
      try {
        const [headerRes, brandsRes, footerRes] = await Promise.all([
          fetch("/api/header", { cache: "no-store" }),
          fetch("/api/brands"),
          fetch("/api/footer-settings").catch(() => null)
        ]);

        if (footerRes && footerRes.ok) {
          const footerJson = await footerRes.json();
          const fd = footerJson.data;
          setSocialLinks({
            facebook: fd?.facebook_link,
            instagram: fd?.instagram_link,
            youtube: fd?.youtube_link,
            linkedin: fd?.linkedin_link,
            whatsapp: fd?.whatsapp_link,
          });
        }

        let fetchedBrands: Array<{ name: string; slug: string }> = [];
        if (brandsRes.ok) {
          const brandsJson = await brandsRes.json();
          fetchedBrands = brandsJson.data || [];
        }

        if (!headerRes.ok) return;

        const payload = (await headerRes.json()) as HeaderResponse;
        const header = payload.data;

        if (!header || !isMounted) return;

        setLogoUrl(header.logo?.url?.trim() || null);
        setSupportText(header.topbar?.support_text?.trim() || null);
        setUtilityLinks((header.topbar?.utility_links || []).filter((item) => item.title.trim() || item.link.trim() || Boolean(item.icon?.trim())));

        const items = (header.navigation ?? [])
          .map((item) => {
            const title = item.title?.trim() || "";
            const isOurBrands = title.toLowerCase() === "our brands";

            const subItems = isOurBrands
              ? fetchedBrands.map((b) => ({
                  name: b.name,
                  href: `/brand/${b.slug}`,
                }))
              : (item.children ?? [])
                  .map((child) => ({
                    name: child.title?.trim() || "",
                    href: child.link?.trim() || "",
                  }))
                  .filter((child) => child.name || child.href);

            return {
              title,
              href: item.link?.trim() || "",
              hasDropdown: subItems.length > 0,
              items: subItems,
            };
          })
          .filter((item) => item.title || item.href || item.hasDropdown);

        setNavItems(items);
      } catch (err) {
        console.error("Failed to load mobile header/brands:", err);
        if (isMounted) {
          setLogoUrl(null);
          setSupportText(null);
          setUtilityLinks([]);
          setNavItems([]);
        }
      }
    }

    loadHeader();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] bg-white/70 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#2B7FE8] border-t-transparent"></div>
          <p className="text-slate-600 text-sm font-semibold mt-3">Loading product details...</p>
        </div>
      )}
      <div className="lg:hidden bg-black border-none relative">
        <div className="flex items-center justify-between px-4 py-2.5 bg-black select-none">
          {/* Left: Hamburger menu */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-slate-200 transition-all" 
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            ) : (
              <FaBars size={15} />
            )}
          </button>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            {logoUrl ? (
              <Link href="/" className="flex items-center justify-center">
                <Image src={logoUrl} alt="SAMSUNG electra" width={150} height={26} className="h-6 w-auto object-contain" />
              </Link>
            ) : (
              <div className="h-6" />
            )}
          </div>

           {/* Right: Search and Cart buttons */}
          <div className="flex items-center gap-2.5">
            {/* Search circular button */}
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-slate-200 transition-all" 
              aria-label="Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart circular button */}
            <Link 
              href="/cart" 
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#1e40af] text-white hover:bg-blue-800 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {mounted && cartTotalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white border border-white">
                  {cartTotalCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Slide-out Menu Overlay */}
      <div className={`fixed inset-y-0 right-0 z-[1000] w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col min-h-full">
          {/* Header block replicating the main black header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-black select-none">
            <button 
              onClick={() => setIsOpen(false)} 
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-slate-200 transition-all" 
              aria-label="Close menu"
            >
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex-1 flex justify-center">
              {logoUrl ? (
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center justify-center">
                  <Image src={logoUrl} alt="SAMSUNG electra" width={150} height={26} className="h-6 w-auto object-contain" />
                </Link>
              ) : (
                <div className="h-6" />
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsSearchOpen(true);
                }} 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-slate-200 transition-all" 
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <Link 
                href="/cart" 
                onClick={() => setIsOpen(false)}
                className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#1e40af] text-white hover:bg-blue-800 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                {mounted && cartTotalCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white border border-white">
                    {cartTotalCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Login notification banner */}
          <div className="bg-[#2B7FE8] text-white px-4 py-3 flex items-center justify-between gap-4 select-none">
            <p className="text-[12px] font-medium leading-tight flex-1">
              Log in to unlock your personalized experience and exclusive savings.
            </p>
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)} 
              className="shrink-0 px-4 py-1.5 border border-white text-white font-semibold text-xs rounded-lg hover:bg-white hover:text-[#2B7FE8] transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Track Your Order Form */}
          <div className="p-4 bg-white select-none">
            <h3 className="text-[16px] font-bold text-slate-800">Track Your Order</h3>
            <p className="text-[12px] text-slate-500 mb-4">Provide your Order ID & Phone Number</p>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {/* Order ID field */}
              <div className="relative border border-slate-300 rounded-lg px-3 py-2 bg-white">
                <span className="absolute -top-2 left-2.5 bg-white px-1 text-[10px] font-medium text-slate-400">Order ID <span className="text-red-500">*</span></span>
                <input 
                  type="text" 
                  placeholder="Enter Order ID" 
                  value={orderId} 
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full text-sm outline-none text-slate-800 placeholder-slate-400 bg-transparent mt-1" 
                />
              </div>

              {/* Phone number field */}
              <div className="relative border border-slate-300 rounded-lg px-3 py-2 bg-white flex items-center gap-2">
                <span className="absolute -top-2 left-2.5 bg-white px-1 text-[10px] font-medium text-slate-400">Phone Number (Billing/Shipping) <span className="text-red-500">*</span></span>
                <div className="flex items-center gap-1.5 text-sm text-slate-700 font-semibold mt-1">
                  <span>🇧🇩</span>
                  <span>+880</span>
                  <span className="text-gray-300 font-light">|</span>
                </div>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full text-sm outline-none text-slate-800 bg-transparent mt-1" 
                />
              </div>

              {/* Track button */}
              <button 
                type="submit" 
                className="w-full bg-[#2B7FE8] hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Track Order</span>
              </button>
            </form>
          </div>

          {/* Inline Action Row */}
          <div className="grid grid-cols-3 gap-2 px-4 py-3 bg-white border-b border-slate-100 select-none">
            <Link 
              href="/stores" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 px-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Store Locations</span>
            </Link>
            <Link 
              href="/compare" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 px-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Compare</span>
            </Link>
            <Link 
              href="/wishlist" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 px-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Wishlist <span className="text-orange-500">{wishlistItemCount}</span></span>
            </Link>
          </div>

          {/* Navigation Pill List */}
          <div className="flex-1 px-4 py-4 space-y-2.5 bg-white select-none">
            {[
              { 
                title: "About Us", 
                href: "/about", 
                icon: (
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) 
              },
              { 
                title: "Brands", 
                href: "/mobile-categories?tab=brands", 
                icon: (
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                  </svg>
                ) 
              },
              { 
                title: "Campaign", 
                href: "/offers", 
                icon: (
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L15 9m4-3a3 3 0 11-6 0 3 3 0 016 0zm-6 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) 
              },
              { 
                title: "Gift Voucher", 
                href: "/gift-voucher", 
                icon: (
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                ) 
              },
              { 
                title: "Higher Sales/ Kisti", 
                href: "/higher-sale", 
                icon: (
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ) 
              },
              { 
                title: "EMI Bank List", 
                href: "/emi-bank-list", 
                icon: (
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ) 
              },
              { 
                title: "Exchange Product", 
                href: "/exchange-products", 
                icon: (
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.79" />
                  </svg>
                ) 
              },
              { 
                title: "B2B / Dealership", 
                href: "/b2b", 
                icon: (
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                ) 
              }
            ].map((item, idx) => {
              const actualHref = item.title === "Brands" ? "/mobile-categories" : item.href;
              const handleClick = () => {
                setIsOpen(false);
              };

              return (
                <Link
                  key={idx}
                  href={actualHref}
                  onClick={handleClick}
                  className="flex items-center justify-between px-4 py-1 bg-[#F0F4FF] hover:bg-[#e1ecff] rounded-xl text-slate-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-[14px] font-semibold text-slate-800">{item.title}</span>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>

          {/* Support Banner Info */}
          {supportText && (
            <div className="flex items-center gap-3 p-4 bg-white border-t border-slate-100 select-none">
              <svg className="w-8 h-8 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                {/* Phone receiver */}
                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.04 15.04 0 01-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02A11.36 11.36 0 018.5 4c0-.56-.44-1-1-1H4c-.56 0-1 .44-1 1 0 9.39 7.61 17 17 17 .56 0 1-.44 1-1v-3.5c0-.56-.44-1-1-1z" />
                {/* Left-pointing arrow */}
                <path d="M19 8h-6m0 0l2.5-2.5M13 8l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <div className="text-left text-xs font-semibold text-slate-800 leading-tight">
                <p>Need Online help?</p>
                <p className="text-slate-500 font-medium mt-0.5">{supportText}</p>
              </div>
            </div>
          )}

          {/* Social Follow Us block */}
          {(socialLinks.facebook || socialLinks.instagram || socialLinks.youtube || socialLinks.linkedin || socialLinks.whatsapp) && (
            <div className="border-t border-slate-200 p-4 flex gap-3 items-center justify-center text-center bg-white select-none">
              <p className="text-sm font-semibold items text-slate-800 ">Follow Us</p>
              <div className="flex justify-center gap-3">
                {[
                  { 
                    icon: (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8H7v3h2v9h3v-9h3.6l.4-3H12V6c0-.9.2-1.2 1.1-1.2H15V1h-2.9C9.7 1 9 2.2 9 4.8V8z" />
                      </svg>
                    ), 
                    href: socialLinks.facebook || undefined, 
                    color: "text-slate-500 border-slate-300 hover:text-[#2563EB] hover:border-[#2563EB] hover:bg-blue-50" 
                  },
                  { 
                    icon: (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                      </svg>
                    ), 
                    href: socialLinks.instagram || undefined, 
                    color: "text-slate-500 border-slate-300 hover:text-[#E1306C] hover:border-[#E1306C] hover:bg-pink-50" 
                  },
                  { 
                    icon: (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 00-1.95 1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 15.02l5.75-3.02-5.75-3z" />
                      </svg>
                    ), 
                    href: socialLinks.youtube || undefined, 
                    color: "text-slate-500 border-slate-300 hover:text-[#FF0000] hover:border-[#FF0000] hover:bg-red-50" 
                  },
                  { 
                    icon: (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    ), 
                    href: socialLinks.linkedin || undefined, 
                    color: "text-slate-500 border-slate-300 hover:text-[#0077B5] hover:border-[#0077B5] hover:bg-blue-50" 
                  }
                ].map((soc, sIdx) => {
                  if (!soc.href) return null;
                  return (
                    <a 
                      key={sIdx} 
                      href={soc.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${soc.color}`}
                    >
                      {soc.icon}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-x-0 top-0 bottom-[53px] z-[998] bg-white flex flex-col lg:hidden">
          {/* Header block replicating the main black header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-black select-none">
            <button 
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-slate-200 transition-all" 
              aria-label="Back to home"
            >
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex-1 flex justify-center">
              <span className="text-white text-lg font-bold">Search</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Link 
                href="/cart" 
                onClick={() => setIsSearchOpen(false)}
                className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#1e40af] text-white hover:bg-blue-800 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                {mounted && cartTotalCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white border border-white">
                    {cartTotalCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Quick tab suggestions */}
          <div className="flex items-center gap-2 px-4 py-4 overflow-x-auto select-none no-scrollbar border-b border-slate-100 min-h-[58px]">
            {["Refrigerator", "Freezer", "Smart TV", "Dishwasher"].map((tab) => {
              const isSelected = searchQuery.toLowerCase() === tab.toLowerCase();
              return (
                <button
                  key={tab}
                  onClick={() => setSearchQuery(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                    isSelected 
                      ? "bg-[#2B7FE8] text-white border-[#2B7FE8]" 
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search Input Bar */}
          <div className="p-4 bg-white select-none">
            <div className="relative flex items-center border border-slate-300 rounded-full px-4 py-2.5 bg-white shadow-sm">
              <svg className="w-4 h-4 text-slate-400 mr-2.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search For Products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none text-slate-800 placeholder-slate-400 bg-transparent"
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="flex items-center justify-center w-5 h-5 rounded-full bg-[#2B7FE8] text-white hover:bg-blue-600 ml-2"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Live Search Results */}
          {searchQuery.trim() && (
            <div className="flex-1 px-4 py-2 bg-white overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsNavigating(true);
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        router.push(`/products/${product.slug}`);
                      }}
                      className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
                    >
                      {product.thumbnail_image ? (
                        <div className="relative w-12 h-12 flex-shrink-0 rounded border border-slate-100 overflow-hidden bg-slate-50">
                          <Image 
                            src={product.thumbnail_image} 
                            alt={product.name} 
                            fill 
                            className="object-contain p-1"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">
                          No Pic
                        </div>
                      )}
                      <div className="text-left">
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1 leading-snug">{product.name}</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{product.category?.name || "Product"}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No products found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}

          {/* Trending Categories Section */}
          {!searchQuery.trim() && (
            <div className="mt-auto select-none flex-1 flex flex-col justify-end">
              <div className="bg-[#F0F4FF] px-4 py-2 text-left">
                <h3 className="text-sm font-bold text-slate-800">Trending Categories</h3>
              </div>
              <div className="p-4 overflow-x-auto flex gap-4 no-scrollbar">
                {searchCategories.map((cat) => {
                  const imageSrc = cat.cover_image || cat.icon || "/images/placeholder.png";
                  return (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex-shrink-0 w-28 bg-[#F0F4FF] rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-slate-100/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="relative w-12 h-12 mb-2 bg-white rounded-lg p-1 overflow-hidden">
                        <Image 
                          src={imageSrc} 
                          alt={cat.name} 
                          fill 
                          className="object-contain p-1"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 leading-tight line-clamp-2">{cat.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

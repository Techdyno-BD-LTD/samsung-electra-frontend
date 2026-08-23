"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import {  
  FaBars,
  FaPinterestP,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { TiSocialFacebook, TiSocialLinkedin } from "react-icons/ti";
import { RiInstagramLine } from "react-icons/ri";
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
  // const [expandedSection, setExpandedSection] = useState<string | null>(null);
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
    pinterest?: string | null;
    tiktok?: string | null;
  }>({});
  const cartTotalCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const [orderId, setOrderId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const wishlistItemCount = useAppSelector((state) => state.wishlist.items.length);
  // const compareCount = useAppSelector((state) => state.compare.slots.filter(Boolean).length);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchCategories, setSearchCategories] = useState<any[]>([]);
  
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const getWhatsappHref = (raw: string | null | undefined) => {
    if (!raw) return "";
    const trimmed = raw.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    let cleaned = trimmed.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("0")) {
      cleaned = "88" + cleaned;
    }
    return `https://wa.me/${cleaned}`;
  };

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

  // const toggleSection = (section: string) => {
  //   setExpandedSection(expandedSection === section ? null : section);
  // };

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
            pinterest: fd?.pinterest_link,
            tiktok: fd?.tiktok_link,
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

  const socialList = [
    {
      href: socialLinks.facebook,
      icon: <TiSocialFacebook size={24} />,
      colorClass: "border-slate-300 text-slate-600 hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10",
    },
    {
      href: socialLinks.instagram,
      icon: <RiInstagramLine size={18} />,
      colorClass: "border-slate-300 text-slate-600 hover:border-[#E1306C] hover:text-[#E1306C] hover:bg-[#E1306C]/10",
    },
    {
      href: socialLinks.youtube,
      icon: <FaYoutube size={18} />,
      colorClass: "border-slate-300 text-slate-600 hover:border-[#FF0000] hover:text-[#FF0000] hover:bg-[#FF0000]/10",
    },
    {
      href: socialLinks.linkedin,
      icon: <TiSocialLinkedin size={24} />,
      colorClass: "border-slate-300 text-slate-600 hover:border-[#0077B5] hover:text-[#0077B5] hover:bg-[#0077B5]/10",
    },
    {
      href: socialLinks.pinterest,
      icon: <FaPinterestP size={16} />,
      colorClass: "border-slate-300 text-slate-600 hover:border-[#BD081C] hover:text-[#BD081C] hover:bg-[#BD081C]/10",
    },
    {
      href: socialLinks.whatsapp ? getWhatsappHref(socialLinks.whatsapp) : undefined,
      icon: <FaWhatsapp size={18} />,
      colorClass: "border-slate-300 text-slate-600 hover:border-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/10",
    },
    {
      href: socialLinks.tiktok,
      icon: <FaTiktok size={16} />,
      colorClass: "border-slate-300 text-slate-600 hover:border-black hover:text-black hover:bg-slate-100",
    },
  ].filter((item) => !!item.href);

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] bg-white/70 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#2B7FE8] border-t-transparent"></div>
          <p className="text-slate-600 text-sm font-semibold mt-3">Loading product details...</p>
        </div>
      )}
      <div className="lg:hidden bg-black border-none relative">
        <div className="flex items-center justify-between px-4 py-4 bg-black select-none">
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
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-slate-200 transition-all"
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
                className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-slate-200 transition-all"
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
                <PhoneInput
                  defaultCountry="bd"
                  value={phoneNumber}
                  onChange={(phone) => setPhoneNumber(phone)}
                  className="w-full flex items-center mt-1"
                  style={{ border: 'none', background: 'transparent', width: '100%' }}
                  inputStyle={{ 
                    border: 'none', 
                    background: 'transparent', 
                    width: '100%', 
                    outline: 'none', 
                    fontSize: '14px', 
                    color: '#1e293b',
                    paddingLeft: '8px',
                    marginTop: '4px'
                  }}
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
                icon: <Image src="/images/aboutus.svg" alt="About Us" width={20} height={20} className="object-contain" />
              },
              { 
                title: "Brands", 
                href: "/mobile-categories?tab=brands", 
                icon: <Image src="/images/brands.svg" alt="Brands" width={20} height={20} className="object-contain" />
              },
              { 
                title: "Campaign", 
                href: "/offers", 
                icon: <Image src="/images/campaign.svg" alt="Campaign" width={20} height={20} className="object-contain" />
              },
              { 
                title: "Gift Voucher", 
                href: "/gift-voucher", 
                icon: <Image src="/images/giftvoucher.svg" alt="Gift Voucher" width={20} height={20} className="object-contain" />
              },
              { 
                title: "Higher Sales/ Kisti", 
                href: "/higher-sale", 
                icon: <Image src="/images/highersale.svg" alt="Higher Sales/ Kisti" width={20} height={20} className="object-contain" />
              },
              { 
                title: "EMI Bank List", 
                href: "/emi-bank-list", 
                icon: <Image src="/images/emibanklist.svg" alt="EMI Bank List" width={20} height={20} className="object-contain" />
              },
              { 
                title: "Exchange Product", 
                href: "/exchange-products", 
                icon: <Image src="/images/exchangeproduct.svg" alt="Exchange Product" width={20} height={20} className="object-contain" />
              },
              { 
                title: "B2B / Dealership", 
                href: "/b2b", 
                icon: <Image src="/images/b2b.svg" alt="B2B / Dealership" width={20} height={20} className="object-contain" />
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
                  className="flex items-center justify-between px-4 py-1.5 bg-[#EDF2FB] hover:bg-[#d0d0d0] rounded-xl text-slate-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
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
              <svg className="w-8 h-8 text-blue-600 border-r-2 border-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
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
          {socialList.length > 0 && (
            <div className="border-t border-slate-200 p-4 flex gap-3 items-center justify-center text-center bg-white select-none">
              <p className="text-sm font-semibold text-slate-800">Follow Us</p>
              <div className="flex justify-center gap-3">
                {socialList.map((soc, sIdx) => (
                  <a 
                    key={sIdx} 
                    href={soc.href || undefined} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`flex items-center justify-center w-[36px] h-[36px] rounded-full border transition-all duration-300 ${soc.colorClass}`}
                  >
                    {soc.icon}
                  </a>
                ))}
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
                className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-slate-200 transition-all"
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

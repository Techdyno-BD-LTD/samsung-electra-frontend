"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  FaTimes, 
  FaBars, 
  FaRegUser, 
  FaRegHeart, 
  FaExchangeAlt, 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaLinkedinIn, 
  FaWhatsapp 
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

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
      <div className="lg:hidden bg-black border-none relative">
        <div className="flex items-center justify-between px-4 py-2.5 bg-black select-none">
          {/* Left: Hamburger menu */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-slate-200 transition-all" 
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={15} /> : <FaBars size={15} />}
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
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-slate-200 transition-all" aria-label="Search">
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

      <div className={`fixed inset-y-0 right-0 z-[1000] w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            {logoUrl ? (
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image src={logoUrl} alt="SAMSUNG electra" width={150} height={50} />
              </Link>
            ) : <div />}
            <button onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-slate-900" aria-label="Close menu">
              <FaTimes size={20} />
            </button>
          </div>

          {supportText ? (
            <div className="p-2 text-center border-slate-200">
              <p className="text-[12px] text-gray-600">{supportText}</p>
            </div>
          ) : null}

          <div className="px-2 flex items-center justify-center">
            <div className="bg-white shadow-md mb-1 gap-2 px-2 py-2 flex items-center rounded-md">
              <p className="text-[10px] text-gray-700">Log In To Unlock A Personalized Experience And Special Savings.</p>
              <Link href="/login" onClick={() => setIsOpen(false)} className="flex-shrink-0 bg-[#0081FF] text-white text-[13px] py-0.5 px-4 rounded-md hover:bg-blue-700 transition-colors">Login</Link>
            </div>
          </div>

          {utilityLinks.length > 0 ? (
            <div className="flex flex-wrap justify-around gap-2 p-2 border-slate-200">
              {utilityLinks.map((item) => {
                if (!item.title.trim() && !item.link.trim() && !item.icon?.trim()) return null;

                const label = item.title.trim();
                const href = item.link.trim();
                const content = (
                  <>
                    {item.icon?.trim() ? <Image src={item.icon} alt={label || "Utility link"} width={16} height={16} className="w-4 h-4 object-contain" /> : null}
                    {label ? <span>{label}</span> : null}
                  </>
                );

                if (!href) {
                  return (
                    <div key={item.id} className="flex items-center gap-2 p-1 px-2 text-xs text-gray-700 bg-gray-100 rounded-md">
                      {content}
                    </div>
                  );
                }

                return href.startsWith("http") ? (
                  <a key={item.id} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-1 px-2 text-xs text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition">
                    {content}
                  </a>
                ) : (
                  <Link key={item.id} href={href} onClick={() => setIsOpen(false)} className="flex items-center gap-2 p-1 px-2 text-xs text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition">
                    {content}
                  </Link>
                );
              })}
            </div>
          ) : null}

          <div className="flex-1 px-3 mt-1 overflow-y-auto">
            <div>
              {navItems.map((item) => (
                <div key={item.title || item.href || String(item.hasDropdown)} className="border-b bg-[#f4f4f4] mb-3 border-gray-200">
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => toggleSection(item.title)}
                        className="w-full flex items-center justify-between px-2 py-1 text-left hover:bg-gray-100 transition"
                      >
                        <span className="text-sm font-medium text-gray-700">{item.title}</span>
                        <span className="text-gray-400">{expandedSection === item.title ? <FaTimes size={14} /> : <span className="text-lg">+</span>}</span>
                      </button>
                      {expandedSection === item.title ? (
                        <div className="bg-white px-4 py-2 space-y-1">
                          {item.items.map((subItem) => {
                            const href = subItem.href || "#";
                            if (!subItem.name && !href) return null;
                            return href.startsWith("http") ? (
                              <a
                                key={`${subItem.name}-${href}`}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsOpen(false)}
                                className="block py-2 px-3 text-sm text-gray-600 hover:text-[#0054A6] hover:bg-gray-50 rounded transition"
                              >
                                {subItem.name}
                              </a>
                            ) : (
                              <Link
                                key={`${subItem.name}-${href}`}
                                href={href}
                                onClick={() => setIsOpen(false)}
                                className="block py-2 px-3 text-sm text-gray-600 hover:text-[#0054A6] hover:bg-gray-50 rounded transition"
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  ) : item.href ? (
                    item.href.startsWith("http") ? (
                      <a
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-2 py-1 text-sm font-medium text-gray-700 hover:text-[#0054A6]"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-2 py-1 text-sm font-medium text-gray-700 hover:text-[#0054A6]"
                      >
                        {item.title}
                      </Link>
                    )
                  ) : item.title ? (
                    <div className="block px-2 py-1 text-sm font-medium text-gray-700">{item.title}</div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Replicated Footer and Account Section for Mobile Sidebar */}
            <div className="border-t border-gray-200 my-4" />

            <div className="space-y-2 mb-6">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-4 py-3 bg-[#F8F9FA] hover:bg-[#F1F3F5] rounded-[4px] text-[#072F5B] transition-colors"
              >
                <FaRegUser className="w-[18px] h-[18px] text-[#072F5B]" />
                <span className="text-[14px] font-medium">My Account</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-4 py-3 bg-[#F8F9FA] hover:bg-[#F1F3F5] rounded-[4px] text-[#072F5B] transition-colors"
              >
                <FaRegHeart className="w-[18px] h-[18px] text-[#072F5B]" />
                <span className="text-[14px] font-medium">Wishlist</span>
              </Link>
              <Link
                href="/compare"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-4 py-3 bg-[#F8F9FA] hover:bg-[#F1F3F5] rounded-[4px] text-[#072F5B] transition-colors"
              >
                <FaExchangeAlt className="w-[18px] h-[18px] text-[#072F5B]" />
                <span className="text-[14px] font-medium">Product Compare</span>
              </Link>
            </div>

            {Boolean(
              socialLinks.facebook ||
              socialLinks.instagram ||
              socialLinks.youtube ||
              socialLinks.linkedin ||
              socialLinks.whatsapp
            ) && (
              <div className="space-y-3 px-1 pb-6">
                <p className="text-[14px] font-semibold text-gray-700">Connect With us</p>
                <div className="flex gap-4 text-[#005B9E]">
                  {socialLinks.facebook && (
                    <Link href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                      <FaFacebookF size={18} />
                    </Link>
                  )}
                  {socialLinks.instagram && (
                    <Link href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">
                      <FaInstagram size={18} />
                    </Link>
                  )}
                  {socialLinks.youtube && (
                    <Link href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">
                      <FaYoutube size={18} />
                    </Link>
                  )}
                  {socialLinks.linkedin && (
                    <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors">
                      <FaLinkedinIn size={18} />
                    </Link>
                  )}
                  {socialLinks.whatsapp && (
                    <Link 
                      href={(() => {
                        const raw = socialLinks.whatsapp;
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
                      })()} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-green-500 transition-colors"
                    >
                      <FaWhatsapp size={18} />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

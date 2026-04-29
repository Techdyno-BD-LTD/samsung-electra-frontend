"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTimes, FaBars } from "react-icons/fa";
import { useAppSelector } from "@/store/hooks";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [supportText, setSupportText] = useState<string | null>(null);
  const [utilityLinks, setUtilityLinks] = useState<Array<{ id: number; title: string; link: string; external_link: string | null; icon: string | null }>>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
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
        const response = await fetch("/api/header", { cache: "no-store" });
        if (!response.ok) return;

        const payload = (await response.json()) as HeaderResponse;
        const header = payload.data;

        if (!header || !isMounted) return;

        setLogoUrl(header.logo?.url?.trim() || null);
        setSupportText(header.topbar?.support_text?.trim() || null);
        setUtilityLinks((header.topbar?.utility_links || []).filter((item) => item.title.trim() || item.link.trim() || Boolean(item.icon?.trim())));

        const items = (header.navigation ?? [])
          .map((item) => ({
            title: item.title?.trim() || "",
            href: item.link?.trim() || "",
            hasDropdown: (item.children?.length ?? 0) > 0,
            items: (item.children ?? [])
              .map((child) => ({
                name: child.title?.trim() || "",
                href: child.link?.trim() || "",
              }))
              .filter((child) => child.name || child.href),
          }))
          .filter((item) => item.title || item.href || item.hasDropdown);

        setNavItems(items);
      } catch {
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
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {logoUrl ? (
            <Link href="/" className="flex items-center">
              <Image src={logoUrl} alt="SAMSUNG electra" width={200} height={34} className="h-8 w-auto" />
            </Link>
          ) : <div className="h-8" />}

          <div className="flex items-center gap-4">
            <button className="text-slate-600 hover:text-slate-900" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {pathname?.includes("/products/") && (
              <Link href="/cart" className="relative">
                <Image src="/images/shopping-cart.png" alt="Cart" width={20} height={20} className="w-5 h-5" />
                {mounted && cartTotalCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#ef4444] text-[8px] font-bold text-white border border-white">
                    {cartTotalCount < 10 ? `0${cartTotalCount}` : cartTotalCount}
                  </span>
                )}
              </Link>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900" aria-label="Toggle menu">
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`fixed inset-y-0 left-0 z-50 w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
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
              <button className="flex-shrink-0 bg-[#0081FF] text-white text-[13px] py-0.5 px-4 rounded-md hover:bg-blue-700 transition-colors">Login</button>
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
          </div>
        </div>
      </div>
    </>
  );
}

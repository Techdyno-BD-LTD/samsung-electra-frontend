"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HeaderNavItem = {
  id: number;
  title: string;
  link: string;
  external_link: string | null;
  children?: Array<{ id: number; title: string; link: string; external_link: string | null }>;
};

type HeaderNavResponse = {
  data?: {
    navigation?: HeaderNavItem[];
  };
  success: boolean;
  status: number;
};

type NavLink = {
  name: string;
  href: string;
  active?: boolean;
  subLinks?: Array<{ name: string; href: string }>;
};

export default function BottomBar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadNavLinks() {
      try {
        const response = await fetch("/api/header", { cache: "no-store" });
        if (!response.ok) return;

        const payload = (await response.json()) as HeaderNavResponse;
        const items = (payload.data?.navigation ?? [])
          .map((item) => ({
            name: item.title?.trim() || "",
            href: item.link?.trim() || "",
            subLinks: (item.children ?? [])
              .map((child) => ({
                name: child.title?.trim() || "",
                href: child.link?.trim() || "",
              }))
              .filter((child) => child.name || child.href),
          }))
          .filter((item) => item.name || item.href || (item.subLinks?.length ?? 0) > 0);

        if (isMounted) {
          setNavLinks(items);
        }
      } catch {
        if (isMounted) setNavLinks([]);
      }
    }

    loadNavLinks();
    return () => {
      isMounted = false;
    };
  }, []);

  if (navLinks.length === 0) {
    return null;
  }

  return (
    <nav className="bg-white h-[3.125rem] flex items-center border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <ul className="flex flex-nowrap items-center justify-between gap-2 lg:gap-8 2xl:gap-12 py-3">
          {navLinks.map((link, index) => (
            <li
              key={`${link.name}-${index}`}
              className="relative flex items-center group"
              onMouseEnter={() => link.subLinks && link.subLinks.length > 0 && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {index !== 0 && <span className="mr-2 lg:mr-4 text-[#2c4e72] font-bold text-[14px]">•</span>}

              {link.href.startsWith("http") ? (
                <a
                  href={link.href}
                  className={`text-[14px] lg:text-[15px] flex items-center gap-1 transition-colors whitespace-nowrap py-1 ${
                    link.active
                      ? "text-[#0054A6] font-bold border-b-2 border-[#0054A6]"
                      : "text-[#072F5B] hover:text-[#0081FF] font-medium"
                  }`}
                >
                  {link.name}
                </a>
              ) : link.href ? (
                <Link
                  href={link.href}
                  className={`text-[14px] lg:text-[15px] flex items-center gap-1 transition-colors whitespace-nowrap py-1 ${
                    link.active
                      ? "text-[#0054A6] font-bold border-b-2 border-[#0054A6]"
                      : "text-[#072F5B] hover:text-[#0081FF] font-medium"
                  }`}
                >
                  {link.name}
                  {link.subLinks && link.subLinks.length > 0 ? (
                    <span className={`text-[8px] ml-2 transition-transform duration-200 ${activeDropdown === link.name ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  ) : null}
                </Link>
              ) : (
                <div className="text-[14px] lg:text-[15px] flex items-center gap-1 transition-colors whitespace-nowrap py-1 text-[#072F5B] font-medium">
                  {link.name}
                  {link.subLinks && link.subLinks.length > 0 ? (
                    <span className={`text-[8px] ml-2 transition-transform duration-200 ${activeDropdown === link.name ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  ) : null}
                </div>
              )}

              {link.subLinks && link.subLinks.length > 0 && activeDropdown === link.name ? (
                <div className="absolute top-[100%] left-0 mt-0 w-48 bg-white shadow-xl border border-slate-100 z-50 py-2">
                  {link.subLinks.map((sub) => {
                    const href = sub.href || "#";
                    return href.startsWith("http") ? (
                      <a
                        key={`${sub.name}-${href}`}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-[13px] text-[#072F5B] hover:bg-blue-50 hover:text-[#0054A6]"
                      >
                        {sub.name}
                      </a>
                    ) : (
                      <Link
                        key={`${sub.name}-${href}`}
                        href={href}
                        className="block px-4 py-2 text-[13px] text-[#072F5B] hover:bg-blue-50 hover:text-[#0054A6]"
                      >
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { HiViewGrid } from "react-icons/hi";
import { FaHome } from "react-icons/fa";

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

type HeroCategory = {
  id: number;
  name: string;
  count: number;
  icon: string | null;
  coverImage: string | null;
  slug?: string;
  parent_id?: number;
  subcategories: Array<{
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    coverImage: string | null;
  }>;
};

export default function BottomBar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [categories, setCategories] = useState<HeroCategory[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<HeroCategory | null>(null);
  const [activeMenuCategory, setActiveMenuCategory] = useState<HeroCategory | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoryHover = (category: HeroCategory | null) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    if (category) {
      if (!isMenuOpen) {
        setActiveMenuCategory(category);
        hoverTimeoutRef.current = setTimeout(() => {
          setIsMenuOpen(true);
        }, 10);
      } else if (activeMenuCategory?.id !== category.id) {
        setIsMenuOpen(false);
        hoverTimeoutRef.current = setTimeout(() => {
          setActiveMenuCategory(category);
          setIsMenuOpen(true);
        }, 150);
      }
      setHoveredCategory(category);
    } else {
      setHoveredCategory(null);
      hoverTimeoutRef.current = setTimeout(() => {
        setIsMenuOpen(false);
        hoverTimeoutRef.current = setTimeout(() => {
          setActiveMenuCategory(null);
        }, 200);
      }, 100);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadNavLinks() {
      try {
        const [headerRes, brandsRes] = await Promise.all([
          fetch("/api/header", { cache: "no-store" }),
          fetch("/api/brands")
        ]);

        let fetchedBrands: Array<{ name: string; slug: string }> = [];
        if (brandsRes.ok) {
          const brandsJson = await brandsRes.json();
          fetchedBrands = brandsJson.data || [];
        }

        if (!headerRes.ok) return;

        const payload = (await headerRes.json()) as HeaderNavResponse;
        const items = (payload.data?.navigation ?? [])
          .map((item) => {
            const name = item.title?.trim() || "";
            const isOurBrands = name.toLowerCase() === "our brands" || name.toLowerCase() === "brands";

            const subLinks = isOurBrands
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
              name,
              href: item.link?.trim() || "",
              subLinks,
            };
          })
          .filter((item) => item.name || item.href || (item.subLinks?.length ?? 0) > 0);

        if (isMounted) {
          setNavLinks(items);
        }
      } catch (err) {
        console.error("Failed to load nav links/brands:", err);
        if (isMounted) setNavLinks([]);
      }
    }

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        if (response.ok) {
          const categoryPayload = await response.json();
          const allApiCategories = categoryPayload.data || [];
          const topLevelCategories = allApiCategories.filter((item: any) => item.parent_id === 0 && (item.number_of_products || 0) > 0);

          const fetchedCategories: HeroCategory[] = topLevelCategories.map((item: any) => ({
            id: item.id,
            name: item.name,
            count: item.number_of_products || 0,
            icon: item.icon,
            coverImage: item.cover_image,
            slug: item.slug,
            parent_id: item.parent_id,
            subcategories: allApiCategories
              .filter((sub: any) => sub.parent_id === item.id && (sub.number_of_products || 0) > 0)
              .map((sub: any) => ({
                id: sub.id,
                name: sub.name,
                slug: sub.slug,
                icon: sub.icon,
                coverImage: sub.cover_image,
              })),
          }));

          if (isMounted) {
            setCategories(fetchedCategories);
          }
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }

    loadNavLinks();
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <nav className="bg-[#266BF9]  flex items-center py-0.5  relative z-30">
      <div className="mainwidth flex items-center justify-between gap-6">
        {/* Category Button & Sidebar Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center justify-center w-10 h-10 bg-[#1554d4] hover:bg-[#0c3e9c] text-white rounded-md transition-colors"
            title="Categories"
          >
            <HiViewGrid className="text-2xl" />
          </button>

          {isCategoryOpen && (
            <>
              <div className="fixed inset-0 z-[110]" onClick={() => {
                setIsCategoryOpen(false);
                handleCategoryHover(null);
              }} />
              
              <aside 
                className="absolute top-full left-0 mt-2 w-[320px] bg-[#072F5B]/85 backdrop-blur-md rounded-xl shadow-2xl z-[120] flex flex-col border border-[#1b3e6d]"
                onMouseLeave={() => handleCategoryHover(null)}
              >
                {/* Header */}
                <div className="bg-[#266BF9] h-[3.25rem] flex items-center justify-between px-4 text-white font-semibold text-sm rounded-t-xl">
                  <span>Categories</span>
                  <button 
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="flex items-center gap-1.5 hover:opacity-85 text-xs font-bold uppercase tracking-wider"
                  >
                    <span>{showAllCategories ? "See Less" : "See All"}</span>
                    <span className="text-[10px]">▼</span>
                  </button>
                </div>

                {/* Categories List */}
                <div className={`w-full custom-scrollbar divide-y divide-[#1e3f6e] ${showAllCategories ? "overflow-y-auto pr-1" : "overflow-hidden"} h-[420px]`}>
                  {(showAllCategories ? categories : categories.slice(0, 6)).map((category) => {
                    const categoryUrl = `/category/${category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
                    const isHovered = hoveredCategory?.id === category.id;
                    return (
                      <Link
                        key={category.id}
                        href={categoryUrl}
                        onClick={() => setIsCategoryOpen(false)}
                        onMouseEnter={() => handleCategoryHover(category)}
                        className={`flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors duration-150 ${isHovered
                          ? "bg-[#e3ebf6] text-[#072F5B]"
                          : "bg-transparent text-white hover:bg-[#1a3e6d]/40"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Icon Container with blue glow */}
                          <div className={`w-12 h-10 flex items-center justify-center flex-shrink-0 relative p-1 ${isHovered ? "bg-[radial-gradient(circle,_rgba(38,107,249,0.95)_0%,_transparent_70%)] drop-shadow-[0_0_8px_rgba(38,107,249,0.8)]" : "bg-[radial-gradient(circle,_rgba(38,107,249,0.85)_0%,_transparent_70%)] drop-shadow-[0_0_6px_rgba(38,107,249,0.6)]"}`}>
                            {category.icon ? (
                              <Image
                                src={category.icon}
                                alt={category.name}
                                width={36}
                                height={36}
                                className="h-full w-full object-contain"
                              />
                            ) : null}
                          </div>
                          <span className="text-[14px] font-semibold leading-tight">{category.name}</span>
                        </div>
                        
                        {/* Right Caret Indicator */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold ${isHovered ? "text-[#266BF9]" : "text-blue-400"}`}>
                            {isHovered ? "▶" : "▼"}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Subcategory Mega Menu overlay sitting exactly beside the categories sidebar */}
                {activeMenuCategory && (
                  <div
                    className={`absolute left-full top-0 ml-1.5 w-[640px] h-full bg-[#072F5B]/85 backdrop-blur-md p-6 shadow-2xl border border-[#1b3e6d] rounded-xl flex transition-all duration-300 z-[130] overflow-hidden ${isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}`}
                    onMouseEnter={() => handleCategoryHover(activeMenuCategory)}
                  >
                    {/* Subcategories list - Left Column */}
                    <div className="flex-1 flex flex-col justify-start pr-6 divide-y divide-[#1e3f6e] overflow-y-auto custom-scrollbar">
                      <h2 className="mb-4 text-lg font-bold text-white tracking-wide border-b border-slate-500/20 pb-2">
                        {activeMenuCategory.name}
                      </h2>
                      
                      {activeMenuCategory.subcategories.length > 0 ? (
                        activeMenuCategory.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/category/${sub.slug}`}
                            onClick={() => {
                              setIsCategoryOpen(false);
                              setActiveMenuCategory(null);
                            }}
                            className="group flex items-center justify-between py-3.5 text-left transition-all hover:pl-2"
                          >
                            <span className="text-[14px] font-medium text-[#cbe0ff] transition-colors group-hover:text-white">
                              {sub.name}
                            </span>
                            <span className="text-xs text-[#266BF9] opacity-0 group-hover:opacity-100 transition-opacity">
                              ▶
                            </span>
                          </Link>
                        ))
                      ) : (
                        <div className="py-8 text-center text-sm text-slate-400">No subcategories available</div>
                      )}
                    </div>

                    {/* Banner Image - Right Column */}
                    <div className="relative w-[280px] h-full flex-shrink-0 bg-white rounded-lg overflow-hidden border border-slate-100 p-2 shadow-inner flex items-center justify-center">
                      {activeMenuCategory.coverImage ? (
                        <Image
                          src={activeMenuCategory.coverImage}
                          alt={activeMenuCategory.name}
                          fill
                          className="object-cover p-2 rounded-lg"
                        />
                      ) : activeMenuCategory.icon ? (
                        <Image
                          src={activeMenuCategory.icon}
                          alt={activeMenuCategory.name}
                          width={240}
                          height={240}
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400 text-sm font-semibold">
                          {activeMenuCategory.name}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </aside>
            </>
          )}
        </div>

        {/* Existing Navigation Links */}
        <ul className="flex flex-nowrap uppercase items-center justify-center flex-1 gap-2 lg:gap-6 py-1">
          {/* HOME link with separator */}
          <li className="relative flex items-center group  pl-2 lg:pl-4">
            <Link
              href="/"
              className="text-[14px] 2xl:text-[14px] flex items-center gap-1 transition-colors whitespace-nowrap py-1 text-[#ffffff] hover:text-[#000000] font-medium"
            >
              <FaHome className="text-[18px] mr-1 flex-shrink-0" />
              <span>HOME</span>
            </Link>
          </li>

          {navLinks.map((link, index) => (
            <li
              key={`${link.name}-${index}`}
              className="relative flex items-center group border-l border-white/20 pl-2 lg:pl-4"
              onMouseEnter={() => link.subLinks && link.subLinks.length > 0 && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {link.href.startsWith("http") ? (
                <a
                  href={link.href}
                  className={`text-[14px] 2xl:text-[14px] flex items-center gap-1 transition-colors whitespace-nowrap py-1 ${link.active
                      ? "text-[#ffffff] font-bold border-b-2 border-[#0054A6]"
                      : "text-[#ffffff] hover:text-[#000000] font-medium"
                    }`}
                >
                  {link.name}
                </a>
              ) : link.href ? (
                <Link
                  href={link.href}
                  className={`text-[14px] 2xl:text-[14px] flex items-center gap-1 transition-colors whitespace-nowrap py-1 ${link.active
                      ? "text-[#ffffff] font-bold border-b-2 border-[#0054A6]"
                      : "text-[#ffffff] hover:text-[#000000] font-medium"
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
                <div className="text-[14px] lg:text-[15px] flex items-center gap-1 transition-colors whitespace-nowrap py-1 text-[#ffffff] font-medium cursor-default">
                  {link.name}
                  {link.subLinks && link.subLinks.length > 0 ? (
                    <span className={`text-[8px] ml-2 transition-transform duration-200 ${activeDropdown === link.name ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  ) : null}
                </div>
              )}

              {link.subLinks && link.subLinks.length > 0 && activeDropdown === link.name ? (
                <div className="absolute top-[100%] left-0 mt-0 w-48 bg-white shadow-xl border border-slate-100 z-50 py-2 max-h-[350px] overflow-y-auto scrollbar-thin">
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

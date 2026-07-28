"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Brand = {
  name: string;
  slug: string;
};

export default function MobileBottomBar() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch("/api/brands");
        if (res.ok) {
          const json = await res.json();
          setBrands(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch brands in MobileBottomBar:", err);
      }
    }
    fetchBrands();
  }, []);

  const isAboutActive = pathname === "/about";
  const isCampingActive = pathname === "/camping";
  const isBrandActive = pathname.startsWith("/brand/");

  if (pathname !== "/") return null;

  const navLinks = [
    { name: "About Us", href: "/about", active: isAboutActive },
    { name: "Campaign", href: "/camping", active: isCampingActive },
    {
      name: "Our Brand",
      href: "#",
      active: isBrandActive,
      subLinks: brands.map((b) => ({
        name: b.name,
        href: `/brand/${b.slug}`,
      })),
    },
  ];

  return (
    <nav className="lg:hidden w-full bg-white border-b border-slate-200 relative">
      <div className="px-4">
        <ul className="flex items-center justify-around ">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="relative flex items-center group py-2"
              onMouseEnter={() => link.subLinks && link.subLinks.length > 0 && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {/* Bullet Separator */}
              {/* {index !== 0 && (
                <span className="mr-3 text-[#2c4e72] font-bold text-[14px]">•</span>
              )} */}
 
              {/* Main Link */}
              <Link
                href={link.href}
                className={`text-[12px] flex items-center gap-1 transition-colors whitespace-nowrap py-1
                ${link.active
                    ? "text-[#0054A6] font-bold border-b-2 border-[#0054A6]"
                    : "text-[#072F5B] hover:text-[#0081FF] font-medium"}
              `}
                onClick={(e) => {
                  if (link.subLinks && link.subLinks.length > 0) {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === link.name ? null : link.name);
                  }
                }}
              >
                {link.name}
                {link.subLinks && link.subLinks.length > 0 && (
                  <span className={`text-[8px] ml-1 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                )}
              </Link>
 
              {/* Dropdown Menu */}
              {link.subLinks && link.subLinks.length > 0 && activeDropdown === link.name && (
                <div className="absolute top-[100%] left-0 mt-0 w-48 bg-white shadow-xl border border-slate-100 z-50 py-2">
                  {link.subLinks.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      onClick={() => setActiveDropdown(null)}
                      className="block px-4 py-2 text-[13px] text-[#072F5B] hover:bg-blue-50 hover:text-[#0054A6]"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

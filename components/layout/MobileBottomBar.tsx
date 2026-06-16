"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomBar() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  if (pathname !== "/") return null;

  const navLinks = [
    { name: "About Us", href: "/about", active: true },
    { name: "Campaign", href: "/camping" },
    {
      name: "Our Brand",
      href: "#",
      subLinks: [
        { name: "Samsung", href: "/brands/samsung" },
        { name: "Apple", href: "/brands/apple" },
        { name: "Sony", href: "/brands/sony" },
      ]
    },
  ];

  return (
    <nav className="lg:hidden w-full bg-white border-b border-slate-200 overflow-x-auto no-scrollbar">
      <div className="px-4">
        <ul className="flex items-center justify-around ">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="relative flex items-center group"
              onMouseEnter={() => link.subLinks && setActiveDropdown(link.name)}
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
                  if (link.subLinks) {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === link.name ? null : link.name);
                  }
                }}
              >
                {link.name}
                {link.subLinks && (
                  <span className={`text-[8px] ml-1 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                )}
              </Link>

              {/* Dropdown Menu */}
              {link.subLinks && activeDropdown === link.name && (
                <div className="absolute top-[100%] left-0 mt-0 w-48 bg-white shadow-xl border border-slate-100 z-50 py-2">
                  {link.subLinks.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
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

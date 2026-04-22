"use client";
import Link from "next/link";
import { useState } from "react";

export default function BottomBar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navLinks = [
    { name: "About Us", href: "/about", active: true },
    { name: "Shop", href: "/shop" },
    {
      name: "Our Brands",
      href: "#",
      subLinks: [
        { name: "Samsung", href: "/brands/samsung" },
        { name: "Apple", href: "/brands/apple" },
        { name: "Sony", href: "/brands/sony" },
      ]
    },
    { name: "Gift Voucher", href: "/vouchers" },
    { name: "Camping", href: "/camping" },
    {
      name: "Product Biding",
      href: "#",
      subLinks: [
        { name: "Live Auctions", href: "/bidding/live" },
        { name: "Upcoming", href: "/bidding/upcoming" },
      ]
    },
    { name: "Higher Sale / Kisti", href: "/higher-sale" },
    { name: "Exchange Product", href: "/exchange" },
    { name: "Offers", href: "/offers" },
  ];

  return (
    <nav className="bg-white h-[3.125rem] flex items-center border-b border-slate-200">
      {/* Changed w-8/12 to max-w-7xl to give it more breathing room on 1366px screens */}
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex flex-nowrap items-center justify-between gap-2 lg:gap-8 2xl:gap-12 py-3">
          {navLinks.map((link, index) => (
            <li
              key={link.name}
              className="relative flex items-center group"
              onMouseEnter={() => link.subLinks && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {/* Bullet Separator */}
              {index !== 0 && (
                <span className="mr-2 lg:mr-4 text-[#2c4e72] font-bold text-[14px] ">•</span>
              )}

              {/* Main Link */}
              <Link
                href={link.href}
                className={`text-[14px] lg:text-[15px] flex items-center gap-1 transition-colors whitespace-nowrap py-1
                ${link.active
                    ? "text-[#0054A6] font-bold border-b-2 border-[#0054A6]" 
                    : "text-[#072F5B] hover:text-[#0081FF] font-medium"}
              `}
              >
                {link.name}
                {link.subLinks && (
                  <span className={`text-[8px] ml-2 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`}>
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
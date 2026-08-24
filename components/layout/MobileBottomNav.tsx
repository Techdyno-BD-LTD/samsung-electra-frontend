"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const cartTotalCount = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );

  const isProductDetailsRoute =
    pathname?.startsWith("/products/") || pathname?.startsWith("/product/");

  if (isProductDetailsRoute) {
    return null;
  }

  const navItems = [
    {
      icon: "/images/home.svg",
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      icon: "/images/categories.svg",
      href: "/mobile-categories",
      label: "Categories",
      active: pathname === "/mobile-categories",
    },
    {
      icon: "/images/offers.svg",
      href: "/offers",
      label: "Offers",
      active: pathname === "/offers",
    },
    {
      icon: "/images/cart.svg",
      href: "/cart",
      label: "Cart",
      active: pathname === "/cart",
    },
    {
      icon: "/images/account.svg",
      href: isAuthenticated ? "/dashboard" : "/login",
      label: "Account",
      active: pathname === "/dashboard" || pathname === "/login",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] bg-[#EDF2FB] border-t border-gray-100 px-2 pb-safe md:hidden select-none shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center py-1 max-w-lg mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center min-w-[60px] py-1 transition-colors"
          >
            <div className="relative flex items-center justify-center h-6">
              <Image
                src={item.icon}
                alt={item.label}
                width={22}
                height={22}
                className="object-contain transition-all duration-300"
                style={{
                  filter: item.active
                    ? "brightness(0) saturate(100%) invert(36%) sepia(91%) saturate(3015%) hue-rotate(213deg) brightness(101%) contrast(97%)"
                    : "none",
                }}
              />
              {item.label === "Cart" && cartTotalCount > 0 && (
                <span className="absolute -right-2.5 -top-1.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white border border-white">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <span className="text-[12px] font-medium mt-1 leading-none text-black">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { 
  HiOutlineHome, 
  HiOutlineSquares2X2, 
  HiOutlineMegaphone, 
  HiOutlineShoppingCart, 
  HiOutlineUserCircle 
} from "react-icons/hi2";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const cartTotalCount = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );
  
  const isProductDetailsRoute = pathname?.startsWith("/products/") || pathname?.startsWith("/product/");

  if (isProductDetailsRoute) {
    return null;
  }

  const navItems = [
    {
      icon: <HiOutlineHome size={22} />,
      href: "/",
      label: "Home",
      active: pathname === "/"
    },
    {
      icon: <HiOutlineSquares2X2 size={22} />,
      href: "/mobile-categories",
      label: "Categories",
      active: pathname === "/mobile-categories"
    },
    {
      icon: <HiOutlineMegaphone size={22} />,
      href: "/offers",
      label: "Offers",
      active: pathname === "/offers"
    },
    {
      icon: <HiOutlineShoppingCart size={22} />,
      href: "/cart",
      label: "Cart",
      active: pathname === "/cart"
    },
    {
      icon: <HiOutlineUserCircle size={22} />,
      href: isAuthenticated ? "/dashboard" : "/login",
      label: "Account",
      active: pathname === "/dashboard" || pathname === "/login"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] bg-[#EDF2FB] border-t border-gray-100 px-2 pb-safe md:hidden select-none shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center py-1 max-w-lg mx-auto">
        {navItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex flex-col items-center justify-center min-w-[60px] py-1 transition-colors ${
              item.active ? "text-[#2B7FE8]" : "text-slate-500"
            }`}
          >
            <div className="relative flex items-center justify-center h-6">
              {item.icon}
              {item.label === "Cart" && cartTotalCount > 0 && (
                <span className="absolute -right-2.5 -top-1.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white border border-white">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold mt-1 leading-none">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

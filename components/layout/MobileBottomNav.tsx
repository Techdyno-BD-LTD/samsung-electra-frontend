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
  
  const isProductDetailsRoute = pathname?.startsWith("/products/") || pathname?.startsWith("/product/");

  if (isProductDetailsRoute) {
    return null;
  }

  const navItems = [
    {
      icon: <HiOutlineHome size={26} />,
      href: "/",
      label: "Home",
      active: pathname === "/"
    },
    {
      icon: <HiOutlineSquares2X2 size={26} />,
      href: "/mobile-categories",
      label: "Categories",
      active: pathname === "/mobile-categories"
    },
    {
      icon: <HiOutlineMegaphone size={26} />,
      href: "/camping",
      label: "Camping",
      active: pathname === "/camping"
    },
    {
      icon: <HiOutlineShoppingCart size={26} />,
      href: "/cart",
      label: "Cart",
      active: pathname === "/cart"
    },
    {
      icon: <HiOutlineUserCircle size={26} />,
      href: isAuthenticated ? "/dashboard" : "/login",
      label: "Profile",
      active: pathname === "/dashboard" || pathname === "/login"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] bg-white/90 backdrop-blur-md border-t border-gray-100 px-2 pb-safe md:hidden">
      <div className="flex justify-between items-center py-2 max-w-lg mx-auto">
        {navItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex flex-col items-center justify-center min-w-[64px] transition-colors ${
              item.active ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.label === "Cart" && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  0
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

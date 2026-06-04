"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  FiShoppingBag,
  FiMapPin,
  FiHeart,
  FiGift,

  FiMessageSquare,
  FiHome,
  FiRepeat,
  FiUserCheck,
  FiAlertCircle,
  FiLogOut,
  FiChevronRight,
  FiCamera
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/features/auth/authSlice";
import { clearWishlist } from "@/store/features/wishlist/wishlistSlice";
import { useRouter } from "next/navigation";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(logout());
    dispatch(clearWishlist());
    router.push("/login");
  };

  const navItems = [
    { name: "Orders", icon: <FiShoppingBag />, href: "/dashboard/orders" },
    { name: "Profile", icon: <FiUserCheck />, href: "/dashboard/profile" },
    { name: "Shipping Address", icon: <FiMapPin />, href: "/dashboard/address" },
    { name: "Wishlist", icon: <FiHeart />, href: "/dashboard/wishlist" },
    { name: "My Offers", icon: <FiGift />, href: "/dashboard/offers" },
    { name: "Gift Vouchers", icon: <FiGift />, href: "/dashboard/gift-vouchers" },
    // { name: "Payment Method", icon: <FiCreditCard />, href: "/dashboard/payment" },
    { name: "Review", icon: <FiMessageSquare />, href: "/dashboard/reviews" },
    { name: "Store Location", icon: <FiHome />, href: "/dashboard/stores" },
    { name: "Exchange Product", icon: <FiRepeat />, href: "/dashboard/exchange" },
    { name: "Service Request", icon: <FiUserCheck />, href: "/dashboard/service" },
    { name: "Complain", icon: <FiAlertCircle />, href: "/dashboard/complain" },
  ];

  return (
    <div className="bg-white rounded-2xl py-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 h-fit overflow-hidden">
      <div className="flex flex-col items-center px-6 pb-6 border-b border-slate-100 mb-2">
        <div className="relative w-20 h-20 mb-4">
          <div className="w-full h-full rounded-full object-cover bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            <Image
              src={(typeof user?.avatar_original === 'string' && (user.avatar_original.startsWith('/') || user.avatar_original.startsWith('http')))
                ? user.avatar_original
                : (typeof user?.avatar === 'string' && (user.avatar.startsWith('/') || user.avatar.startsWith('http')))
                  ? user.avatar
                  : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Guest'}`}
              alt="Profile"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <Link href="/dashboard/profile" className="absolute bottom-0 right-0 bg-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-slate-500 shadow border border-slate-100 cursor-pointer transition-transform hover:scale-110 hover:text-[#2b7fe8]" title="Edit Profile">
            <FiCamera />
          </Link>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 m-0 leading-tight">{user?.name || "User Name"}</h3>
        <p className="text-[13px] text-slate-500 mb-3">{user?.email || user?.phone || "Email/Phone"}</p>
        {/* <div className="bg-orange-50 text-orange-500 px-4 py-1 rounded-full text-xs font-semibold border border-orange-100">
          Points : 00
        </div> */}
      </div>

      <nav className="flex flex-col">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3.5 transition-all duration-200 border-b border-slate-50 last:border-b-0 text-[15px] font-medium
                ${isActive
                  ? "bg-[#2b7fe8] text-white"
                  : "text-slate-700 hover:bg-slate-50 hover:text-[#2b7fe8] hover:pl-7"
                }`}
            >
              <span className="text-lg mr-3.5 flex items-center">{item.icon}</span>
              <span className="flex-1">{item.name}</span>
              <span className={`ml-auto text-sm transition-opacity ${isActive ? "opacity-100" : "opacity-60"}`}>
                <FiChevronRight />
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pt-2 mt-2">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 bg-slate-50 text-[#2b7fe8] rounded-xl decoration-0 font-semibold text-[15px] transition-all duration-200 hover:bg-slate-100 hover:-translate-y-0.5 text-left"
        >
          <FiLogOut className="text-lg" />
          <span className="ml-2.5">Logout</span>
          <span className="ml-auto"><FiChevronRight /></span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTimes, FaBars, FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";
import { useAppSelector } from "@/store/hooks";
import { usePathname } from "next/navigation";

export default function MobileNavbar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const cartTotalCount = useAppSelector((state) => 
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  useEffect(() => {
    setMounted(true);
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const navItems = [
    {
      title: "Category",
      hasDropdown: true,
      items: [
        { name: "Electronics", href: "/categories/electronics" },
        { name: "Mobile", href: "/categories/mobile" },
        { name: "TV", href: "/categories/tv" },
        { name: "Appliances", href: "/categories/appliances" },
      ]
    },
    {
      title: "Brand",
      hasDropdown: true,
      items: [
        { name: "Samsung", href: "/brands/samsung" },
        { name: "Apple", href: "/brands/apple" },
        { name: "Sony", href: "/brands/sony" },
      ]
    },
    { title: "About Us", href: "/about", hasDropdown: false },
    { title: "Campaign", href: "/camping", hasDropdown: false },
    {
      title: "Our Brand",
      hasDropdown: true,
      items: [
        { name: "Samsung", href: "/brands/samsung" },
        { name: "Apple", href: "/brands/apple" },
        { name: "Sony", href: "/brands/sony" },
      ]
    },
    { title: "Gift Voucher", href: "/vouchers", hasDropdown: false },
    { title: "Exchange Product", href: "/exchange", hasDropdown: false },
    { title: "Biding Product", href: "/bidding", hasDropdown: false },
    { title: "Higher Sale / Kisti", href: "/kisti", hasDropdown: false },
    { title: "Offers", href: "/offers", hasDropdown: false },
    { title: "Shop", href: "/shop", hasDropdown: false },
    { title: "Blog / News", href: "/blog", hasDropdown: false },
  ];

  return (
    <>
      {/* Mobile Header - Always Visible */}
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/electralogo.webp"
              alt="SAMSUNG electra"
              width={200}
              height={34}
              className="h-8 w-auto"
            />
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button className="text-slate-600 hover:text-slate-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart with Badge */}
            {pathname?.includes('/products/') && (
              <Link href="/cart" className="relative">
                <Image
                  src="/images/shopping-cart.png"
                  alt="Cart"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                {mounted && cartTotalCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#ef4444] text-[8px] font-bold text-white border border-white">
                    {cartTotalCount < 10 ? `0${cartTotalCount}` : cartTotalCount}
                  </span>
                )}
              </Link>
            )}

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed inset-y-0 left-0 z-50 w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image
                src="/images/electralogo.webp"
                alt="SAMSUNG electra"
                width={150}
                height={50}
              />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-600 hover:text-slate-900"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Contact Information */}
          <div className="p-2 text-center  border-slate-200">
            <p className="text-[12px] text-gray-600">Need Online Help? Call Us <span className="font-bold text-[#0054A6]">01713353431</span></p>
            <p className="text-xs text-gray-500">Sat-Thu (09:00AM - 6:00 PM)</p>
          </div>

          {/* Login Section */}
          <div className="px-2  flex items-center justify-center ">
            <div className="bg-white shadow-md mb-1 gap-2 px-2 py-2 flex items-center rounded-md">
              <p className="text-[10px] text-gray-700">Log In To Unlock A Personalized Experience And Special Savings.</p>
              <button className="flex-shrink-0 bg-[#0081FF] text-white text-[13px] py-0.5 px-4 rounded-md hover:bg-blue-700 transition-colors">Login</button>
            </div>
            
          </div>

          {/* Action Buttons */}
          <div className="flex justify-around p-2  border-slate-200">
            <button className="flex items-center gap-2 p-1 px-2  text-xs text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition">
              <Image src="/images/location.png" alt="Store Location" width={16} height={16} />
              <span>Store Location</span>
            </button>
            <button className="flex items-center gap-2 p-1 px-2  text-xs text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition">
              <Image src="/images/Group.png" alt="Track Order" width={16} height={16} />
              <span>Track Order</span>
            </button>
            <button className="flex items-center gap-2 p-1 px-2 text-xs text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition">
              <Image src="/images/delaership.png" alt="B2B / Dealership" width={16} height={16} />
              <span>B2B / Dealership</span>
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 px-3 mt-1   overflow-y-auto">
            <div className="">
              {navItems.map((item) => (
                <div key={item.title} className="border-b bg-[#f4f4f4] mb-3  border-gray-200">
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => toggleSection(item.title)}
                        className="w-full  flex items-center justify-between px-2 py-1 text-left hover:bg-gray-100 transition"
                      >
                        <span className="text-sm font-medium text-gray-700">{item.title}</span>
                        <span className="text-gray-400">
                          {expandedSection === item.title ? <FaTimes size={14} /> : <span className="text-lg">+</span>}
                        </span>
                      </button>
                      {expandedSection === item.title && (
                        <div className="bg-white px-4 py-2 space-y-1">
                          {item.items?.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => setIsOpen(false)}
                              className="block py-2 px-3 text-sm text-gray-600 hover:text-[#0054A6] hover:bg-gray-50 rounded transition"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      onClick={() => setIsOpen(false)}
                      className="block px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Account Section */}
          <div className="border-t border-slate-200 p-1">
            <div className="flex flex-col px-2 space-y-2">
              <Link href="/my-account" onClick={() => setIsOpen(false)} className="flex bg-[#f4f4f4] px-1 items-center gap-3 p-1 text-sm text-gray-700 hover:bg-gray-50 rounded">
                <Image src="/images/loginavatarblack.png" alt="My Account" width={16} height={16} />
                <span>My Account</span>
              </Link>
              <Link href="/wishlist" onClick={() => setIsOpen(false)} className="flex bg-[#f4f4f4] items-center px-1 gap-3 p-1 text-sm text-gray-700 hover:bg-gray-50 rounded">
                <Image src="/images/heart.png" alt="Wishlist" width={16} height={16} />
                <span>Wishlist</span>
              </Link>
              <Link href="/compare" onClick={() => setIsOpen(false)} className="flex bg-[#f4f4f4] items-center px-1 gap-3 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded">
                <Image src="/images/compare.png" alt="Product Compare" width={16} height={16} />
                <span>Product Compare</span>
              </Link>
            </div>
          </div>

          {/* Social Media and Chat Section */}
          <div className="border-t border-slate-200 p-4">
            
            <div className="flex items-center justify-between">
              {/* Social Media Icons - Left Side */}
              <div className="flex flex-col ">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
 <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#0054A6] hover:opacity-80">
    <FaFacebook size={24} />
  </a>
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#0054A6] hover:opacity-80">
    <FaInstagram size={24} />
  </a>
  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-[#0054A6] hover:opacity-80">
    <FaYoutube size={24} />
  </a>
  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#0054A6] hover:opacity-80">
    <FaLinkedin size={24} />
  </a>
  <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-[#0054A6] hover:opacity-80">
    <FaWhatsapp size={24} />
  </a>
                </div>
 
</div>
              
              {/* Chat Icons - Right Side */}
              <div className="flex flex-col items-center space-y-3">
                <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700"><FaWhatsapp size={32} /></a>
                <a href="https://messenger.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"><FaFacebookMessenger size={32} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

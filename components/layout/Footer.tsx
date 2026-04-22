"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {

  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [openSections, setOpenSections] = useState({
    company: false,
    myAccount: false,
    afterSales: false,
    popular: false,
    customerService: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      // Close all sections first
      const allClosed = {
        company: false,
        myAccount: false,
        afterSales: false,
        popular: false,
        customerService: false
      };
      // Only open the clicked section
      return {
        ...allClosed,
        [section]: !prev[section as keyof typeof prev]
      };
    });
  };

  return (
    <footer className="w-full bg-[#E5F2FF] text-[#4a5568] pt-12 pb-6 border-t border-blue-100">
      {/* Main Container */}
      <div className=" mx-auto mainwidthmore lg:mainwidth flex flex-col lg:flex-row justify-between lg:gap-28">

        {/* Company Informations - Separate Div */}
        <div className="space-y-6 w-full lg:w-[25%]">
          <div className="space-y-1">
            <Image
              src="/images/electralogo.webp"
              alt="Samsung Electra"
              width={250}
              height={40}
              className="h-auto"
            />

          </div>

          <p className="text-[15px] leading-relaxed">
            Electra International | Your Comfort Our Promise The Largest Home Appliance Brand In Bangladesh
          </p>

          <div className="space-y-3 text-[15px]">
            {/* Phone Section */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Image
                  src="/images/phone-call.png"
                  alt="Phone"
                  width={16}
                  height={16}
                />
              </div>
              <p>+8809639023023 ,<br />+8801713353431</p>
            </div>

            {/* Email Section */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Image
                  src="/images/mail.png"
                  alt="Email"
                  width={16}
                  height={16}
                />
              </div>
              <p>info@electrabd.com</p>
            </div>

            {/* Address Section */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Image
                  src="/images/map-pin.png"
                  alt="Address"
                  width={16}
                  height={16}
                />
              </div>
              <p>
                Tropical Mollah Tower (6th Floor), 15/1-15/4 Pragati Sarani,
                Middle Badda, Dhaka - 1212, Bangladesh
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-[15px] font-semibold text-gray-700">Connect With us</p>
            <div className="flex gap-4 text-blue-800">
              <Link href="#" className="hover:text-blue-500 transition-colors"><FaFacebookF size={20} /></Link>
              <Link href="#" className="hover:text-pink-600 transition-colors"><FaInstagram size={20} /></Link>
              <Link href="#" className="hover:text-red-600 transition-colors"><FaYoutube size={20} /></Link>
              <Link href="#" className="hover:text-blue-700 transition-colors"><FaLinkedinIn size={20} /></Link>
              <Link href="#" className="hover:text-green-500 transition-colors"><FaWhatsapp size={20} /></Link>
            </div>
          </div>

          {/* Mobile Service Numbers */}
          <div className="flex flex-row gap-3 py-4 lg:hidden">
            {/* Phone 1 */}
            <div className="flex items-center gap-3">
              {/* Icon Container with White Circle */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Image
                    src="/images/phone-call.png"
                    alt="Phone"
                    width={16}
                    height={16}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">09639 - 023023</p>
                <p className="text-xs text-gray-600">Service Centre 9:00 AM - 06:00</p>
              </div>
            </div>

            {/* Phone 2 */}
            <div className="flex items-center gap-3">
              {/* Icon Container with White Circle */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Image
                    src="/images/phone-call.png"
                    alt="Phone"
                    width={16}
                    height={16}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">01713 - 353431</p>
                <p className="text-xs text-gray-600">Online Support Center</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View - Grid Layout */}
        <div className="hidden lg:flex-1 lg:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Links */}
            <div className="]">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Company</h3>
              <ul className="space-y-2.5 text-[15px]">
                <li><Link href="/about-us" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link href="/brands" className="hover:text-blue-600 transition-colors">Brands</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
                <li><Link href="/emi-bank-list" className="hover:text-blue-600 transition-colors">EMI Bank List</Link></li>
                <li>
                  <Link href="/career" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    Career <span className="inline-block bg-[#006ce4] text-white text-[9px] px-1.5 py-0.5 rounded animate-pulse">We Are Hiring</span>
                  </Link>
                </li>
                <li><Link href="/policy/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/policy/terms" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/policy/warranty-policy" className="hover:text-blue-600 transition-colors">Warranty Policy</Link></li>
                <li><Link href="/policy/cancellation-refund" className="hover:text-blue-600 transition-colors">Cancellation & Refund</Link></li>
              </ul>
            </div>

            {/* My Account */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">My Account</h3>
              <ul className="space-y-2.5 text-[15px]">
                <li><Link href="/login" className="hover:text-blue-600 transition-colors">Login</Link></li>
                <li><Link href="/cart" className="hover:text-blue-600 transition-colors">View cart</Link></li>
                <li><Link href="/wishlist" className="hover:text-blue-600 transition-colors">My Wishlist</Link></li>
                <li><Link href="/track-order" className="hover:text-blue-600 transition-colors">Track My Order</Link></li>
                <li><Link href="/help-ticket" className="hover:text-blue-600 transition-colors">Help Ticket</Link></li>
                <li><Link href="/shipping-details" className="hover:text-blue-600 transition-colors">Shipping Details</Link></li>
                <li><Link href="/compare-products" className="hover:text-blue-600 transition-colors">Compare Products</Link></li>
                <li><Link href="/faqs" className="hover:text-blue-600 transition-colors">Frequently Ask Questions</Link></li>
              </ul>
            </div>

            {/* After Sales Support */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">After Sales Support</h3>
              <div className="space-y-5 text-[15px]">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">• Samsung</p>
                  <p className="font-medium">+88 09612 300 300<br />08000 300 300<br />(Toll-Free) All Working Days 24/7</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">• Electra</p>
                  <p className="font-medium">+88 09639 023 023<br />Saturday-Thursday<br />(9 am-6 pm)</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">• Whirlpool</p>
                  <p className="font-medium">09610 20 40 20 ,<br />helpdeskbangladesh@<br />whirlpool.com</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">• Philips</p>
                  <p className="font-medium">+8809639023023</p>
                </div>
                <button className="w-full bg-[#005faa] text-white py-1 rounded-md font-semibold text-[13px] hover:bg-[#004a80] transition-colors shadow-sm ">
                  Service Request
                </button>
              </div>
            </div>

            {/* Popular */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular</h3>
              <ul className="space-y-2.5 text-[15px]">
                <li><Link href="/store-location" className="hover:text-blue-600 transition-colors">Store Location</Link></li>
                <li><Link href="/exchange-product" className="hover:text-blue-600 transition-colors">Exchange Product</Link></li>
                <li><Link href="/kisti" className="hover:text-blue-600 transition-colors">Higher sale kisti</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
                <li><Link href="/blogs-news" className="hover:text-blue-600 transition-colors">Blogs & News</Link></li>
              </ul>

              <div className="w-full mt-8 hidden lg:block">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Secured Payment Method</h3>

                <div className="flex gap-4 items-center mb-6">
                  {/* Cash on Delivery Image Container */}
                  <div className="rounded p-2 flex items-center justify-center bg-white shadow-sm">
                    <Image
                      src="/images/easycod.png"
                      alt="Cash on Delivery"
                      width={120}
                      height={40}
                      className="object-contain"
                    />
                  </div>

                  {/* Easy EMI Payment Image Container */}
                  <div className="rounded p-2 flex items-center justify-center bg-white shadow-sm">
                    <Image
                      src="/images/easyemi.png"
                      alt="Easy EMI Payment"
                      width={120}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <Image
                    src="/images/pmethod.png"
                    alt="Payment Methods"
                    width={300}
                    height={80}
                    className="w-full h-auto transition-all duration-300"
                  />
                </div>

                <p className="text-[#0054A6] text-[15px] font-semibold text-center mt-4">
                  15% discount on pay with visa Master card
                </p>
              </div>

            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Service</h3>
              <ul className="space-y-2.5 text-[15px]">
                <li><Link href="/installation" className="hover:text-blue-600 transition-colors">Installation</Link></li>
                <li><Link href="/service-hour" className="hover:text-blue-600 transition-colors">Service Hour</Link></li>
                <li><Link href="/service-charge" className="hover:text-blue-600 transition-colors">Service Charge</Link></li>
                <li><Link href="/service-payment" className="hover:text-blue-600 transition-colors">Service Payment</Link></li>
                <li><Link href="/chat" className="hover:text-blue-600 transition-colors">Chat With us</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile View - Accordion Layout */}
        <div className="lg:hidden w-full">
          {/* Company Accordion */}
          <div className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('company')}
              className="w-full flex justify-between items-center py-1 px-4 text-left bg-[#B4CBE3] hover:bg-[#A8B8D0] transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800">Company</h3>
              {openSections.company ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openSections.company && (
              <ul className="pb-4 pt-2 px-4 space-y-2 text-[15px] bg-white transition-all duration-300 ease-in-out">
                <li><Link href="/about-us" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link href="/brands" className="hover:text-blue-600 transition-colors">Brands</Link></li>
                <li><Link href="/contact-us" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
                <li><Link href="/emi-bank-list" className="hover:text-blue-600 transition-colors">EMI Bank List</Link></li>
                <li>
                  <Link href="/career" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    Career <span className="inline-block bg-[#006ce4] text-white text-[9px] px-1.5 py-0.5 rounded animate-pulse">We Are Hiring</span>
                  </Link>
                </li>
                <li><Link href="/policy/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/policy/terms" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/policy/warranty-policy" className="hover:text-blue-600 transition-colors">Warranty Policy</Link></li>
                <li><Link href="/policy/cancellation-refund" className="hover:text-blue-600 transition-colors">Cancellation & Refund</Link></li>
              </ul>
            )}
          </div>

          {/* My Account Accordion */}
          <div className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('myAccount')}
              className="w-full flex justify-between items-center py-1 px-4 text-left bg-[#B4CBE3] hover:bg-[#A8B8D0] transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800">My Account</h3>
              {openSections.myAccount ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openSections.myAccount && (
              <ul className="pb-4 pt-2 px-4 space-y-2 text-[15px] bg-white transition-all duration-300 ease-in-out">
                <li><Link href="/login" className="hover:text-blue-600 transition-colors">Login</Link></li>
                <li><Link href="/cart" className="hover:text-blue-600 transition-colors">View cart</Link></li>
                <li><Link href="/wishlist" className="hover:text-blue-600 transition-colors">My Wishlist</Link></li>
                <li><Link href="/track-order" className="hover:text-blue-600 transition-colors">Track My Order</Link></li>
                <li><Link href="/help-ticket" className="hover:text-blue-600 transition-colors">Help Ticket</Link></li>
                <li><Link href="/shipping-details" className="hover:text-blue-600 transition-colors">Shipping Details</Link></li>
                <li><Link href="/compare-products" className="hover:text-blue-600 transition-colors">Compare Products</Link></li>
                <li><Link href="/faqs" className="hover:text-blue-600 transition-colors">Frequently Ask Questions</Link></li>
              </ul>
            )}
          </div>

          {/* After Sales Support Accordion */}
          <div className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('afterSales')}
              className="w-full flex justify-between items-center py-1 px-4 text-left bg-[#B4CBE3] hover:bg-[#A8B8D0] transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800">After sales support</h3>
              {openSections.afterSales ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openSections.afterSales && (
              <div className="pb-4 px-4 pt-2 space-y-4 text-[15px] bg-white transition-all duration-300 ease-in-out">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">• Samsung</p>
                  <p className="font-medium">+88 09612 300 300<br />08000 300 300<br />(Toll-Free) All Working Days 24/7</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">• Electra</p>
                  <p className="font-medium">+88 09639 023 023<br />Saturday-Thursday<br />(9 am-6 pm)</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">• Whirlpool</p>
                  <p className="font-medium">09610 20 40 20 ,<br />helpdeskbangladesh@<br />whirlpool.com</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">• Philips</p>
                  <p className="font-medium">+8809639023023</p>
                </div>
                <button className="w-full bg-[#005faa] text-white py-2.5 rounded-md font-semibold text-[14px] hover:bg-[#004a80] transition-colors shadow-sm mt-2">
                  Service Request
                </button>
              </div>
            )}
          </div>

          {/* Popular Accordion */}
          <div className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('popular')}
              className="w-full flex justify-between items-center py-1 px-4 text-left bg-[#B4CBE3] hover:bg-[#A8B8D0] transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800">Popular</h3>
              {openSections.popular ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openSections.popular && (
              <ul className="pb-4 pt-2 px-4 space-y-2 text-[15px] bg-white transition-all duration-300 ease-in-out">
                <li><Link href="/store-location" className="hover:text-blue-600 transition-colors">Store Location</Link></li>
                <li><Link href="/exchange-product" className="hover:text-blue-600 transition-colors">Exchange Product</Link></li>
                <li><Link href="/kisti" className="hover:text-blue-600 transition-colors">Higher sale kisti</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
                <li><Link href="/blogs-news" className="hover:text-blue-600 transition-colors">Blogs & News</Link></li>
              </ul>
            )}
          </div>

          {/* Customer Service Accordion */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('customerService')}
              className="w-full flex justify-between items-center py-1 px-4 text-left bg-[#B4CBE3] hover:bg-[#A8B8D0] transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800">Customer service</h3>
              {openSections.customerService ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openSections.customerService && (
              <ul className="pb-4 pt-2 px-4 space-y-2 text-[15px] bg-white transition-all duration-300 ease-in-out">
                <li><Link href="/installation" className="hover:text-blue-600 transition-colors">Installation</Link></li>
                <li><Link href="/service-hour" className="hover:text-blue-600 transition-colors">Service Hour</Link></li>
                <li><Link href="/service-charge" className="hover:text-blue-600 transition-colors">Service Charge</Link></li>
                <li><Link href="/service-payment" className="hover:text-blue-600 transition-colors">Service Payment</Link></li>
                <li><Link href="/chat" className="hover:text-blue-600 transition-colors">Chat With us</Link></li>
              </ul>
            )}
          </div>
        </div>

      </div>

      {/* Secured Payment Method - Full Width Section */}
      <div className="w-full mt-8 flex flex-col lg:hidden items-center md:items-start">
        {/* Title: Centered on mobile, left-aligned on desktop */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center md:text-left w-full">
          Secured Payment Method
        </h3>

        {/* Image row: Centered on mobile, gap-4 on desktop */}
        <div className="flex gap-4 items-center justify-center md:justify-start mb-6 w-full">
          {/* Cash on Delivery */}
          <div className="rounded p-2 flex items-center justify-center bg-white shadow-sm">
            <Image
              src="/images/easycod.png"
              alt="Cash on Delivery"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>

          {/* Easy EMI */}
          <div className="rounded p-2 flex items-center justify-center bg-white shadow-sm">
            <Image
              src="/images/easyemi.png"
              alt="Easy EMI Payment"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        {/* Full Payment Methods Image */}
        <div className="text-center w-11/12 mx-auto">
          <Image
            src="/images/pmethod.png"
            alt="Payment Methods"
            width={300}
            height={80}
            className="w-full h-auto transition-all duration-300 mx-auto md:mx-0"
          />
        </div>

        {/* Promo Text: Always centered based on your original code, but kept text-center */}
        <p className="text-[#0054A6] text-[15px] font-semibold text-center mt-4 w-full">
          15% discount on pay with visa Master card
        </p>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto px-4 lg:px-12 mt-12 pt-6 border-t border-blue-200">
        <p className="text-center text-blue-600 text-[15px] font-medium">
          &copy; {mounted ? currentYear : 2026} samsung electra.all rights reserved
        </p>
      </div>
    </footer>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FaChevronUp, FaWhatsapp } from "react-icons/fa";
import { SiMessenger } from "react-icons/si";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [footerData, setFooterData] = useState<any>(null);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    fetch("/api/footer-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setFooterData(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch footer data:", err));
  }, []);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.scrollY > 300) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 300) {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScroll]);

  const getWhatsappHref = (raw: string | undefined) => {
    if (!raw) return "#";
    const trimmed = raw.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    let cleaned = trimmed.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("0")) {
      cleaned = "88" + cleaned;
    }
    return `https://wa.me/${cleaned}`;
  };
const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const getMessengerHref = (facebookLink: string | undefined) => {
    if (!facebookLink) return "#";
    return facebookLink.trim().replace(/(https?:\/\/)?(www\.)?facebook\.com\//, "https://m.me/");
  };

  const whatsappUrl = getWhatsappHref(footerData?.whatsapp_link);
  const messengerUrl = getMessengerHref(footerData?.facebook_link);

  return (
    <>
      <div className="fixed right-4 bottom-20 lg:bottom-auto lg:top-[48%] lg:[@media(max-height:720px)]:top-[45%] lg:right-10 z-[10000] flex flex-col-reverse lg:flex-col items-end pointer-events-none">
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl overflow-hidden bg-[#3B82F6] shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20 focus:outline-none pointer-events-auto"
      >
        <Image
          src="/images/flotingIcon2.png"
          alt="Contact Support"
          width={64}
          height={64}
          priority
          className="w-full h-full p-2 object-contain"
        />
      </button>

      {/* Contact Menu Card */}
      <div
        className={`mb-3 lg:mb-0 lg:mt-3 w-[280px] sm:w-[320px] lg:w-[350px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden transition-all duration-300 transform origin-bottom-right lg:origin-top-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 lg:-translate-y-4 pointer-events-none"
        }`}
      >
        {/* Card Header */}
        <div className="relative text-center py-2.5 lg:py-4 border-b border-slate-100">
          <span className="font-semibold text-slate-800 text-xs lg:text-[15px]">Support & Contact</span>
          {/* Decorative bar */}
          <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-1 lg:mt-2" />
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label="Close contact menu"
          >
            <IoClose className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 lg:p-6 text-left">
          <h3 className="font-bold text-lg lg:text-2xl text-slate-800 mb-1 lg:mb-2">Hello!</h3>
          <p className="text-slate-500 text-xs lg:text-sm leading-relaxed mb-4 lg:mb-6">
            Get Faster answers! Connect with us for personalized support & expert advice.
          </p>

          <div className="space-y-2 lg:space-y-4">
            {/* Whatsapp Option */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 lg:gap-3.5 p-1 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <FaWhatsapp className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <span className="text-xs lg:text-[15px] font-semibold text-slate-700 group-hover:text-slate-900">
                Chat on Whatsapp
              </span>
            </a>

            {/* Messenger Option */}
           <a
  href={messengerUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 lg:gap-3.5 p-1 rounded-xl hover:bg-slate-50 transition-colors group"
>
  {/* Messenger Icon */}
  <div className="w-9 h-9 lg:w-11 lg:h-11 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
    <svg
      viewBox="0 0 48 48"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="messengerGradient"
          x1="6.8"
          y1="41.2"
          x2="41.2"
          y2="6.8"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0099FF" />
          <stop offset="35%" stopColor="#A033FF" />
          <stop offset="70%" stopColor="#FF52A0" />
          <stop offset="100%" stopColor="#FF7061" />
        </linearGradient>
      </defs>
      <path
        d="M24 4C12.95 4 4 12.4 4 22.8c0 5.9 2.87 11.2 7.37 14.8V44l6.19-3.4c2.04.57 4.2.88 6.44.88 11.05 0 20-8.4 20-18.8S35.05 4 24 4z"
        fill="url(#messengerGradient)"
      />
      <path
        d="M25.8 28.5l-5.6-6-10.9 6 12-12.7 5.6 6 10.9-6-12 12.7z"
        fill="#FFFFFF"
      />
    </svg>
  </div>

  <span className="text-xs lg:text-[15px] font-semibold text-slate-700 group-hover:text-slate-900">
    Chat on messenger
  </span>
</a>
          </div>
        </div>
      </div>

    
    </div>

      {/* Separate Scroll To Top Button (At the bottom right) */}
      <div className="fixed right-4 bottom-36 lg:right-10 lg:bottom-8 z-[9999] pointer-events-none">
        <button
          onClick={scrollToTop}
          className={`w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-[#2B7FE8] hover:bg-blue-600 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 flex items-center justify-center pointer-events-auto focus:outline-none hover:scale-105 active:scale-95 ${
            showScroll ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none h-0 w-0 overflow-hidden"
          }`}
          aria-label="Scroll to top"
        >
          <FaChevronUp className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
      </div>
    </>
  );
}

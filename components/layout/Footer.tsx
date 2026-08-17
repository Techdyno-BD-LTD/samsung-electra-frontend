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
  FaTiktok,
  FaChevronUp
} from "react-icons/fa";

type FooterLink = {
  label: string;
  url: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

type FooterData = {
  title: string;
  description: string;
  about_us_description: string;
  company_name: string;
  address: string;
  phone: string;
  email: string;
  copyright_text: string;
  footer_logo: string;
  play_store_link: string;
  app_store_link: string;
  payment_title: string;
  payment_image: string;
  facebook_link?: string;
  instagram_link?: string;
  youtube_link?: string;
  linkedin_link?: string;
  whatsapp_link?: string;
  tiktok_link?: string;
  sections: FooterSection[];
};

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
    fetch("/api/footer-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setFooterData(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch footer data:", err));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getSection = (title: string) => {
    return footerData?.sections?.find((s) => s.title?.trim().toLowerCase() === title.trim().toLowerCase()) || { title, links: [] };
  };

  const companySection = getSection("Company");
  const myAccountSection = getSection("My Account");
  const afterSalesSection = getSection("After Sales Support");
  const popularSection = getSection("Popular");

  const getWhatsappHref = (raw: string | undefined) => {
    if (!raw) return "";
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

  // Fallback for phones if multiple are comma-separated
  const phones = footerData?.phone ? footerData.phone.split(',').map(p => p.trim()) : ["+8809639023023", "+8801713353431"];
  
  // Format the title text so it renders nicely
  const titleText = footerData?.title || "Electra International | Your Comfort Our Promise The Largest Home Appliance Brand In Bangladesh";

  const [mobileExpanded, setMobileExpanded] = useState<string | null>("popular");

  const toggleMobileSection = (section: string) => {
    setMobileExpanded(mobileExpanded === section ? null : section);
  };

  return (
    <>
      {/* Mobile Layout */}
      <footer 
        className="lg:hidden w-full bg-cover bg-center bg-no-repeat text-white/95 pt-8 pb-0 select-none"
        style={{ backgroundImage: "url('/images/footerbg2.webp')" }}
      >
        <div className="px-6 space-y-6">
          {/* Logo centered */}
          <div className="flex justify-center w-full pb-2 border-b border-white/10">
            {footerData?.footer_logo ? (
              <Image
                src={footerData.footer_logo}
                alt="Footer Logo"
                width={200}
                height={32}
                className="h-auto object-contain"
              />
            ) : (
              <Image
                src="/images/electralogo.webp"
                alt="Samsung Electra"
                width={200}
                height={32}
                className="h-auto object-contain"
              />
            )}
          </div>

          {/* About Us */}
          <div className="space-y-2">
            <h3 className="text-[14px] font-bold text-white uppercase tracking-wider">
              About Us
            </h3>
            <p className="text-[12px] leading-relaxed text-white/80">
              {titleText}
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-white uppercase tracking-wider">
              Contact
            </h3>
            <div className="space-y-3 text-[12px] text-white/80">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="font-semibold text-white/90">
                  {phones.join(" | ")}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="font-semibold text-white/90">{footerData?.email || "info@electrabd.com"}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="leading-relaxed font-semibold text-white/90">
                  {footerData?.address || "Tropical Mollah Tower (6th Floor), 15/1-15/4 Pragati Sarani, Middle Badda, Dhaka - 1212, Bangladesh"}
                </p>
              </div>
            </div>
          </div>

          {/* Social Follow Us block */}
          <div className="space-y-2.5 pt-2">
            <h3 className="text-[14px] font-bold text-white uppercase tracking-wider">Follow Us</h3>
            <div className="flex gap-3">
              {[
                { 
                  icon: (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8H7v3h2v9h3v-9h3.6l.4-3H12V6c0-.9.2-1.2 1.1-1.2H15V1h-2.9C9.7 1 9 2.2 9 4.8V8z" />
                    </svg>
                  ), 
                  href: footerData?.facebook_link, 
                  color: "text-[#2563EB] border-[#2563EB] hover:bg-blue-50" 
                },
                { 
                  icon: (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                    </svg>
                  ), 
                  href: footerData?.instagram_link, 
                  color: "text-slate-300 border-slate-400 hover:bg-slate-50" 
                },
                { 
                  icon: (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 15.02l5.75-3.02-5.75-3z" />
                    </svg>
                  ), 
                  href: footerData?.youtube_link, 
                  color: "text-slate-300 border-slate-400 hover:bg-slate-50" 
                },
                { 
                  icon: (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  ), 
                  href: footerData?.linkedin_link, 
                  color: "text-slate-300 border-slate-400 hover:bg-slate-50" 
                },
                { 
                  icon: (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.166-1.495-.69-2.433-2.878-2.433-4.617 0-3.77 2.739-7.23 7.894-7.23 4.15 0 7.375 2.957 7.375 6.9 0 4.124-2.593 7.44-6.19 7.44-1.205 0-2.338-.625-2.725-1.363l-.742 2.828c-.269 1.025-1.006 2.308-1.499 3.097 1.12.347 2.309.537 3.541.537 6.62 0 11.988-5.367 11.988-11.987C24 5.367 18.632 0 12.017 0z" />
                    </svg>
                  ), 
                  href: footerData?.tiktok_link || "#", 
                  color: "text-slate-300 border-slate-400 hover:bg-slate-50" 
                }
              ].map((soc, sIdx) => {
                if (!soc.href) return null;
                return (
                  <a 
                    key={sIdx} 
                    href={soc.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${soc.color}`}
                  >
                    {soc.icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Newsletter */}
          <div className="pt-2 space-y-3">
            <h4 className="text-[13px] font-bold text-white uppercase">Don&apos;t Miss Your Cart!</h4>
            <div className="flex w-full items-center bg-[#1A1A1A]/80 border border-white/20 rounded-md overflow-hidden">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
              />
              <button className="bg-[#2B7FE8] hover:bg-blue-700 text-white text-[11px] font-bold px-5 py-2.5 transition-colors shrink-0">
                SIGN UP
              </button>
            </div>
          </div>

          {/* Accordion Blocks */}
          <div className="space-y-3 pt-3">
            {/* 1. POPULAR ACCORDION */}
            <div>
              <button
                onClick={() => toggleMobileSection("popular")}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-colors ${
                  mobileExpanded === "popular" ? "bg-[#2B7FE8]" : "bg-[#294c94]"
                }`}
              >
                <span>POPULAR</span>
                <span className="text-[10px]">{mobileExpanded === "popular" ? "▼" : "▶"}</span>
              </button>
              {mobileExpanded === "popular" && (
                <ul className="px-4 py-2 space-y-2 text-[12px] text-white/80 bg-black/10 border-x border-b border-white/5 rounded-b-lg">
                  {popularSection.links.map((link, i) => (
                    <li key={i} className="py-1 border-b border-white/10 last:border-0">
                      <Link href={link.url} className="hover:text-blue-300 transition-colors block w-full">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 2. COMPANY ACCORDION */}
            <div>
              <button
                onClick={() => toggleMobileSection("company")}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-colors ${
                  mobileExpanded === "company" ? "bg-[#2B7FE8]" : "bg-[#294c94]"
                }`}
              >
                <span>COMPANY</span>
                <span className="text-[10px]">{mobileExpanded === "company" ? "▼" : "▶"}</span>
              </button>
              {mobileExpanded === "company" && (
                <ul className="px-4 py-2 space-y-2 text-[12px] text-white/80 bg-black/10 border-x border-b border-white/5 rounded-b-lg">
                  {companySection.links.map((link, i) => (
                    <li key={i} className="py-1 border-b border-white/10 last:border-0">
                      <Link href={link.url} className="hover:text-blue-300 transition-colors block w-full">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 3. ACCOUNT ACCORDION */}
            <div>
              <button
                onClick={() => toggleMobileSection("account")}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-colors ${
                  mobileExpanded === "account" ? "bg-[#2B7FE8]" : "bg-[#294c94]"
                }`}
              >
                <span>ACCOUNT</span>
                <span className="text-[10px]">{mobileExpanded === "account" ? "▼" : "▶"}</span>
              </button>
              {mobileExpanded === "account" && (
                <ul className="px-4 py-2 space-y-2 text-[12px] text-white/80 bg-black/10 border-x border-b border-white/5 rounded-b-lg">
                  {myAccountSection.links.map((link, i) => (
                    <li key={i} className="py-1 border-b border-white/10 last:border-0">
                      <Link href={link.url} className="hover:text-blue-300 transition-colors block w-full">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 4. AFTER SALES ACCORDION */}
            <div>
              <button
                onClick={() => toggleMobileSection("aftersales")}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-colors ${
                  mobileExpanded === "aftersales" ? "bg-[#2B7FE8]" : "bg-[#294c94]"
                }`}
              >
                <span>AFTER SALES SUPPORT</span>
                <span className="text-[10px]">{mobileExpanded === "aftersales" ? "▼" : "▶"}</span>
              </button>
              {mobileExpanded === "aftersales" && (
                <ul className="px-4 py-2 space-y-3.5 text-[11px] text-white/80 bg-black/10 border-x border-b border-white/5 rounded-b-lg">
                  {afterSalesSection.links.map((link, i) => {
                    const parts = link.label.split('-');
                    const centerName = parts[0]?.trim();
                    const restText = link.label.substring(link.label.indexOf('-') + 1)?.trim() || link.label;
                    return (
                      <li key={i} className="leading-snug border-b border-white/10 pb-1.5 last:border-0 last:pb-0">
                        <span className="font-semibold text-white block mb-0.5">{centerName}</span>
                        <span className="text-white/75 block">{restText}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Scroll To Top floating arrow inside Mobile (absolute layout helper) */}
        <div className="flex justify-end px-6 pt-6 select-none">
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full shadow"
            aria-label="Scroll to top"
          >
            <FaChevronUp className="w-4 h-4 text-white/85" />
          </button>
        </div>

        {/* Secured Payment Method Section */}
        <div className="w-full border-t border-white/10 mt-6 py-4 px-6 flex flex-col items-center gap-4">
          <div className="flex w-full items-center justify-between">
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">Secure Payment Method</span>
            {/* Cash on Delivery icon */}
            <div className="flex items-center gap-1.5 bg-white text-black px-2.5 py-1 rounded text-[10px] font-extrabold shadow-sm select-none">
              <svg className="w-4 h-4 text-[#2B7FE8]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>CASH ON DELIVERY</span>
            </div>
          </div>
          
          {/* Payment images row */}
          {footerData?.payment_image ? (
            <div className="w-full bg-white rounded-lg p-1">
              <Image
                src={footerData.payment_image}
                alt="Payment Methods"
                width={400}
                height={50}
                className="w-full h-auto object-contain"
              />
            </div>
          ) : (
            <div className="w-full bg-white rounded-lg p-1 flex justify-center">
              <Image src="/images/pmethod.png" alt="Payment Methods" width={320} height={40} className="h-auto object-contain" />
            </div>
          )}
        </div>

        {/* Footer Bottom copyright bar */}
        <div className="w-full bg-blue-600 py-3.5 px-4 text-center border-t border-white/10 select-none pb-[56px] md:pb-3.5">
          <p className="text-white text-[12px] font-semibold leading-relaxed">
            © Copyright {currentYear} | All rights reserved by Electra International
          </p>
        </div>
      </footer>

      {/* PC and Laptop Layout */}
      <footer 
        className="hidden lg:block w-full bg-cover bg-center bg-no-repeat text-white/95 pt-12 pb-0 border-t border-blue-900/20"
        style={{ backgroundImage: "url('/images/footerbg2.webp')" }}
      >
        {/* Footer Container */}
        <div className="mx-auto w-full lg:w-10/12 px-4 lg:px-0">
          {/* Logo block */}
          <div className="w-full mb-8">
            {footerData?.footer_logo ? (
              <Image
                src={footerData.footer_logo}
                alt="Footer Logo"
                width={220}
                height={36}
                className="h-auto"
              />
            ) : (
              <Image
                src="/images/electralogo.webp"
                alt="Samsung Electra"
                width={220}
                height={36}
                className="h-auto"
              />
            )}
          </div>

          {/* Grid containing all 6 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 w-full items-start">
            {/* Column 1: CONTACT */}
            <div className="space-y-4">
              <h3 className="text-[14px] font-bold text-white uppercase tracking-wider border-b border-white/20 pb-2">
                Contact
              </h3>
              <div className="space-y-3 text-[13px] text-white/80">
                <div className="flex items-start gap-2">
                  <Image src="/images/phone-call.png" alt="Phone" width={14} height={14} className="mt-0.5" />
                  <p>
                    {phones.map((phone, idx) => (
                      <span key={idx}>
                        {phone}
                        {idx < phones.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/images/mail.png" alt="Email" width={14} height={14} />
                  <p>{footerData?.email || "info@electrabd.com"}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Image src="/images/map-pin.png" alt="Address" width={14} height={14} className="mt-0.5" />
                  <p className="leading-relaxed">
                    {footerData?.address || "Tropical Mollah Tower (6th Floor), 15/1-15/4 Pragati Sarani, Middle Badda, Dhaka - 1212, Bangladesh"}
                  </p>
                </div>
              </div>

              {/* Email signup form */}
              <div className="pt-4 space-y-2">
                <p className="text-[13px] font-bold text-white">Don&apos;t Miss Your Cart!</p>
                <div className="flex w-full max-w-[240px] items-center bg-[#1A1A1A]/80 border border-white/20 rounded-md overflow-hidden">
                  <input 
                    type="email" 
                    placeholder="Enter email" 
                    className="w-full bg-transparent px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 transition-colors">
                    SIGN UP
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: POPULAR */}
            <div>
              <h3 className="text-[14px] font-bold text-white uppercase tracking-wider border-b border-white/20 pb-2 mb-4">
                {popularSection.title || "Popular"}
              </h3>
              <ul className="space-y-2.5 text-[13px] text-white/80">
                {popularSection.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.url} className="hover:text-blue-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: COMPANY */}
            <div>
              <h3 className="text-[14px] font-bold text-white uppercase tracking-wider border-b border-white/20 pb-2 mb-4">
                {companySection.title || "Company"}
              </h3>
              <ul className="space-y-2.5 text-[13px] text-white/80">
                {companySection.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.url} className="hover:text-blue-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: ACCOUNT */}
            <div>
              <h3 className="text-[14px] font-bold text-white uppercase tracking-wider border-b border-white/20 pb-2 mb-4">
                {myAccountSection.title || "Account"}
              </h3>
              <ul className="space-y-2.5 text-[13px] text-white/80">
                {myAccountSection.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.url} className="hover:text-blue-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: AFTER SALES SUPPORT */}
            <div>
              <h3 className="text-[14px] font-bold text-white uppercase tracking-wider border-b border-white/20 pb-2 mb-4">
                {afterSalesSection.title || "After Sales Support"}
              </h3>
              <ul className="space-y-4 text-[12px] mb-4 text-white/80">
                {afterSalesSection.links.map((link, i) => {
                  const parts = link.label.split('-');
                  const centerName = parts[0]?.trim();
                  const restText = link.label.substring(link.label.indexOf('-') + 1)?.trim() || link.label;
                  return (
                    <li key={i} className="leading-snug">
                      <span className="font-semibold text-white block mb-0.5">{centerName}</span>
                      <span className="text-white/75 block">{restText}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 6: ABOUT US */}
            <div className="space-y-4">
              <h3 className="text-[14px] font-bold text-white uppercase tracking-wider border-b border-white/20 pb-2">
                About Us
              </h3>
              <p className="text-[13px] leading-relaxed text-white/80">
                {titleText}
              </p>
              
              {/* Follow Us social links */}
              {(footerData?.facebook_link || footerData?.instagram_link || footerData?.youtube_link || footerData?.linkedin_link || footerData?.whatsapp_link || footerData?.tiktok_link) && (
                <div className="space-y-2">
                  <p className="text-[13px] font-bold text-white">Follow Us:</p>
                  <div className="flex gap-2 text-white">
                    {footerData?.facebook_link && (
                      <Link href={footerData.facebook_link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full">
                        <FaFacebookF size={13} />
                      </Link>
                    )}
                    {footerData?.instagram_link && (
                      <Link href={footerData.instagram_link} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full">
                        <FaInstagram size={13} />
                      </Link>
                    )}
                    {footerData?.youtube_link && (
                      <Link href={footerData.youtube_link} target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full">
                        <FaYoutube size={13} />
                      </Link>
                    )}
                    {footerData?.linkedin_link && (
                      <Link href={footerData.linkedin_link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full">
                        <FaLinkedinIn size={13} />
                      </Link>
                    )}
                    {footerData?.whatsapp_link && (
                      <Link href={getWhatsappHref(footerData.whatsapp_link)} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full">
                        <FaWhatsapp size={13} />
                      </Link>
                    )}
                    {footerData?.tiktok_link && (
                      <Link href={footerData.tiktok_link} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full">
                        <FaTiktok size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secured Payment Method Section */}
        <div className="w-full border-t border-white/10 mt-12 py-6">
          <div className="mx-auto w-full lg:w-10/12 flex flex-col md:flex-row items-center justify-center gap-6">
            <span className="text-[13px] font-bold text-white uppercase tracking-wider">Pay With</span>
            {footerData?.payment_image ? (
              <div className="max-w-[600px] w-full">
                <Image
                  src={footerData.payment_image}
                  alt="Payment Methods"
                  width={600}
                  height={80}
                  className="w-full h-auto object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="rounded p-1 bg-white shadow-sm flex items-center justify-center">
                  <Image src="/images/easycod.png" alt="Cash on Delivery" width={100} height={32} className="object-contain" />
                </div>
                <div className="rounded p-1 bg-white shadow-sm flex items-center justify-center">
                  <Image src="/images/easyemi.png" alt="Easy EMI Payment" width={100} height={32} className="object-contain" />
                </div>
                <div>
                  <Image src="/images/pmethod.png" alt="Payment Methods" width={320} height={40} className="h-auto object-contain" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="w-full bg-blue-500 py-2 px-4 lg:px-12 mt-12 relative border-t border-white/10">
          <p className="text-center text-white text-[16px] tracking-wide font-medium">
            {footerData?.copyright_text || `© ${mounted ? currentYear : 2026} samsung electra.all rights reserved`}
          </p>

          {/* Scroll To Top Button (Inside Footer Only) */}
          <button
            onClick={scrollToTop}
            className="absolute right-4 lg:right-12 -top-10 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full shadow transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Scroll to top"
          >
            <FaChevronUp className="w-5 h-5 text-white" />
          </button>
        </div>
      </footer>
    </>
  );
}

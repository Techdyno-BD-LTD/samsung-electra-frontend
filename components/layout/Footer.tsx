"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  FaWhatsapp,
  FaTiktok,
  FaPinterestP,
  FaPhoneSquare
} from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { TiSocialFacebook, TiSocialLinkedin } from "react-icons/ti";
import { RiInstagramLine } from "react-icons/ri";
import { IoMdMail } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";

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
  cod_image?: string;
  facebook_link?: string;
  instagram_link?: string;
  youtube_link?: string;
  linkedin_link?: string;
  pinterest_link?: string;
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

  // const scrollToTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // };

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

  const socialLinks = [
    {
      href: footerData?.facebook_link,
      icon: <TiSocialFacebook size={24} />,
      colorClass: "border-white text-white hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10",
    },
    {
      href: footerData?.instagram_link,
      icon: <RiInstagramLine size={18} />,
      colorClass: "border-white text-white hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10",
    },
    {
      href: footerData?.youtube_link,
      icon: <FaYoutube size={18} />,
      colorClass: "border-white text-white hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10",
    },
    {
      href: footerData?.linkedin_link,
      icon: <TiSocialLinkedin size={24} />,
      colorClass: "border-white text-white hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10",
    },
    {
      href: footerData?.pinterest_link,
      icon: <FaPinterestP size={16} />,
      colorClass: "border-white text-white hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10",
    },
    {
      href: footerData?.whatsapp_link ? getWhatsappHref(footerData.whatsapp_link) : undefined,
      icon: <FaWhatsapp size={18} />,
      colorClass: "border-white text-white hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10",
    },
    {
      href: footerData?.tiktok_link,
      icon: <FaTiktok size={16} />,
      colorClass: "border-white text-white hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10",
    },
  ].filter(item => !!item.href);

  return (
    <>
      {/* Mobile Layout */}
      <footer 
        className="lg:hidden w-full bg-cover bg-center bg-no-repeat text-white/95 pt-8 pb-0 select-none"
        style={{ backgroundImage: "url('/images/footerbg2.webp')" }}
      >
        <div className="px-6 space-y-6">
          {/* Logo centered */}
          <div className="flex justify-start w-full pb-2 border-b border-white/10">
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
                <FaPhoneSquare className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#007EEF" }} />
                <p className="font-normal text-white/90">
                  {phones.join(" | ")}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <IoMdMail className="w-4 h-4 flex-shrink-0" style={{ color: "#007EEF" }} />
                <p className="font-normal text-white/90">{footerData?.email || "info@electrabd.com"}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <FaLocationDot className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#007EEF" }} />
                <p className="leading-relaxed font-normal text-white/90">
                  {footerData?.address || "Tropical Mollah Tower (6th Floor), 15/1-15/4 Pragati Sarani, Middle Badda, Dhaka - 1212, Bangladesh"}
                </p>
              </div>
            </div>
          </div>

          {/* Social Follow Us block */}
          {socialLinks.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h3 className="text-[14px] font-bold text-white uppercase tracking-wider">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((soc, sIdx) => (
                  <a 
                    key={sIdx} 
                    href={soc.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`flex items-center justify-center w-[36px] h-[36px] rounded-full border transition-all duration-300 ${soc.colorClass}`}
                  >
                    {soc.icon}
                  </a>
                ))}
              </div>
            </div>
          )}

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
                <span className="text-[10px] transition-transform duration-300" style={{ transform: mobileExpanded === "popular" ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  mobileExpanded === "popular" ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                <ul className="px-4 py-2 space-y-2 text-[12px] text-white/80 bg-black/10 border-x border-b border-white/5 rounded-b-lg">
                  {popularSection.links.map((link, i) => (
                    <li key={i} className="py-1 border-b border-white/10 last:border-0">
                      <Link href={link.url} className="hover:text-blue-300 transition-colors block w-full">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
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
                <span className="text-[10px] transition-transform duration-300" style={{ transform: mobileExpanded === "company" ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  mobileExpanded === "company" ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                <ul className="px-4 py-2 space-y-2 text-[12px] text-white/80 bg-black/10 border-x border-b border-white/5 rounded-b-lg">
                  {companySection.links.map((link, i) => (
                    <li key={i} className="py-1 border-b border-white/10 last:border-0">
                      <Link href={link.url} className="hover:text-blue-300 transition-colors block w-full">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
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
                <span className="text-[10px] transition-transform duration-300" style={{ transform: mobileExpanded === "account" ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  mobileExpanded === "account" ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                <ul className="px-4 py-2 space-y-2 text-[12px] text-white/80 bg-black/10 border-x border-b border-white/5 rounded-b-lg">
                  {myAccountSection.links.map((link, i) => (
                    <li key={i} className="py-1 border-b border-white/10 last:border-0">
                      <Link href={link.url} className="hover:text-blue-300 transition-colors block w-full">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
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
                <span className="text-[10px] transition-transform duration-300" style={{ transform: mobileExpanded === "aftersales" ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  mobileExpanded === "aftersales" ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
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
              </div>
            </div>
          </div>
        </div>

        {/* Scroll To Top floating arrow inside Mobile (absolute layout helper) */}
        {/* <div className="flex justify-end px-6 pt-6 select-none">
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full shadow"
            aria-label="Scroll to top"
          >
            <FaChevronUp className="w-4 h-4 text-white/85" />
          </button>
        </div> */}

        {/* Secured Payment Method Section */}
        <div className="w-full border-t border-white/10 mt-6 py-4 px-6 flex flex-col items-center gap-4">
          <div className="flex w-full items-center justify-between">
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">Secure Payment Method</span>
            {/* Cash on Delivery icon */}
            {footerData?.cod_image && (
              <div className="w-30 h-10 flex justify-center">
                <Image
                  src={footerData.cod_image}
                  alt="Cash on Delivery"
                  width={100}
                  height={25}
                  className="h-auto object-contain"
                />
              </div>
            )}
          </div>
          
          {/* Payment images row */}
          <div className="w-full flex flex-col gap-2">
            {footerData?.payment_image && (
              <div className="w-full bg-white rounded-lg p-1">
                <Image
                  src={footerData.payment_image}
                  alt="Payment Methods"
                  width={400}
                  height={50}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
            
            {!footerData?.payment_image && !footerData?.cod_image && (
              <div className="w-full bg-white rounded-lg p-1 flex justify-center">
                <Image src="/images/pmethod.png" alt="Payment Methods" width={320} height={40} className="h-auto object-contain" />
              </div>
            )}
          </div>
        </div>

        {/* Footer Bottom copyright bar */}
        <div className="w-full bg-blue-600 py-2 px-4 text-center border-t border-white/10 select-none pb-[56px] md:pb-3.5">
          <p className="text-white text-[10px] mb-2 font-normal leading-relaxed">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 w-full items-start">
            {/* Column 1: CONTACT */}
            <div className="space-y-4 lg:col-span-3 md:col-span-1 col-span-1">
              <h3 className="text-[14px] font-bold text-white uppercase tracking-wider border-b border-white/20 pb-2">
                Contact
              </h3>
              <div className="space-y-3 text-[13px] text-white/80">
                <div className="flex items-start gap-2.5">
                  <FaPhoneSquare className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#007EEF" }} />
                  <p className="font-semibold text-white/95">
                    {phones.map((phone, idx) => (
                      <span key={idx}>
                        {phone}
                        {idx < phones.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <IoMdMail className="w-4 h-4 flex-shrink-0" style={{ color: "#007EEF" }} />
                  <p className="font-semibold text-white/95">{footerData?.email || "info@electrabd.com"}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <FaLocationDot className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#007EEF" }} />
                  <p className="leading-relaxed font-semibold text-white/95">
                    {footerData?.address || "Tropical Mollah Tower (6th Floor), 15/1-15/4 Pragati Sarani, Middle Badda, Dhaka - 1212, Bangladesh"}
                  </p>
                </div>
              </div>

              {/* Email signup form */}
              <div className="pt-4 space-y-2">
                <p className="text-[13px] font-bold text-white">Don&apos;t Miss Your Cart!</p>
                <div className="flex w-full max-w-[340px] items-center bg-[#1A1A1A]/80 border border-white/20 rounded-md overflow-hidden">
                  <input 
                    type="email" 
                    placeholder="Enter email" 
                    className="w-full bg-transparent px-3 py-23 text-xs text-white placeholder-white/40 focus:outline-none"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-6 py-3 transition-colors whitespace-nowrap">
                    SIGN UP
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: POPULAR */}
            <div className="lg:col-span-1 md:col-span-1 col-span-1">
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
            <div className="lg:col-span-2 md:col-span-1 col-span-1">
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
            <div className="lg:col-span-2 md:col-span-1 col-span-1">
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
            <div className="lg:col-span-2 md:col-span-1 col-span-1">
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
            <div className="lg:col-span-2 md:col-span-1 col-span-1 space-y-4">
              <h3 className="text-[14px] font-bold text-white uppercase tracking-wider border-b border-white/20 pb-2">
                About Us
              </h3>
              <p className="text-[13px] leading-relaxed text-white/80">
                {titleText}
              </p>
              
              {/* Follow Us social links */}
              {socialLinks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[13px] font-bold text-white">Follow Us:</p>
                  <div className="flex gap-2 text-white">
                    {socialLinks.map((soc, sIdx) => (
                      <Link 
                        key={sIdx} 
                        href={soc.href!} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`flex items-center justify-center w-[36px] h-[36px] rounded-full border transition-all duration-300 ${soc.colorClass}`}
                      >
                        {soc.icon}
                      </Link>
                    ))}
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
            <div className="flex flex-wrap items-center justify-center gap-6">
              {footerData?.payment_image && (
                <div className="max-w-[600px] w-full">
                  <Image
                    src={footerData.payment_image}
                    alt="Payment Methods"
                    width={600}
                    height={80}
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}
              {footerData?.cod_image && (
                <div className="max-w-[200px] w-full">
                  <Image
                    src={footerData.cod_image}
                    alt="Cash on Delivery"
                    width={200}
                    height={80}
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}
              {!footerData?.payment_image && !footerData?.cod_image && (
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
        </div>

        {/* Footer Bottom */}
        <div className="w-full bg-blue-500 py-2 px-4 lg:px-12 mt-2 relative border-t border-white/10">
          <p className="text-center text-white text-[16px] tracking-wide font-normal">
            {footerData?.copyright_text || `© ${mounted ? currentYear : 2026} samsung electra.all rights reserved`}
          </p>

          {/* Scroll To Top Button (Inside Footer Only) */}
          {/* <button
            onClick={scrollToTop}
            className="absolute right-4 lg:right-12 -top-10 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full shadow transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Scroll to top"
          >
            <FaChevronUp className="w-5 h-5 text-white" />
          </button> */}
        </div>
      </footer>
    </>
  );
}

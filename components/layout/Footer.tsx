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

  return (
    <footer 
      className="w-full bg-cover bg-center bg-no-repeat text-white/95 pt-12 pb-0 border-t border-blue-900/20"
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
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
  FaChevronDown,
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
  sections: FooterSection[];
};

export default function Footer() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
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

  const handleServiceRequestClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard/service");
    } else {
      router.push("/login?redirect=/dashboard/service");
    }
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        if (key !== section) newState[key] = false;
      });
      return {
        ...newState,
        [section]: !prev[section]
      };
    });
  };

  const getSection = (title: string) => {
    return footerData?.sections?.find((s) => s.title?.trim().toLowerCase() === title.trim().toLowerCase()) || { title, links: [] };
  };

  const companySection = getSection("Company");
  const myAccountSection = getSection("My Account");
  const afterSalesSection = getSection("After Sales Support");
  const popularSection = getSection("Popular");
  const customerServiceSection = getSection("Customer Service");

  // Fallback for phones if multiple are comma-separated
  const phones = footerData?.phone ? footerData.phone.split(',').map(p => p.trim()) : ["+8809639023023", "+8801713353431"];
  
  // Format the title text so it renders nicely
  const titleText = footerData?.title || "Electra International | Your Comfort Our Promise The Largest Home Appliance Brand In Bangladesh";

  return (
    <footer className="w-full bg-[#E5F2FF] text-[#4a5568] pt-12 pb-6 border-t border-blue-100">
      {/* Main Container */}
      <div className=" mx-auto mainwidthmore lg:mainwidth flex flex-col lg:flex-row justify-between lg:gap-28">

        {/* Company Informations - Separate Div */}
        <div className="space-y-6 w-full lg:w-[25%]">
          <div className="space-y-1">
            {footerData?.footer_logo ? (
              <Image
                src={footerData.footer_logo}
                alt="Footer Logo"
                width={250}
                height={40}
                className="h-auto"
              />
            ) : (
              <Image
                src="/images/electralogo.webp"
                alt="Samsung Electra"
                width={250}
                height={40}
                className="h-auto"
              />
            )}
          </div>

          <p className="text-[15px] leading-relaxed">
            {titleText}
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
              <p>
                {phones.map((phone, idx) => (
                  <span key={idx}>
                    {phone}
                    {idx < phones.length - 1 && <br />}
                  </span>
                ))}
              </p>
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
              <p>{footerData?.email || "info@electrabd.com"}</p>
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
                {footerData?.address || "Tropical Mollah Tower (6th Floor), 15/1-15/4 Pragati Sarani, Middle Badda, Dhaka - 1212, Bangladesh"}
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
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Image src="/images/phone-call.png" alt="Phone" width={16} height={16} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">{phones[0] || "09639 - 023023"}</p>
                <p className="text-xs text-gray-600">Service Centre 9:00 AM - 06:00</p>
              </div>
            </div>

            {/* Phone 2 */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Image src="/images/phone-call.png" alt="Phone" width={16} height={16} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">{phones[1] || "01713 - 353431"}</p>
                <p className="text-xs text-gray-600">Online Support Center</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View - Grid Layout */}
        <div className="hidden lg:flex-1 lg:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Links */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{companySection.title || "Company"}</h3>
              <ul className="space-y-2.5 text-[15px]">
                {companySection.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.url} className="hover:text-blue-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* My Account */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{myAccountSection.title || "My Account"}</h3>
              <ul className="space-y-2.5 text-[15px]">
                {myAccountSection.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.url} className="hover:text-blue-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* After Sales Support */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{afterSalesSection.title || "After Sales Support"}</h3>
              <ul className="space-y-5 text-[15px] mb-4">
                {afterSalesSection.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.url} className="hover:text-blue-600 transition-colors">
                      <span className="font-semibold text-gray-700 mb-1 block">• {link.label.split('-')[0]?.trim()}</span>
                      <span className="font-medium block">{link.label.substring(link.label.indexOf('-') + 1)?.trim() || link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button 
                onClick={handleServiceRequestClick}
                className="w-full bg-[#005faa] text-white py-1 rounded-md font-semibold text-[13px] hover:bg-[#004a80] transition-colors shadow-sm mt-4"
              >
                Service Request
              </button>
            </div>

            {/* Popular */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{popularSection.title || "Popular"}</h3>
              <ul className="space-y-2.5 text-[15px]">
                {popularSection.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.url} className="hover:text-blue-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Secured Payment Method - Desktop */}
              <div className="w-full mt-8 hidden lg:block">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {footerData?.payment_title || "Secured Payment Method"}
                </h3>
                
                {footerData?.payment_image ? (
                  <div className="text-center w-[12rem]">
                    <Image
                      src={footerData.payment_image}
                      alt={footerData?.payment_title || "Payment Methods"}
                      width={300}
                      height={80}
                      className="w-full h-auto transition-all duration-300"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex gap-4 items-center mb-6">
                      <div className="rounded p-2 flex items-center justify-center bg-white shadow-sm">
                        <Image src="/images/easycod.png" alt="Cash on Delivery" width={120} height={40} className="object-contain" />
                      </div>
                      <div className="rounded p-2 flex items-center justify-center bg-white shadow-sm">
                        <Image src="/images/easyemi.png" alt="Easy EMI Payment" width={120} height={40} className="object-contain" />
                      </div>
                    </div>
                    <div className="text-center">
                      <Image src="/images/pmethod.png" alt="Payment Methods" width={300} height={80} className="w-full h-auto transition-all duration-300" />
                    </div>
                    <p className="text-[#0054A6] text-[15px] font-semibold text-center mt-4">
                      15% discount on pay with visa Master card
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{customerServiceSection.title || "Customer Service"}</h3>
              <ul className="space-y-2.5 text-[15px]">
                {customerServiceSection.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.url} className="hover:text-blue-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile View - Accordion Layout */}
        <div className="lg:hidden w-full">
          {footerData?.sections?.map((section, idx) => (
            <div key={idx} className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex justify-between items-center py-1 px-4 text-left bg-[#B4CBE3] hover:bg-[#A8B8D0] transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                {openSections[section.title] ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openSections[section.title] && (
                <div className="pb-4 pt-2 px-4 space-y-2 text-[15px] bg-white transition-all duration-300 ease-in-out">
                  <ul className="space-y-2">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <Link href={link.url} className="hover:text-blue-600 transition-colors">
                          {section.title === "After Sales Support" ? (
                            <>
                              <span className="font-semibold text-gray-700 mb-1 block">• {link.label.split('-')[0]?.trim()}</span>
                              <span className="font-medium block">{link.label.substring(link.label.indexOf('-') + 1)?.trim() || link.label}</span>
                            </>
                          ) : (
                            link.label
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {section.title === "After Sales Support" && (
                    <button 
                      onClick={handleServiceRequestClick}
                      className="w-full bg-[#005faa] text-white py-2.5 rounded-md font-semibold text-[14px] hover:bg-[#004a80] transition-colors shadow-sm mt-4"
                    >
                      Service Request
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Secured Payment Method - Full Width Section (Mobile) */}
      <div className="w-full mt-8 flex flex-col lg:hidden items-center md:items-start">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center md:text-left w-full">
          {footerData?.payment_title || "Secured Payment Method"}
        </h3>

        {footerData?.payment_image ? (
          <div className="text-center w-11/12 mx-auto">
            <Image
              src={footerData.payment_image}
              alt={footerData?.payment_title || "Payment Methods"}
              width={300}
              height={80}
              className="w-full h-auto transition-all duration-300 mx-auto md:mx-0"
            />
          </div>
        ) : (
          <>
            <div className="flex gap-4 items-center justify-center md:justify-start mb-6 w-full">
              <div className="rounded p-2 flex items-center justify-center bg-white shadow-sm">
                <Image src="/images/easycod.png" alt="Cash on Delivery" width={120} height={40} className="object-contain" />
              </div>
              <div className="rounded p-2 flex items-center justify-center bg-white shadow-sm">
                <Image src="/images/easyemi.png" alt="Easy EMI Payment" width={120} height={40} className="object-contain" />
              </div>
            </div>
            <div className="text-center w-11/12 mx-auto">
              <Image src="/images/pmethod.png" alt="Payment Methods" width={300} height={80} className="w-full h-auto transition-all duration-300 mx-auto md:mx-0" />
            </div>
            <p className="text-[#0054A6] text-[15px] font-semibold text-center mt-4 w-full">
              15% discount on pay with visa Master card
            </p>
          </>
        )}
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto px-4 lg:px-12 mt-12 pt-6 border-t border-blue-200">
        <p className="text-center text-blue-600 text-[15px] font-medium">
          {footerData?.copyright_text || `© ${mounted ? currentYear : 2026} samsung electra.all rights reserved`}
        </p>
      </div>
    </footer>
  );
}

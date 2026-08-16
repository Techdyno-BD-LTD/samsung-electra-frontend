"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { RiPhoneFill } from "react-icons/ri";
import { FiGlobe, FiPackage } from "react-icons/fi";

type HeaderData = {
  data: {
    topbar: {
      support_text?: string | null;
      promo_text?: string | null;
      promo_button_label?: string | null;
      promo_button_link?: string | null;
      utility_links?: Array<{ id: number; title: string; link: string; external_link: string | null; icon: string | null }>;
    };
  };
};

export default function TopBar() {
  const [supportText, setSupportText] = useState<string | null>(null);
  const [utilityLinks, setUtilityLinks] = useState<Array<{ id: number; title: string; link: string; external_link: string | null; icon: string | null }>>([]);

  useEffect(() => {
    let mounted = true;

    async function loadHeader() {
      try {
        const response = await fetch("/api/header", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as HeaderData;
        const topbar = payload.data?.topbar;
        if (mounted && topbar) {
          setSupportText(topbar.support_text?.trim() || null);
          setUtilityLinks((topbar.utility_links || []).filter((item) => item.title.trim() || item.link.trim() || Boolean(item.icon?.trim())));
        }
      } catch {
        if (mounted) setUtilityLinks([]);
      }
    }

    loadHeader();
    return () => {
      mounted = false;
    };
  }, []);

  const renderLink = (key: string | number, href: string, children: React.ReactNode, className: string) =>
    /^https?:\/\//i.test(href) ? (
      <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    ) : (
      <Link key={key} href={href || "#"} className={className}>
        {children}
      </Link>
    );

  const getUtilityIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("b2b") || lower.includes("dealership")) {
      return <FiGlobe className="text-[#1e90ff] text-[24px] flex-shrink-0" />;
    }
    if (lower.includes("store") || lower.includes("location")) {
      return <HiOutlineBuildingStorefront className="text-[#1e90ff] text-[24px] flex-shrink-0" />;
    }
    if (lower.includes("track") || lower.includes("order")) {
      return <FiPackage className="text-[#1e90ff] text-[24px] flex-shrink-0" />;
    }
    return null;
  };

  return (
    <div className="bg-black h-[38px] py-0.5 border-b border-gray-900 ">
      <div className="lg:w-10/12 w-full mx-auto">
        <div className="flex items-center justify-between py-1.5 ">

          {supportText ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-700">|</span>
              <RiPhoneFill className="text-[#1e90ff] text-[24px] flex-shrink-0" />
              <span className="text-white tracking-wide">{supportText}</span>
            </div>
          ) : <div />}

          {/* {promoText || promoButtonLabel || promoButtonLink ? (
            <div className="flex items-center gap-3">
              {promoText ? (
                <div className="h-6 overflow-hidden">
                  <div className="flex items-center gap-1.5 text-[#ffffff] animate-roll-text">
                    <HiOutlineBell className="text-[16px] flex-shrink-0" />
                    <span className="whitespace-nowrap font-normal">{promoText}</span>
                  </div>
                </div>
              ) : null}

              {promoButtonLabel && promoButtonLink
                ? renderLink(
                  promoButtonLabel,
                  promoButtonLink,
                  <>
                    <span>{promoButtonLabel}</span>
                    <div className="bg-[#1e90ff] rounded-full px-1 flex items-center justify-center">
                      <HiOutlineArrowLongRight className="text-white text-[10px]" />
                    </div>
                  </>,
                  "flex items-center gap-2 bg-black text-white px-3 py-0.5 rounded-full hover:bg-slate-800 transition-all text-[11px]"
                )
                : null}
            </div>
          ) : null} */}

          {/* Third Part: Navigation Links */}
          <div className="flex items-center gap-6">
            {utilityLinks.map((item) => {
              const iconElement = getUtilityIcon(item.title) || (item.icon?.trim() ? (
                <div className="relative w-[32px] h-[32px] flex items-center justify-center">
                  <Image src={item.icon} alt={item.title || "Header link"} width={16} height={16} className="object-contain" />
                </div>
              ) : null);

              const content = (
                <>
                  {iconElement}
                  {item.title.trim() ? <span>{item.title}</span> : null}
                </>
              );
              const linkHref = item.link.trim();
              if (!linkHref) {
                return (
                  <div key={item.id} className="flex items-center gap-2 text-white">
                    {content}
                  </div>
                );
              }

              return renderLink(item.id, linkHref, content, "flex items-center gap-2 text-white hover:text-blue-400 transition font-semibold");
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
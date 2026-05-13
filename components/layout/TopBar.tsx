"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { HiOutlineBell, HiOutlineArrowLongRight } from "react-icons/hi2";

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
  const [promoText, setPromoText] = useState<string | null>(null);
  const [promoButtonLabel, setPromoButtonLabel] = useState<string | null>(null);
  const [promoButtonLink, setPromoButtonLink] = useState<string | null>(null);
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
          setPromoText(topbar.promo_text?.trim() || null);
          setPromoButtonLabel(topbar.promo_button_label?.trim() || null);
          setPromoButtonLink(topbar.promo_button_link?.trim() || null);
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

  return (
    <div className="bg-white h-[38px] py-0.5 border-b border-slate-200">
      <div className="mainwidth mx-auto">
        <div className="flex items-center justify-between py-1.5 text-[12px]">

          {supportText ? (
            <div className="flex items-center">
              <span className="text-slate-600 font-normal tracking-wide">{supportText}</span>
            </div>
          ) : <div />}

          {promoText || promoButtonLabel || promoButtonLink ? (
            <div className="flex items-center gap-3">
              {promoText ? (
                <div className="h-6 overflow-hidden">
                  <div className="flex items-center gap-1.5 text-[#001f3f] animate-roll-text">
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
          ) : null}

          {/* Third Part: Navigation Links */}
          <div className="flex items-center gap-6">
            {utilityLinks.map((item) => {
              const content = (
                <>
                  {item.icon?.trim() ? (
                    <div className="relative w-[16px] h-[16px] flex items-center justify-center">
                      <Image src={item.icon} alt={item.title || "Header link"} width={16} height={16} className="object-contain" />
                    </div>
                  ) : null}
                  {item.title.trim() ? <span>{item.title}</span> : null}
                </>
              );
              const linkHref = item.link.trim();
              if (!linkHref) {
                return (
                  <div key={item.id} className="flex items-center gap-2 text-slate-600">
                    {content}
                  </div>
                );
              }

              return renderLink(item.id, linkHref, content, "flex items-center gap-2 text-slate-600 hover:text-slate-900 transition");
            })}
            {/* <Link href="/higher-sale-products" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition font-medium">
              Higher Sale
            </Link>
            <Link href="/track-order" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition font-medium">
              Track Order
            </Link> */}
          </div>

        </div>
      </div>
    </div>
  );
}
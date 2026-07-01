"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CampaignItem = {
  id: string;
  title: string;
  image: string;
  alt: string;
  endAt: string;
  ctaText?: string;
  ctaHref?: string;
};

type CampaignOffersProps = {
  pageTitle: string;
  campaigns: CampaignItem[];
  breadcrumb?: string;
};

type CountdownParts = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const toCountdownParts = (targetDate: string): CountdownParts => {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const total = Math.max(0, target - now);

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return { total, days, hours, minutes, seconds };
};

const pad2 = (num: number): string => num.toString().padStart(2, "0");

function CountdownBadge({ targetDate }: { targetDate: string }) {
  const [countdown, setCountdown] = useState<CountdownParts>(() => toCountdownParts(targetDate));

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCountdown(toCountdownParts(targetDate));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [targetDate]);

  const units = useMemo(
    () => [
      { label: "Days", value: pad2(countdown.days) },
      { label: "Hour", value: pad2(countdown.hours) },
      { label: "Minute", value: pad2(countdown.minutes) },
      { label: "Second", value: pad2(countdown.seconds) },
    ],
    [countdown.days, countdown.hours, countdown.minutes, countdown.seconds]
  );

  return (
    <div className="rounded-lg bg-white/95 p-1.5 shadow-lg backdrop-blur-sm sm:rounded-xl sm:p-2 md:p-3">
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
        {units.map((unit, index) => (
          <div key={unit.label} className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <div className="flex min-w-[30px] flex-col items-center rounded-md border border-slate-300 bg-white px-1 py-1 shadow-sm sm:min-w-[38px] sm:px-1.5 md:min-w-[50px]">
              <span className="text-sm font-semibold leading-none text-slate-900 sm:text-base md:text-2xl">{unit.value}</span>
            </div>

            {index < units.length - 1 && <span className="text-base font-bold leading-none text-slate-700 sm:text-lg md:text-2xl">:</span>}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-4 text-center text-[8px] text-slate-600 sm:text-[9px] md:text-[11px]">
        {units.map((unit) => (
          <span key={unit.label}>{unit.label}</span>
        ))}
      </div>

      {countdown.total === 0 && <p className="mt-2 text-center text-xs font-semibold text-red-600">Offer ended</p>}
    </div>
  );
}

export default function CampaignOffers({ pageTitle, campaigns, breadcrumb = "Campaign" }: CampaignOffersProps) {
  return (
    <main className=" mt-14  sm:mt-24  lg:mt-16">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[12px] text-slate-500 sm:text-sm">
        <Link href="/" className="transition hover:text-slate-700">
          Home
        </Link>
        <span className="text-slate-400">›</span>
        <span className="font-medium text-slate-700">{breadcrumb}</span>
      </nav>

      <h1 className="mb-4 text-xl font-semibold text-slate-900 sm:mb-5 sm:text-2xl">{pageTitle}</h1>

      <div className="space-y-4 sm:space-y-5">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="mx-auto w-full max-w-[1840px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            {campaign.ctaHref ? (
              <Link href={campaign.ctaHref} className="relative block aspect-[1840/536] w-full bg-slate-100 group">
                <Image
                  src={campaign.image}
                  alt={campaign.alt}
                  fill
                  priority={campaign.id === campaigns[0]?.id}
                  sizes="(max-width: 640px) 100vw, (max-width: 1920px) 95vw, 1840px"
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-black/5 to-transparent" />

                <div className="absolute left-1 bottom-1 origin-bottom-left scale-[0.72] sm:left-3 sm:bottom-3 sm:scale-100 md:left-5 md:bottom-5">
                  <CountdownBadge targetDate={campaign.endAt} />
                </div>

                {campaign.ctaText && (
                  <span
                    className="absolute right-3 top-3 rounded-md  px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition bg-[#0054A6] group-hover:bg-[#0A66C2] sm:right-5 sm:top-5 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    {campaign.ctaText}
                  </span>
                )}
              </Link>
            ) : (
              <div className="relative aspect-[1840/536] w-full bg-slate-100">
                <Image
                  src={campaign.image}
                  alt={campaign.alt}
                  fill
                  priority={campaign.id === campaigns[0]?.id}
                  sizes="(max-width: 640px) 100vw, (max-width: 1920px) 95vw, 1840px"
                  className="object-contain"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-black/5 to-transparent" />

                <div className="absolute left-1 bottom-1 origin-bottom-left scale-[0.72] sm:left-3 sm:bottom-3 sm:scale-100 md:left-5 md:bottom-5">
                  <CountdownBadge targetDate={campaign.endAt} />
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}

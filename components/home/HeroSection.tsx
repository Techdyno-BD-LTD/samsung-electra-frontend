"use client";

import Image from "next/image";
// import Link from "next/link";
import { type ComponentType, useEffect, useMemo, useState } from "react";
import {
  HiOutlineArchiveBox,

  // HiOutlineChevronLeft,
  // HiOutlineChevronRight,
  HiOutlineCog6Tooth,
  HiOutlineCpuChip,
  HiOutlineHome,
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineTv,
} from "react-icons/hi2";

type HeroCategory = {
  id: number;
  name: string;
  count: number;
  icon: string;
};

type HeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
  countdownTarget: string;
  showTimer?: boolean;
};

type HeroPayload = {
  promoBarText: string;
  autoplayMs: number;
  categories: HeroCategory[];
  slides: HeroSlide[];
};

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  tv: HiOutlineTv,
  refrigerator: HiOutlineArchiveBox,
  freezer: HiOutlineSparkles,
  ac: HiOutlineSun,
  microwave: HiOutlineCpuChip,
  washing: HiOutlineCog6Tooth,
  home: HiOutlineHome,
};

const HERO_SLIDE_ASPECT_RATIO = "1530 / 528";

const twoDigit = (value: number) => String(value).padStart(2, "0");

function getCountdown(targetDate: string, now: number) {
  const distance = new Date(targetDate).getTime() - now;
  if (distance <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return {
    days: twoDigit(days),
    hours: twoDigit(hours),
    minutes: twoDigit(minutes),
    seconds: twoDigit(seconds),
  };
}

export default function HeroSection() {
  const [heroData, setHeroData] = useState<HeroPayload | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(true);
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    let isMounted = true;

    async function loadHeroData() {
      try {
        const response = await fetch("/api/hero", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch hero section data");
        }

        const payload: HeroPayload = await response.json();
        if (isMounted) {
          setHeroData(payload);
        }
      } catch {
        if (isMounted) {
          setHeroData({
            promoBarText: "Seasonal campaign is loading...",
            autoplayMs: 5000,
            categories: [],
            slides: [],
          });
        }
      }
    }

    loadHeroData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!heroData?.slides?.length || heroData.slides.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      setSlideIndex((previous) => previous + 1);
    }, heroData.autoplayMs || 5000);

    return () => clearInterval(interval);
  }, [heroData]);

  useEffect(() => {
    if (!heroData?.slides?.length) {
      return;
    }

    if (slideIndex > heroData.slides.length) {
      setSlideIndex(0);
    }
  }, [slideIndex, heroData]);

  const activeCountdown = useMemo(() => {
    const slides = heroData?.slides ?? [];
    if (!slides.length) {
      return getCountdown(new Date().toISOString(), tick);
    }

    const activeSlide = slideIndex % slides.length;
    const target = slides[activeSlide]?.countdownTarget;
    return target ? getCountdown(target, tick) : getCountdown(new Date().toISOString(), tick);
  }, [heroData, slideIndex, tick]);

  if (!heroData) {
    return (
      <section className="grid items-stretch gap-4 animate-pulse lg:grid-cols-[minmax(220px,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(220px,240px)_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="h-full min-h-[320px] rounded-2xl border border-slate-200 bg-white lg:min-h-0" />
        <div className="flex h-full min-h-[320px] flex-col gap-3 lg:min-h-0">
          <div className="h-10 rounded-md border border-slate-200 bg-slate-200" />
          <div className="rounded-2xl border border-slate-200 bg-slate-200" style={{ aspectRatio: HERO_SLIDE_ASPECT_RATIO }} />
        </div>
      </section>
    );
  }

  const slides = heroData.slides;
  const loopedSlides = slides.length > 1 ? [...slides, slides[0]] : slides;
  const activeSlide = slides.length ? slideIndex % slides.length : 0;
  const activeSlideData = slides[activeSlide];
  const shouldShowTimer = Boolean(activeSlideData?.showTimer);

  return (
    <section className="grid items-stretch gap-4 lg:grid-cols-[minmax(220px,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(220px,240px)_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">

      {/* Categories Sidebar — hidden on mobile, visible from lg up */}
      <aside className="hidden lg:block rounded-md border border-slate-200 bg-white p-2 shadow-sm lg:p-2 xl:p-2 2xl:p-3">
        <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3 lg:mb-1.5 lg:pb-1.5 xl:mb-1.5 xl:pb-1.5 2xl:mb-3 2xl:pb-3">
          <h3 className="text-[15px] font-semibold leading-none text-slate-900 2xl:text-[16px]">Categories</h3>
         
        </div>

        <div className="space-y-2.5 lg:space-y-1.5 xl:space-y-1.5 2xl:space-y-3">
          {heroData.categories.map((category) => {
            const CategoryIcon = iconMap[category.icon] || HiOutlineArchiveBox;

            return (
              <button
                key={category.id}
                type="button"
                className="flex w-full items-center justify-between rounded-md border border-slate-100 px-2 py-3 text-left shadow-md transition hover:border-blue-300 hover:bg-white lg:px-2 lg:py-2 xl:px-2 xl:py-2 2xl:px-3 2xl:py-4"
              >
                <div className="flex items-center gap-2 lg:gap-1.5 xl:gap-1.5 2xl:gap-2">
                  <CategoryIcon className="text-xl text-slate-600 2xl:text-2xl" />
                  <span className="text-[13px] text-slate-700 lg:text-[12px] xl:text-[12px] 2xl:text-[13px]">{category.name}</span>
                </div>
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-blue-500 px-2 text-xs font-semibold text-white">
                  {twoDigit(category.count)}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex flex-col gap-2">
        <div className="rounded-md hidden lg:block bg-[#0e56af] px-2 py-2 text-white sm:px-3 lg:px-3 lg:py-2 xl:px-3 2xl:px-4">
          <div className="hero-marquee-window mx-auto max-w-[74%] sm:max-w-[78%] lg:max-w-[62%] xl:max-w-[58%]">
            <div className="hero-marquee-track" aria-label={heroData.promoBarText}>
              <span className="hero-marquee-item text-[11px] font-semibold tracking-wide sm:text-xs">{heroData.promoBarText}</span>
              <span className="hero-marquee-item text-[11px] font-semibold tracking-wide sm:text-xs" aria-hidden="true">
                {heroData.promoBarText}
              </span>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full" style={{ aspectRatio: HERO_SLIDE_ASPECT_RATIO }}>
          <div
            className={`flex h-full w-full ${isSliding ? "transition-transform duration-700 ease-in-out" : ""}`}
            style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            onTransitionEnd={() => {
              if (slides.length > 1 && slideIndex === slides.length) {
                setIsSliding(false);
                setSlideIndex(0);

                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    setIsSliding(true);
                  });
                });
              }
            }}
          >
            {loopedSlides.map((slide, index) => (
              <div key={`${slide.id}-${index}`} className="relative h-full min-w-full">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 72vw, 74vw"
                    className="object-contain object-center"
                    priority={index === 0}
                  />
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/15" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15" /> */}

                  {/* <div className="relative z-20 flex h-full items-end p-6 sm:p-8">
                    <div className="max-w-[520px] text-white">
                      <h2 className="text-3xl font-bold leading-tight drop-shadow-md sm:text-5xl">{slide.title}</h2>
                      <p className="mt-3 text-lg text-white/90 sm:text-3xl">{slide.subtitle}</p>
                      <Link
                        href={slide.ctaHref}
                        className="mt-5 inline-flex items-center rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
                      >
                        {slide.ctaLabel}
                      </Link>
                    </div>
                  </div> */}
              </div>
            ))}
          </div>

          {slides.length > 1 && (
            <>
              {/* <button
                type="button"
                onClick={() => setActiveSlide((previous) => (previous - 1 + slides.length) % slides.length)}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/85 p-2 text-slate-900 shadow transition hover:bg-white"
              >
                <HiOutlineChevronLeft className="text-xl" />
              </button> */}

              {/* <button
                type="button"
                onClick={() => setActiveSlide((previous) => (previous + 1) % slides.length)}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/85 p-2 text-slate-900 shadow transition hover:bg-white"
              >
                <HiOutlineChevronRight className="text-xl" />
              </button> */}
            </>
          )}

          <div className="absolute bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 backdrop-blur-sm lg:bottom-4">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => {
                  setIsSliding(true);
                  setSlideIndex(index);
                }}
                className={`h-2.5 rounded-full transition-all ${index === activeSlide ? "w-7 bg-[#0e56af]" : "w-2.5 bg-slate-300"}`}
              />
            ))}
          </div>

          {shouldShowTimer && (
            <div className="absolute bottom-2 right-2 z-40 rounded-xl border border-white/20 bg-black/40 p-1.5 text-white backdrop-blur-md sm:bottom-5 sm:right-5 sm:rounded-2xl sm:p-4 lg:bottom-6 lg:right-6">
              <div className="grid grid-cols-4 gap-1 text-center text-[8px] sm:gap-3 sm:text-sm">
                <div>
                  <div className="rounded bg-[#1976d2] px-1.5 py-1 text-[11px] font-semibold sm:rounded-lg sm:px-3 sm:text-lg">{activeCountdown.days}</div>
                  <p className="mt-0.5 font-medium text-white/90 sm:mt-2">Days</p>
                </div>
                <div>
                  <div className="rounded bg-[#1976d2] px-1.5 py-1 text-[11px] font-semibold sm:rounded-lg sm:px-3 sm:text-lg">{activeCountdown.hours}</div>
                  <p className="mt-0.5 font-medium text-white/90 sm:mt-2">Hour</p>
                </div>
                <div>
                  <div className="rounded bg-[#1976d2] px-1.5 py-1 text-[11px] font-semibold sm:rounded-lg sm:px-3 sm:text-lg">{activeCountdown.minutes}</div>
                  <p className="mt-0.5 font-medium text-white/90 sm:mt-2">Minute</p>
                </div>
                <div>
                  <div className="rounded bg-[#1976d2] px-1.5 py-1 text-[11px] font-semibold sm:rounded-lg sm:px-3 sm:text-lg">{activeCountdown.seconds}</div>
                  <p className="mt-0.5 font-medium text-white/90 sm:mt-2">Second</p>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}

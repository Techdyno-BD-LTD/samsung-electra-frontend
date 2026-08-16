"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  slides: HeroSlide[];
};

type SliderItem = {
  id: number;
  image: string;
  file_name: string;
  external_link: string | null;
};

type SliderApiResponse = {
  data: {
    text: string;
    sliders: SliderItem[];
  };
  success: boolean;
  status: number;
};

const HERO_SLIDE_ASPECT_RATIO = "1530 / 588";  

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
        const response = await fetch("/api/homepage/sliders", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch hero section data");
        }

        const sliderPayload: SliderApiResponse = await response.json();

        const slides: HeroSlide[] = (sliderPayload.data?.sliders || []).map((item, index) => ({
          id: item.id,
          title: `Slide ${index + 1}`,
          subtitle: "",
          imageUrl: item.image,
          ctaLabel: "",
          ctaHref: item.external_link || "#",
          countdownTarget: new Date().toISOString(),
          showTimer: false,
        }));

        if (isMounted) {
          setHeroData({
            promoBarText: sliderPayload.data?.text || "Discover Samsung Electra seasonal offers.",
            autoplayMs: 5000,
            slides,
          });
        }
      } catch {
        if (isMounted) {
          setHeroData({
            promoBarText: "Seasonal campaign is loading...",
            autoplayMs: 5000,
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
    if (!heroData || heroData.slides.length <= 1) return;

    const interval = setInterval(() => {
      setIsSliding(true);
      setSlideIndex((prev) => prev + 1);
    }, heroData.autoplayMs);

    return () => clearInterval(interval);
  }, [heroData]);

  useEffect(() => {
    if (!heroData) return;
    const slides = heroData.slides;
    if (slides.length > 1 && slideIndex === slides.length + 1) {
      setIsSliding(false);
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
      <section className="w-full animate-pulse flex flex-col gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-200" style={{ aspectRatio: HERO_SLIDE_ASPECT_RATIO }} />
      </section>
    );
  }

  const slides = heroData.slides;
  const loopedSlides = slides.length > 1 ? [...slides, slides[0]] : slides;
  const activeSlide = slides.length ? slideIndex % slides.length : 0;
  const activeSlideData = slides[activeSlide];
  const shouldShowTimer = Boolean(activeSlideData?.showTimer);

  return (
    <section className="w-screen  relative left-1/2 right-1/2 -translate-x-1/2 lg:mt-[80px] mt-12">
      <div className="flex flex-col gap-2">
        <div className="relative w-full overflow-hidden">
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
                  {slide.ctaHref && slide.ctaHref !== "#" ? (
                    <Link href={slide.ctaHref} className="block relative w-full h-full">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        sizes="100vw"
                        className="object-contain object-center cursor-pointer"
                        priority={index === 0}
                      />
                    </Link>
                  ) : (
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      sizes="100vw"
                      className="object-contain object-center"
                      priority={index === 0}
                    />
                  )}
                </div>
              ))}
            </div>

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

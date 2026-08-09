"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";

type HeroCategory = {
  id: number;
  name: string;
  count: number;
  icon: string | null;
  coverImage: string | null;
  slug?: string;
  parent_id?: number;
  subcategories: Array<{
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    coverImage: string | null;
  }>;
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

type CategoryApiItem = {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  cover_image: string | null;
  parent_id?: number;
  number_of_products: number;
};

type CategoriesApiResponse = {
  data: CategoryApiItem[];
  success: boolean;
  status: number;
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
  const [hoveredCategory, setHoveredCategory] = useState<HeroCategory | null>(null);
  const [activeMenuCategory, setActiveMenuCategory] = useState<HeroCategory | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoryHover = (category: HeroCategory | null) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    if (category) {
      if (!isMenuOpen) {
        setActiveMenuCategory(category);
        // Small delay to allow the component to mount before triggering animation
        hoverTimeoutRef.current = setTimeout(() => {
          setIsMenuOpen(true);
        }, 10);
      } else if (activeMenuCategory?.id !== category.id) {
        // Transition between categories
        setIsMenuOpen(false);
        hoverTimeoutRef.current = setTimeout(() => {
          setActiveMenuCategory(category);
          setIsMenuOpen(true);
        }, 150);
      }
      setHoveredCategory(category);
    } else {
      setHoveredCategory(null);
      hoverTimeoutRef.current = setTimeout(() => {
        setIsMenuOpen(false);
        hoverTimeoutRef.current = setTimeout(() => {
          setActiveMenuCategory(null);
        }, 200);
      }, 100);
    }
  };
  useEffect(() => {
    let isMounted = true;

    async function loadHeroData() {
      try {
        const [sliderResponse, categoriesResponse] = await Promise.all([
          fetch("/api/homepage/sliders", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        if (!sliderResponse.ok) {
          throw new Error("Failed to fetch hero section data");
        }

        const sliderPayload: SliderApiResponse = await sliderResponse.json();
        const categoryPayload = categoriesResponse.ok ? (await categoriesResponse.json()) as CategoriesApiResponse : { data: [] as CategoryApiItem[] };

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

        const allApiCategories = categoryPayload.data || [];
        const topLevelCategories = allApiCategories.filter((item) => item.parent_id === 0 && (item.number_of_products || 0) > 0);

        const categories: HeroCategory[] = topLevelCategories
          .map((item) => ({
            id: item.id,
            name: item.name,
            count: item.number_of_products || 0,
            icon: item.icon,
            coverImage: item.cover_image,
            slug: item.slug,
            parent_id: item.parent_id,
            subcategories: allApiCategories
              .filter((sub) => sub.parent_id === item.id && (sub.number_of_products || 0) > 0)
              .map((sub) => ({
                id: sub.id,
                name: sub.name,
                slug: sub.slug,
                icon: sub.icon,
                coverImage: sub.cover_image,
              })),
          }));

        if (isMounted) {
          setHeroData({
            promoBarText: sliderPayload.data?.text || "Discover Samsung Electra seasonal offers.",
            autoplayMs: 5000,
            categories,
            slides,
          });
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

        <div
          className="space-y-2.5 lg:space-y-1.5 xl:space-y-1.5 2xl:space-y-3"
          onMouseLeave={() => handleCategoryHover(null)}
        >
          <div className={`w-full custom-scrollbar space-y-2.5 lg:space-y-1.5 xl:space-y-1.5 2xl:space-y-3 h-[392px] lg:h-[322px] xl:h-[322px] 2xl:h-[448px] ${showAllCategories ? "overflow-y-auto pr-1.5" : "overflow-hidden"}`}>
            {(showAllCategories ? heroData.categories : heroData.categories.slice(0, 6)).map((category) => {
              const categoryUrl = `/category/${category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
              return (
                <Link
                  key={category.id}
                  href={categoryUrl}
                  onMouseEnter={() => handleCategoryHover(category)}
                  className={`flex w-full items-center justify-between rounded-md border px-2 py-3 text-left shadow-md transition lg:px-2 lg:py-2 xl:px-2 xl:py-2 2xl:px-3 2xl:py-4 ${hoveredCategory?.id === category.id
                    ? "border-blue-400 bg-blue-50/50"
                    : "border-slate-100 bg-white hover:border-blue-300 hover:bg-white"
                    }`}
                >
                  <div className="flex items-center gap-2 lg:gap-1.5 xl:gap-1.5 2xl:gap-2">
                    {category.icon ? (
                      <Image
                        src={category.icon}
                        alt={category.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                    ) : null}
                    <span className="text-[13px] text-slate-700 lg:text-[12px] xl:text-[12px] 2xl:text-[13px]">{category.name}</span>
                  </div>
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-blue-500 px-2 text-xs font-semibold text-white">
                    {twoDigit(category.count)}
                  </span>
                </Link>
              );
            })}
          </div>

          {heroData.categories.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAllCategories(!showAllCategories)}
              onMouseEnter={() => handleCategoryHover(null)}
              className="flex w-full items-center justify-between rounded-md border border-slate-100 bg-white px-2 py-3 text-left shadow-md transition hover:border-blue-300 hover:bg-blue-50/20 lg:px-2 lg:py-2 xl:px-2 xl:py-2 2xl:px-3 2xl:py-4"
            >
              <div className="flex items-center gap-2 lg:gap-1.5 xl:gap-1.5 2xl:gap-2">
                <span className="flex h-6 w-6 items-center justify-center text-slate-400">
                  {showAllCategories ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
                <span className="text-[13px] font-semibold text-blue-600 lg:text-[12px] xl:text-[12px] 2xl:text-[13px]">
                  {showAllCategories ? "See Less" : "See More"}
                </span>
              </div>
              {!showAllCategories && (
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-500">
                  +{heroData.categories.length - 6}
                </span>
              )}
            </button>
          )}
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
        {/* 
        <div className="lg:hidden block bg-[#0e56af] rounded-xl px-2 py-1  mx-1">
          <div className="mx-auto w-6/12 overflow-hidden">

            <div className="marquee-track text-white text-[8px] font-semibold py-0.5">
              {heroData.promoBarText}
            </div>

          </div>


        </div> */}


        <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm" onMouseLeave={() => handleCategoryHover(null)}>
          {/* Mega Menu Overlay */}
          {activeMenuCategory && (
            <div
              className={`absolute inset-0 z-[100] flex bg-white p-6 shadow-2xl transition-all duration-500 ease-out ${isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
                }`}
              onMouseEnter={() => handleCategoryHover(activeMenuCategory)}
            >
              <div className="flex-1">
                <h2 className="mb-8 border-b border-slate-100 pb-4 text-2xl font-medium text-slate-800">
                  {activeMenuCategory.name}
                </h2>

                <div className="flex flex-wrap gap-x-12 gap-y-10">
                  {activeMenuCategory.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/category/${sub.slug}`}
                      className="group flex flex-col items-start gap-3 text-left transition-transform hover:-translate-y-1"
                    >
                      <span className="text-[14px] font-semibold text-slate-600 transition-colors group-hover:text-blue-600">
                        {sub.name}
                      </span>
                      <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-3 transition-shadow group-hover:shadow-md">
                        {sub.coverImage ? (
                          <Image src={sub.coverImage} alt={sub.name} fill className="object-contain p-2" />
                        ) : sub.icon ? (
                          <Image src={sub.icon} alt={sub.name} fill className="object-contain p-2" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-300">No Image</div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Cover Image on Right */}
              <div className="relative ml-8 hidden w-1/3 overflow-hidden rounded-2xl shadow-inner md:block">
                {activeMenuCategory.coverImage ? (
                  <Image
                    src={activeMenuCategory.coverImage}
                    alt={activeMenuCategory.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                    Category Banner
                  </div>
                )}
              </div>
            </div>
          )}

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
                        sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 72vw, 74vw"
                        className="object-contain object-center cursor-pointer"
                        priority={index === 0}
                      />
                    </Link>
                  ) : (
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 72vw, 74vw"
                      className="object-contain object-center"
                      priority={index === 0}
                    />
                  )}
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

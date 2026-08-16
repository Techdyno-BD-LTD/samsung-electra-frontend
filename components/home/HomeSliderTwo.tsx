"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type SliderItem = {
  id: number;
  image: string;
  file_name: string;
  external_link: string | null;
};

type ApiResponse = {
  data: {
    title: string;
    text: string;
    sliders: SliderItem[];
  };
  success: boolean;
  status: number;
};

export default function HomeSliderTwo() {
  const [slides, setSlides] = useState<SliderItem[]>([]);
  const [title, setTitle] = useState("The Art of Modern Living");
  const [text, setText] = useState("Upgrade your home with seasonal essentials designed to bring comfort");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/homepage/sliders2", { cache: "no-store" });
        if (res.ok) {
          const json = (await res.json()) as ApiResponse;
          if (json.success && json.data) {
            const slidersData = json.data.sliders || [];
            setSlides(slidersData);
            if (json.data.title) setTitle(json.data.title);
            if (json.data.text) setText(json.data.text);
            
            // Set initial index to the middle copy
            if (slidersData.length > 0) {
              setCurrentIndex(slidersData.length * 2);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load Homepage Slider 2 data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // Responsive width listeners
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Re-enable transition on next frame
  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  if (loading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-50/50 rounded-2xl animate-pulse">
        <span className="text-gray-400 font-medium">Loading slider...</span>
      </div>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const handlePrev = () => {
    if (!transitionEnabled) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!transitionEnabled) return;
    setCurrentIndex((prev) => prev + 1);
  };

  // Jump index instantly if we transition into the boundary copies
  const handleTransitionEnd = () => {
    const n = slides.length;
    if (currentIndex < n || currentIndex >= n * 4) {
      setTransitionEnabled(false);
      const originalIndex = ((currentIndex % n) + n) % n;
      setCurrentIndex(originalIndex + n * 2);
    }
  };

  const isMobile = windowWidth < 768;
  const slideWidth = isMobile ? Math.min(windowWidth - 48, 500) : 520;
  const gap = isMobile ? 12 : 5;

  // Repeat the slides list 5 times for seamless looping
  const repeatedSlides = [...slides, ...slides, ...slides, ...slides, ...slides];

  // Calculate translation offset based on currentIndex
  const translationX = `calc(50% - ${currentIndex * (slideWidth + gap)}px - ${slideWidth / 2}px)`;

  return (
    <section className="w-full  mx-auto px-4 pt-2 select-none overflow-hidden">
      {/* Title & Navigation Header */}
      <div className="relative w-full max-w-[1650px] mx-auto mb-8 mt-16 flex flex-col items-center justify-center text-center">
        <div className="px-4">
          <h2 className="text-2xl lg:text-[32px] 2xl:text-[48px] font-medium text-gray-900 tracking-tight mb-2">
            {title}
          </h2>
          <p className="text-sm lg:text-[16px]  2xl:text-[20px] mt-7  text-gray-500 max-w-[650px] mx-auto">
            {text}
          </p>
        </div>

        {/* Custom Navigation Arrows */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Arrows */}
      <div className="flex md:hidden justify-center gap-2 mb-6">
        <button
          onClick={handlePrev}
          className="w-10 h-10 flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          aria-label="Previous slide"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          aria-label="Next slide"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Sliding Track Viewport */}
      <div className="relative w-full max-w-[1500px] mx-auto overflow-hidden min-h-[300px] md:min-h-[580px] py-4">
        <div
          className={`flex ${transitionEnabled ? "transition-transform duration-500 ease-out" : ""}`}
          style={{ transform: `translateX(${translationX})` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {repeatedSlides.map((slide, index) => {
            const isActive = index === currentIndex;

            const cardClasses = `relative flex-shrink-0 transition-all duration-500 ease-out rounded-2xl overflow-hidden shadow-lg border border-gray-100 ${
              isActive
                ? "scale-100 opacity-100 z-10 border-blue-200 ring-4 ring-blue-500/10"
                : "scale-[0.85] opacity-100 z-0"
            }`;

            const slideContent = (
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.file_name || `Slide ${slide.id}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 620px"
                  className="object-contain"
                  priority={isActive}
                />
              </div>
            );

            const cardStyle = {
              width: `${slideWidth}px`,
              aspectRatio: "620 / 570",
              marginRight: `${gap}px`,
            };

            if (slide.external_link) {
              return (
                <Link
                  key={`${slide.id}-${index}`}
                  href={slide.external_link}
                  className={cardClasses}
                  style={cardStyle}
                >
                  {slideContent}
                </Link>
              );
            }

            return (
              <div key={`${slide.id}-${index}`} className={cardClasses} style={cardStyle}>
                {slideContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

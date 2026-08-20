"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

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

  // Drag and Swipe Gesture states
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const wasDragging = useRef(false);

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
    if (!transitionEnabled && !isDragging) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled, isDragging]);

  const isMobile = windowWidth < 768;
  const slideWidth = isMobile ? Math.min(windowWidth * 0.72, 340) : 440;
  const gap = isMobile ? -10 : 5;

  if (loading) {
    return (
      <section className="w-full mx-auto px-4 pt-2 select-none overflow-hidden animate-pulse">
        {/* Shimmer Header */}
        <div className="relative w-full max-w-[1650px] mx-auto lg:mb-8 mt-4 lg:mt-16 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center w-full px-4">
            {/* Title Skeleton */}
            <div className="h-7 lg:h-9 bg-gray-200 rounded-md w-3/4 max-w-[380px] mb-3" />
            {/* Subtitle Skeleton */}
            <div className="h-4 lg:h-5 bg-gray-200 rounded-md w-full max-w-[550px] lg:mt-6 mb-6 lg:mb-0" />
          </div>

          {/* Desktop Arrow Placeholders */}
          <div className="absolute right-32 top-1/2 -translate-y-1/2 hidden md:flex gap-2">
            <div className="w-10 h-10 rounded bg-gray-200" />
            <div className="w-10 h-10 rounded bg-gray-200" />
          </div>
        </div>

        {/* Shimmer Slider Viewport */}
        <div className="relative w-full max-w-[1400px] mx-auto overflow-hidden min-h-[300px] md:min-h-[480px] flex items-center justify-center">
          <div className="flex items-center justify-center">
            {/* Left Card Skeleton */}
            <div
              className="flex-shrink-0 rounded-2xl bg-gray-200/70 border border-gray-100 scale-[0.85] shadow-sm"
              style={{
                width: `${slideWidth}px`,
                aspectRatio: "620 / 570",
                marginRight: `${gap}px`,
              }}
            />
            {/* Center Active Card Skeleton */}
            <div
              className="flex-shrink-0 rounded-2xl bg-gray-200 border border-gray-100 scale-100 shadow-md"
              style={{
                width: `${slideWidth}px`,
                aspectRatio: "620 / 570",
                marginRight: `${gap}px`,
              }}
            />
            {/* Right Card Skeleton */}
            <div
              className="flex-shrink-0 rounded-2xl bg-gray-200/70 border border-gray-100 scale-[0.85] shadow-sm"
              style={{
                width: `${slideWidth}px`,
                aspectRatio: "620 / 570",
                marginRight: `${gap}px`,
              }}
            />
          </div>
        </div>
      </section>
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

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    setTransitionEnabled(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setDragOffset(diff);
    if (Math.abs(diff) > 10) {
      wasDragging.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50;
    setTransitionEnabled(true);
    setDragOffset(0);

    if (dragOffset < -threshold) {
      setCurrentIndex((prev) => prev + 1);
    } else if (dragOffset > threshold) {
      setCurrentIndex((prev) => prev - 1);
    }

    setTimeout(() => {
      wasDragging.current = false;
    }, 100);
  };

  // Mouse handlers for PC drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
    setTransitionEnabled(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setDragOffset(diff);
    if (Math.abs(diff) > 10) {
      wasDragging.current = true;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50;
    setTransitionEnabled(true);
    setDragOffset(0);

    if (dragOffset < -threshold) {
      setCurrentIndex((prev) => prev + 1);
    } else if (dragOffset > threshold) {
      setCurrentIndex((prev) => prev - 1);
    }

    setTimeout(() => {
      wasDragging.current = false;
    }, 100);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (wasDragging.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Repeat the slides list 5 times for seamless looping
  const repeatedSlides = [...slides, ...slides, ...slides, ...slides, ...slides];

  // Calculate translation offset based on currentIndex and dragOffset
  const translationX = `calc(50% - ${currentIndex * (slideWidth + gap)}px - ${slideWidth / 2}px + ${dragOffset}px)`;

  return (
    <section className="w-full mx-auto px-4 pt-2 select-none overflow-hidden">
      {/* Title & Navigation Header */}
      <div className="relative w-full max-w-[1650px] mx-auto lg:mb-8 mt-4 lg:mt-16 flex flex-col items-center justify-center text-center">
        <div className="px-4">
          <h2 className="text-xl lg:text-[32px] 2xl:text-[38px] font-semibold text-gray-900 tracking-tight mb-2">
            {title}
          </h2>
          <p className="text-sm lg:text-[16px] 2xl:text-[18px] lg:mt-7 mb-6 lg:mb-0 text-gray-500 max-w-[400px] lg:max-w-[750px] mx-auto">
            {text}
          </p>
        </div>

        {/* Custom Navigation Arrows */}
        <div className="absolute right-32 top-1/2 -translate-y-1/2 hidden md:flex gap-2">
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

      {/* Sliding Track Viewport */}
      <div 
        className="relative w-full max-w-[1390px] mx-auto overflow-hidden min-h-[300px] md:min-h-[480px] cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left Arrow for Mobile (Overlaid on left card) */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex md:hidden w-8 h-12 items-center justify-center rounded bg-blue-600/60 text-white hover:bg-blue-700 transition-colors shadow-md"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow for Mobile (Overlaid on right card) */}
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex md:hidden w-8 h-12 items-center justify-center rounded bg-blue-600/60 text-white hover:bg-blue-700 transition-colors shadow-md"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          className={`flex ${transitionEnabled ? "transition-transform duration-500 ease-out" : ""}`}
          style={{ transform: `translateX(${translationX})` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {repeatedSlides.map((slide, index) => {
            const isActive = index === currentIndex;

            const cardClasses = `relative flex-shrink-0 transition-all duration-500 ease-out rounded-2xl overflow-hidden shadow-lg border border-gray-100 ${
              isActive
                ? "scale-100 opacity-100 z-10 md:border-blue-200 md:ring-4 md:ring-blue-500/10 border-transparent"
                : "scale-[0.85] opacity-100 z-0"
            }`;

            const slideContent = (
              <div className="relative w-full h-full" onDragStart={(e) => e.preventDefault()}>
                <Image
                  src={slide.image}
                  alt={slide.file_name || `Slide ${slide.id}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 620px"
                  className="object-contain pointer-events-none"
                  priority={isActive}
                  draggable="false"
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
                  onClick={handleLinkClick}
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
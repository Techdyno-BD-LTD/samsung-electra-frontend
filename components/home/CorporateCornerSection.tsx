"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  banner: string;
  category_name: string;
}

export default function CorporateCornerSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && Array.isArray(payload.data)) {
          setBlogs(payload.data);
          if (payload.data.length > 0) {
            // Set initial index to the middle copy
            setCurrentIndex(payload.data.length * 2);
          }
        }
      })
      .catch((err) => console.error("Error loading corporate corner blogs:", err))
      .finally(() => setLoading(false));

    // Resize listener
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
      <div className="w-full py-16 text-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (blogs.length === 0) return null;

  const handlePrev = () => {
    if (!transitionEnabled) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!transitionEnabled) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const handleTransitionEnd = () => {
    const n = blogs.length;
    if (currentIndex < n || currentIndex >= n * 4) {
      setTransitionEnabled(false);
      const originalIndex = ((currentIndex % n) + n) % n;
      setCurrentIndex(originalIndex + n * 2);
    }
  };

  const isMobile = windowWidth < 768;
  
  // Calculate card width based on screen width to fit 3 cards in viewport for lg-xl, and keep 550 for 2xl
  const getCardWidth = (width: number) => {
    if (width < 768) return Math.min(width - 48, 320);
    if (width < 1024) return 380; // md
    if (width < 1280) return 300; // lg (approx 1024px viewport)
    if (width < 1536) return 420; // xl (approx 1280px-1440px viewport)
    return 550; // 2xl (1536px and above)
  };
  
  const cardWidth = getCardWidth(windowWidth);
  const gap = isMobile ? 12 : 16;

  // Repeat the slides list 5 times for seamless looping
  const repeatedBlogs = [...blogs, ...blogs, ...blogs, ...blogs, ...blogs];

  // Calculate translation offset based on currentIndex
  const translationX = `calc(50% - ${currentIndex * (cardWidth + gap)}px - ${cardWidth / 2}px)`;

  return (
    <section className="w-full bg-transparent py-16 overflow-hidden select-none">
      <div className="max-w-[1900px] mx-auto text-center">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl lg:text-[32px] 2xl:text-[48px] font-medium text-gray-900 mb-5">
          Corporate Corner
        </h2>
        <p className="text-gray-900 text-sm lg:text-[16px]  2xl:text-[20px] mb-12 max-w-2xl mx-auto">
          Explore our latest press features, news highlights, and media coverage.
        </p>

        {/* Carousel Outer Container */}
        <div className="relative max-w-[1700px] mx-auto px-12">
          {/* Prev Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          {/* Slider Viewport */}
          <div className="w-full overflow-hidden py-6 relative">
            {/* Slider Track */}
            <div
              className={`flex ${transitionEnabled ? "transition-transform duration-500 ease-out" : ""}`}
              style={{ transform: `translateX(${translationX})` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {repeatedBlogs.map((blog, index) => {
                const isActive = index === currentIndex;

                const cardClasses = `relative flex-shrink-0 transition-all duration-500 ease-out  overflow-hidden shadow-lg border border-gray-100 ${
                  isActive
                    ? "scale-100 opacity-100 z-10 border-blue-200"
                    : "scale-[0.85] opacity-100 z-0"
                }`;

                const cardStyle = {
                  width: `${cardWidth}px`,
                  height: isMobile ? "320px" : "440px",
                  marginRight: `${gap}px`,
                };

                return (
                  <div key={`${blog.id}-${index}`} className={cardClasses} style={cardStyle}>
                    <div className="relative w-full h-full">
                      <Image
                        src={blog.banner || "/images/placeholder.jpg"}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 450px"
                        className="object-cover"
                        priority={isActive}
                      />

                      {/* Overlay */}
                      {isActive ? (
                        /* Active Slide Blue Banner style from Figma */
                        <div className="absolute bottom-0 inset-x-0 bg-blue-600 text-white px-8 py-4 text-left flex flex-row items-start justify-between gap-4 h-[110px]">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base sm:text-xl line-clamp-1 mb-1">
                              {blog.title}
                            </h3>
                            <p className="text-xs sm:text-base text-blue-100 line-clamp-2 font-light">
                              {blog.description ? blog.description.replace(/<[^>]*>/g, '') : "No details available."}
                            </p>
                          </div>
                          <div className="shrink-0">
                            <Link
                              href={`/blogs-and-news/${blog.slug}`}
                              className="inline-block px-5 py-1 mt-1 bg-transparent text-white font-bold text-base rounded-lg border border-white hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap"
                            >
                              Read More
                            </Link>
                          </div>
                        </div>
                      ) : (
                        /* Non-active overlay text at bottom */
                        <div className="absolute bottom-0 inset-x-0 h-[250px] bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 flex items-end text-left">
                          <h3 className="font-bold text-sm sm:text-xl text-white line-clamp-2">
                            {blog.title}
                          </h3>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
            aria-label="Next slide"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

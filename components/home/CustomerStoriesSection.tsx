"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

interface Testimonial {
  id: number;
  name: string;
  avatar: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "RajibGhosh",
    avatar: "/images/customer1.png",
    rating: 5,
    comment: "Upgraded our home appliances with Electra International, and the quality is exceptional. Great value for money!",
    created_at: "2026-03-10T12:00:00.000Z",
  },
  {
    id: 2,
    name: "Ishtiaque",
    avatar: "/images/customer1.png",
    rating: 5,
    comment: "The sales team was incredibly helpful in guiding us to the right deep freezer for our home. Highly recommended!",
    created_at: "2026-07-24T12:00:00.000Z",
  },
  {
    id: 3,
    name: "AdibaJahan",
    avatar: "/images/customer1.png",
    rating: 5,
    comment: "Fast delivery, authentic products, and hassle-free installation. Electra is always my go-to for home electronics.",
    created_at: "2026-04-23T12:00:00.000Z",
  },
  {
    id: 4,
    name: "IshaHaque",
    avatar: "/images/customer1.png",
    rating: 5,
    comment: "Bought a inverter AC last week—cooling is fantastic and energy consumption is noticeably low. Very satisfied!",
    created_at: "2026-11-14T12:00:00.000Z",
  },
];

export default function CustomerStoriesSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Carousel slider states for mobile
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1200);

  // Drag and Swipe Gesture states
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    fetch("/api/testimonials/approved")
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && Array.isArray(payload.data) && payload.data.length > 0) {
          setTestimonials(payload.data);
          setCurrentIndex(payload.data.length * 2);
        } else {
          setTestimonials(fallbackTestimonials);
          setCurrentIndex(fallbackTestimonials.length * 2);
        }
      })
      .catch((err) => {
        console.error("Error loading testimonials, falling back to mock data:", err);
        setTestimonials(fallbackTestimonials);
        setCurrentIndex(fallbackTestimonials.length * 2);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
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

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(0, testimonials.length - 4) : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= testimonials.length - 4 ? 0 : prev + 1));
  };

  // Jump index instantly if we transition into the boundary copies
  const handleTransitionEnd = () => {
    const n = testimonials.length;
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
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  if (loading) {
    return (
      <div className="w-full py-16 text-center bg-[#f0f4ff]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto"></div>
      </div>
    );
  }

  const displayedTestimonials = testimonials.slice(startIndex, startIndex + 4);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }).replace(/\//g, ".");
    } catch {
      return dateStr;
    }
  };

  const isMobile = windowWidth < 1024;
  const cardWidth = isMobile ? Math.min(windowWidth * 0.65, 230) : 360;
  const gap = isMobile ? 8 : 24;

  // Repeat the list 5 times for seamless looping on mobile
  const repeatedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials];

  // Calculate translation offset based on currentIndex and dragOffset
  const translationX = `calc(50% - ${currentIndex * (cardWidth + gap)}px - ${cardWidth / 2}px + ${dragOffset}px)`;

  return (
    <section className="relative w-full bg-transparent lg:pt-4 overflow-hidden">
      {/* Header */}
      <div className="max-w-[1700px]  lg:mb-10 mx-auto text-center px-6 md:px-16 lg:px-24">
        <h2 className="text-xl sm:text-4xl lg:text-[32px] 2xl:text-[38px] font-semibold text-gray-900 mb-2 lg:mb-4">
          Customer Stories
        </h2>
        <p className="text-gray-500 text-sm lg:text-[16px] 2xl:text-[18px] mb-[200px] lg:mb-60 max-w-2xl mx-auto">
          Now Serving You Across 37 Outlets Nationwide
        </p>
      </div>

      {/* Overlapping Blue Backdrop */}
      <div className="relative w-full lg:rounded-t-[100px] sm:rounded-t-[150px] bg-blue-600 lg:pt-28 pt-20 lg:pb-12 select-none">
        <div className="max-w-[1500px] mx-auto px-0 md:px-16 lg:px-24 flex items-center justify-between gap-6 relative">
          
          {/* Prev Arrow (Desktop Only) */}
          <button
            onClick={handlePrev}
            className="absolute left-0 lg:left-6 top-1/2 -translate-y-[150px] z-20 hidden lg:flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white text-white hover:text-blue-600 rounded-full transition-all shadow-md focus:outline-none"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          {/* Testimonial Cards Viewport (Desktop grid, Mobile sliding track) */}
          <div className="flex-grow w-full relative z-10 -mt-64 lg:-mt-64">
            
            {/* Desktop Static Grid Layout */}
            <div className="hidden lg:grid grid-cols-4 gap-6 lg:gap-1 mx-auto w-full justify-items-center">
              {displayedTestimonials.map((item) => (
                <div key={item.id} className="relative bg-gradient-to-br from-[#ffffff] via-[#e3e3fa] to-[#ffffff] rounded-3xl pt-16 pb-8 px-6 text-center shadow-lg border border-gray-100 flex flex-col justify-between h-[380px] w-72">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[92px] h-[92px] rounded-full border-4 border-blue-500 bg-blue-100 shadow-md overflow-hidden flex items-center justify-center">
                    <Image
                      src={item.avatar || "/assets/img/avatar-place.png"}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <span className="text-[80px] text-gray-300 font-jaro leading-none absolute top-16 left-3 select-none">“</span>
                  
                  <p className="text-gray-900 xl:text-[15px] font-poppins leading-relaxed line-clamp-4 font-base pt-2 flex-grow flex items-center justify-center">
                    {item.comment}
                  </p>
                  
                  <span className="text-[80px] text-gray-300 font-jaro leading-none absolute bottom-24 right-6 select-none">”</span>

                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < item.rating ? "text-yellow-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    <h4 className="font-bold text-gray-900 text-[16px]">{item.name}</h4>
                    <p className="text-[14px] text-gray-400 font-medium mt-0.5">
                      Reviewed On {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Touch Slider Viewport */}
            <div 
              className="block lg:hidden relative w-full overflow-hidden py-10 cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`flex ${transitionEnabled ? "transition-transform duration-500 ease-out" : ""}`}
                style={{ transform: `translateX(${translationX})` }}
                onTransitionEnd={handleTransitionEnd}
              >
                {repeatedTestimonials.map((item, index) => {
                  const isActive = index === currentIndex;

                  return (
                    <div
                      key={`${item.id}-mob-slide-${index}`}
                      className={`relative flex-shrink-0 bg-gradient-to-br from-[#ffffff] via-[#e3e3fa] to-[#ffffff] rounded-3xl pt-14 pb-6 px-5 text-center shadow-lg border transition-all duration-500 ease-out flex flex-col justify-between ${
                        isActive
                          ? "scale-100 opacity-100 z-10 border-blue-200"
                          : "scale-100 opacity-100 z-0 border-gray-100"
                      }`}
                      style={{
                        width: `${cardWidth}px`,
                        height: "320px",
                        marginRight: `${gap}px`,
                      }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[80px] h-[80px] rounded-full border-4 border-blue-500 bg-blue-100 shadow-md overflow-hidden flex items-center justify-center">
                        <Image
                          src={item.avatar || "/assets/img/avatar-place.png"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                          draggable="false"
                        />
                      </div>

                      <span className="text-[70px] text-gray-300 font-jaro leading-none absolute top-16 left-4 select-none">“</span>
                      
                      <p className="text-black text-xs leading-relaxed line-clamp-4 font-base pt-2 flex-grow flex items-center justify-center">
                        {item.comment}
                      </p>
                      
                      <span className="text-[70px] text-gray-300 font-jaro leading-none absolute bottom-20 right-4 select-none">”</span>

                      <div className="mt-3 border-t border-gray-100 pt-3">
                        <div className="flex items-center justify-center gap-1 mb-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < item.rating ? "text-yellow-400" : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>

                        <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                          Reviewed On {formatDate(item.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Next Arrow (Desktop Only) */}
          <button
            onClick={handleNext}
            className="absolute right-0 lg:right-6 top-1/2 -translate-y-[150px] z-20 hidden lg:flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white text-white hover:text-blue-600 rounded-full transition-all shadow-md focus:outline-none"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
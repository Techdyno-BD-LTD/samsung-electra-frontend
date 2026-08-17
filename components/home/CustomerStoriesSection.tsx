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
  const [activeStackIndex, setActiveStackIndex] = useState(3);

  useEffect(() => {
    fetch("/api/testimonials/approved")
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && Array.isArray(payload.data) && payload.data.length > 0) {
          setTestimonials(payload.data);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      })
      .catch((err) => {
        console.error("Error loading testimonials, falling back to mock data:", err);
        setTestimonials(fallbackTestimonials);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(0, testimonials.length - 4) : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= testimonials.length - 4 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="w-full py-16 text-center bg-[#f0f4ff]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto"></div>
      </div>
    );
  }

  const displayedTestimonials = testimonials.slice(startIndex, startIndex + 4);

  // Calculates visual stack level from 0 (top-most card) to 3 (front active card)
  const getSlotPosition = (cardIndex: number) => {
    const total = displayedTestimonials.length;
    return (cardIndex - activeStackIndex + 3 + total) % total;
  };

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

  return (
    <section className="relative w-full bg-transparent lg:pt-4 overflow-hidden">
      {/* Header */}
      <div className="max-w-[1700px] mb-1 lg:mb-10 mx-auto text-center px-6 md:px-16 lg:px-24">
        <h2 className="text-xl sm:text-4xl lg:text-[32px] 2xl:text-[38px] font-bold text-gray-900 mb-2 lg:mb-4">
          Customer Stories
        </h2>
        <p className="text-gray-500 text-sm lg:text-[16px] 2xl:text-[18px] mb-40 lg:mb-60 max-w-2xl mx-auto">
          Now Serving You Across 37 Outlets Nationwide
        </p>
      </div>

      {/* Overlapping Blue Backdrop */}
      <div className="relative w-full rounded-t-[150px] bg-blue-600 lg:pt-28 pt-20 pb-12">
        <div className="max-w-[1700px] mx-auto px-6 md:px-16 lg:px-24 flex items-center justify-between gap-6 relative">
          
          {/* Prev Arrow (Desktop Only) */}
          <button
            onClick={handlePrev}
            className="absolute left-0 lg:left-6 top-1/2 -translate-y-[150px] z-20 hidden lg:flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white text-white hover:text-blue-600 rounded-full transition-all shadow-md focus:outline-none"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          {/* Testimonial Cards Wrapper */}
          <div className="flex-1 relative h-[310px] lg:h-auto lg:grid lg:grid-cols-4 gap-6 lg:gap-8 -mt-56 lg:-mt-64 z-10 px-3 sm:px-8 mx-auto w-full max-w-[370px] sm:max-w-[420px] lg:max-w-none">
            {displayedTestimonials.map((item, index) => {
              const slot = getSlotPosition(index); // 0 = back/top card, 3 = front/bottom card
              const isCardActive = slot === 3;

              return (
                <React.Fragment key={item.id}>
                  {/* --- Desktop Layout (Unchanged) --- */}
                  <div className="hidden lg:flex relative bg-white rounded-3xl pt-16 pb-8 px-6 text-center shadow-lg border border-gray-100 flex-col justify-between h-[350px]">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[88px] h-[88px] rounded-full border-4 border-blue-500 bg-blue-100 shadow-md overflow-hidden flex items-center justify-center">
                      <Image
                        src={item.avatar || "/assets/img/avatar-place.png"}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <span className="text-[80px] text-gray-200 font-serif leading-none absolute top-16 left-6 select-none">“</span>
                    
                    <p className="text-gray-900 xl:text-base leading-relaxed line-clamp-4 font-base pt-2 flex-grow flex items-center justify-center">
                      {item.comment}
                    </p>
                    
                    <span className="text-[80px] text-gray-200 font-serif leading-none absolute bottom-24 right-6 select-none">”</span>

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

                  {/* --- Mobile Stacked Deck Layout --- */}
                  <div
                    onClick={() => setActiveStackIndex(index)}
                    className="block lg:hidden absolute inset-x-0 top-0 rounded-2xl border border-blue-200 bg-[#f4f8ff] p-3.5 shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out cursor-pointer select-none"
                    style={{
                      transform: `translateY(${slot * 38}px) scale(${0.91 + slot * 0.03})`,
                      transformOrigin: "top center",
                      zIndex: 10 + slot * 10,
                      opacity: 1,
                    }}
                  >
                    {/* Header Row: Avatar, Name & Stars */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-white p-[1px] shadow-sm flex-shrink-0 overflow-hidden flex items-center justify-center">
                          <Image
                            src={item.avatar || "/assets/img/avatar-place.png"}
                            alt={item.name}
                            width={32}
                            height={32}
                            className="rounded-full object-cover w-full h-full"
                          />
                        </div>
                        <span className="font-bold text-slate-800 text-[14px]">
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < item.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Active Card Body: Comment Text & Date */}
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                        isCardActive
                          ? "grid-rows-[1fr] opacity-100 mt-3 pt-2"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-xs text-slate-700 leading-relaxed font-normal">
                          &ldquo;{item.comment}&rdquo;
                        </p>
                        <div className="mt-2 text-right">
                          <span className="text-[11px] font-medium text-slate-500">
                            Reviewed On {formatDate(item.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
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
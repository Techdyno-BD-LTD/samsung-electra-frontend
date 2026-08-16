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
    name: "Ishtiaque Hasan",
    avatar: "/images/customer1.png",
    rating: 5,
    comment: "The sales team was incredibly helpful in guiding us to the right deep freezer for our home. Highly recommended!",
    created_at: "2026-07-24T12:00:00.000Z"
  },
  {
    id: 2,
    name: "Adiba Jahan",
    avatar: "/images/customer1.png",
    rating: 5,
    comment: "Fast delivery, authentic products, and hassle-free installation. Electra is always my go-to for home electronics.",
    created_at: "2026-04-23T12:00:00.000Z"
  },
  {
    id: 3,
    name: "Rajib Ghosh",
    avatar: "/images/customer1.png",
    rating: 5,
    comment: "Upgraded our home appliances with Electra International, and the quality is exceptional. Great value for money!",
    created_at: "2026-03-10T12:00:00.000Z"
  },
  {
    id: 4,
    name: "Isha Haque",
    avatar: "/images/customer1.png",
    rating: 5,
    comment: "Bought a inverter AC last week—cooling is fantastic and energy consumption is noticeably low. Very satisfied!",
    created_at: "2026-11-14T12:00:00.000Z"
  }
];

export default function CustomerStoriesSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
    <section className="relative w-full bg-transparent pt-16 overflow-hidden">
      {/* Header (Centered Container) */}
      <div className="max-w-[1700px] mb-10 mx-auto text-center px-6 md:px-16 lg:px-24">
        <h2 className="text-3xl sm:text-4xl lg:text-[32px] 2xl:text-[48px] font-bold text-gray-900 mb-2">
          Customer Stories
        </h2>
        <p className="text-gray-500 text-sm lg:text-[16px]  2xl:text-[20px] mb-60 max-w-2xl mx-auto">
          Now Serving You Across 37 Outlets Nationwide
        </p>
      </div>

      {/* Overlapping Blue Backdrop (Full Width) */}
      <div className="relative w-full rounded-t-[50px] bg-blue-600 pt-28 pb-12">
        <div className="max-w-[1700px] mx-auto px-6 md:px-16 lg:px-24 flex items-center justify-between gap-6 relative">
          
          {/* Prev Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-0 lg:left-6 top-1/2 -translate-y-[150px] z-20 flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white text-white hover:text-blue-600 rounded-full transition-all shadow-md focus:outline-none"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          {/* Testimonial Cards Wrapper */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 justify-center items-center -mt-64 relative z-10 px-8 mx-auto w-full">
            {displayedTestimonials.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-3xl pt-16 pb-8 px-6 text-center shadow-lg border border-gray-100 flex flex-col justify-between h-[500px]"
              >
                {/* Overlapping Avatar */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-blue-500 bg-blue-100 shadow-md overflow-hidden flex items-center justify-center">
                  <Image
                    src={item.avatar || "/assets/img/avatar-place.png"}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Big Quote marks styling */}
                <span className="text-[80px] text-gray-200 font-serif leading-none absolute top-6 left-6 select-none">“</span>
                
                {/* Comment Text */}
                <p className="text-gray-900 2xl:text-xl leading-relaxed line-clamp-4 font-base pt-2 flex-grow flex items-center justify-center">
                  {item.comment}
                </p>
                
                <span className="text-[80px] text-gray-200 font-serif leading-none absolute bottom-20 right-6 select-none">”</span>

                {/* Bottom section (Name, Rating, Date) */}
                <div className="mt-4 border-t border-gray-100 pt-4">
                  {/* Rating Stars */}
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

                  <h4 className="font-bold text-gray-900 text-[20px]">{item.name}</h4>
                  <p className="text-[16px] text-gray-400 font-medium mt-0.5">
                    Reviewed On {formatDate(item.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-0 lg:right-6 top-1/2 -translate-y-[150px] z-20 flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white text-white hover:text-blue-600 rounded-full transition-all shadow-md focus:outline-none"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

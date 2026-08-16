"use client";

import React, { useEffect, useState } from "react";

interface StoresData {
  stores_title: string;
  stores_description: string;
  stores_gif: string | null;
  stores_districts: string;
  stores_own_retail: string;
  stores_dealers: string;
  stores_employees: string;
  stores_map_link: string | null;
}

const AnimatedNumber = ({ value }: { value: string }) => {
  const endValue = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1200; // 1.2 seconds animation
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const currentCount = Math.min(
        Math.floor((progress / duration) * endValue),
        endValue
      );

      setCount(currentCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [endValue]);

  const suffix = value.replace(/[\d\s]/g, "");

  return <>{count}{suffix}</>;
};

export default function OurStoresSection() {
  const [data, setData] = useState<StoresData>({
    stores_title: "Our Stores",
    stores_description: "Now Serving You Across 37 Retail Outlets Nationwide",
    stores_gif: null,
    stores_districts: "26",
    stores_own_retail: "37",
    stores_dealers: "100+",
    stores_employees: "500+",
    stores_map_link: null,
  });

  useEffect(() => {
    let mounted = true;
    fetch("/api/homepage/about")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((payload) => {
        if (!mounted) return;
        const d = payload?.data;
        if (d) {
          setData({
            stores_title: d.stores_title || "Our Stores",
            stores_description: d.stores_description || "Now Serving You Across 37 Retail Outlets Nationwide",
            stores_gif: d.stores_gif || null,
            stores_districts: d.stores_districts || "26",
            stores_own_retail: d.stores_own_retail || "37",
            stores_dealers: d.stores_dealers || "100+",
            stores_employees: d.stores_employees || "500+",
            stores_map_link: d.stores_map_link || null,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load homepage stores settings:", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Background GIF
  const bgImage = data.stores_gif || "";

  return (
    <section 
      className="relative w-full aspect-[1920/726] bg-cover bg-center overflow-hidden flex flex-col justify-between p-8 md:p-12 lg:p-16 select-none bg-slate-50"
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      {/* Top Center: Title and Description */}
      <div className="w-full text-center mt-4">
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] 2xl:text-[48px] font-bold text-gray-900 mb-1 lg:mb-4">
          {data.stores_title}
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm lg:text-[16px]  2xl:text-[20px]  font-medium max-w-2xl mx-auto">
          {data.stores_description}
        </p>
      </div>

      {/* Bottom Right: Statistics and Map Link (Responsive design to prevent overlapping on lg/xl viewports) */}
      <div className="self-end mr-4 mb-4 lg:mr-8 lg:mb-4 xl:mr-6 xl:mt-36 2xl:mr-16 2xl:mb-8 text-left bg-white/10 backdrop-blur-sm p-4 xl:p-5 2xl:p-6 rounded-2xl shadow-lg max-w-sm sm:max-w-md lg:max-w-[480px] xl:max-w-[600px] 2xl:max-w-[1000px]">
        <div className="grid grid-cols-4 gap-3 xl:gap-5 2xl:gap-6 items-end mb-4 xl:mb-5 2xl:mb-6">
          {/* Districts */}
          <div className="flex flex-col text-left">
            <span className="text-[10px] sm:text-xs lg:text-[13px] xl:text-[16px] 2xl:text-[20px] font-semibold text-gray-700 mb-2 xl:mb-3 2xl:mb-4">
              Districts
            </span>
            <span className="text-xl sm:text-2xl lg:text-[28px] xl:text-[38px] 2xl:text-[56px] font-extrabold text-blue-600 leading-none">
              <AnimatedNumber value={data.stores_districts} />
            </span>
          </div>

          {/* Own Retail */}
          <div className="flex flex-col text-left">
            <span className="text-[10px] sm:text-xs lg:text-[13px] xl:text-[16px] 2xl:text-[20px] font-semibold text-gray-700 mb-2 xl:mb-3 2xl:mb-4">
              Own Retail
            </span>
            <span className="text-xl sm:text-2xl lg:text-[28px] xl:text-[38px] 2xl:text-[56px] font-extrabold text-blue-600 leading-none">
              <AnimatedNumber value={data.stores_own_retail} />
            </span>
          </div>

          {/* Dealers */}
          <div className="flex flex-col text-left">
            <span className="text-[10px] sm:text-xs lg:text-[13px] xl:text-[16px] 2xl:text-[20px] font-semibold text-gray-700 mb-2 xl:mb-3 2xl:mb-4">
              Dealers
            </span>
            <span className="text-xl sm:text-2xl lg:text-[28px] xl:text-[38px] 2xl:text-[56px] font-extrabold text-blue-600 leading-none whitespace-nowrap">
              <AnimatedNumber value={data.stores_dealers} /> + 
            </span>
          </div>

          {/* Employees */}
          <div className="flex flex-col text-left">
            <span className="text-[10px] sm:text-xs lg:text-[13px] xl:text-[16px] 2xl:text-[20px] font-semibold text-gray-700 mb-2 xl:mb-3 2xl:mb-4">
              Employees
            </span>
            <span className="text-xl sm:text-2xl lg:text-[28px] xl:text-[38px] 2xl:text-[56px] font-extrabold text-blue-600 leading-none whitespace-nowrap">
              <AnimatedNumber value={data.stores_employees} /> +
            </span>
          </div>
        </div>

        {/* Google Map Action Link */}
        <a 
          href={data.stores_map_link || "/stores"}
          target={data.stores_map_link ? "_blank" : undefined}
          rel={data.stores_map_link ? "noopener noreferrer" : undefined}
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm xl:text-base px-5 py-2 xl:px-6 xl:py-2.5 rounded-lg shadow-md transition-all select-none"
        >
          Google Map
        </a>
      </div>
    </section>
  );
}

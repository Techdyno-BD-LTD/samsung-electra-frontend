'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Brand {
  name: string;
  logo: string;
  instructions: string[];
}

interface Category {
  name: string;
  brands: Brand[];
}

interface InstallationContainerProps {
  categories: Category[];
}

// Fallback helper to resolve brand logo paths
const getBrandLogo = (logo: string) => {
  if (!logo) return '';
  if (logo.startsWith('http://') || logo.startsWith('https://')) {
    return logo;
  }
  // If it's a relative path to public images, resolve it correctly
  let path = logo;
  if (path.startsWith('/images/brands/')) {
    const filename = path.replace('/images/brands/', '');
    if (filename === 'whirlpool.png') {
      path = '/images/whirpool.png';
    } else if (filename === 'philips.png') {
      path = '/images/phillips.png';
    } else {
      path = `/images/${filename}`;
    }
  }
  return path;
};

const InstallationContainer: React.FC<InstallationContainerProps> = ({ categories }) => {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [activeBrandIdx, setActiveBrandIdx] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const currentCategory = categories[activeCategoryIdx] || null;
  const currentBrands = currentCategory?.brands || [];
  const currentBrand = currentBrands[activeBrandIdx] || null;

  // Reset active brand index when category changes
  useEffect(() => {
    setActiveBrandIdx(0);
  }, [activeCategoryIdx]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded border border-slate-200 p-8">
        <p className="text-slate-500 font-medium text-lg">No installation categories configured.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Tabs Slider */}
      <div className="relative flex items-center border border-slate-200 bg-[#f8fafc]">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-0 bottom-0 bg-white/90 hover:bg-slate-200 border-r border-slate-200 px-3.5 z-10 flex items-center justify-center transition-colors shadow-sm"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable Tabs Wrapper */}
        <div
          ref={sliderRef}
          className="flex-grow flex overflow-x-auto scrollbar-none scroll-smooth px-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex divide-x divide-slate-200">
            {categories.map((cat, idx) => {
              const active = idx === activeCategoryIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveCategoryIdx(idx)}
                  className={`py-5 px-8 text-center text-base md:text-lg font-bold transition-all duration-200 whitespace-nowrap ${
                    active
                      ? 'bg-black text-white border-b-2 border-black'
                      : 'bg-transparent text-slate-800 hover:bg-slate-200/50'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-0 bottom-0 bg-white/90 hover:bg-slate-200 border-l border-slate-200 px-3.5 z-10 flex items-center justify-center transition-colors shadow-sm"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Main Content Side-by-Side Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Associated Brands list */}
        <div className="md:col-span-3">
          <div className="flex flex-col border border-slate-200 divide-y divide-slate-200 bg-white">
            {currentBrands.map((brand, idx) => {
              const active = idx === activeBrandIdx;
              const logoSrc = getBrandLogo(brand.logo);
              return (
                <button
                  key={idx}
                  onClick={() => setActiveBrandIdx(idx)}
                  className={`w-full p-5 transition-all duration-200 flex items-center justify-center bg-white ${
                    active
                      ? 'border-2 border-black -outline-offset-2 z-10'
                      : 'hover:bg-slate-50'
                  }`}
                  style={active ? { borderWidth: '2px', borderColor: '#000000' } : {}}
                >
                  {logoSrc ? (
                    <div className="relative w-full h-12 flex items-center justify-center p-1">
                      <Image
                        src={logoSrc}
                        alt={brand.name}
                        width={120}
                        height={48}
                        className="object-contain max-h-10 w-auto"
                        priority
                      />
                    </div>
                  ) : (
                    <span className="font-bold text-slate-800 text-lg uppercase tracking-wide">{brand.name}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Installation Instructions Text */}
        <div className="md:col-span-9 bg-white border border-slate-200 p-8 min-h-[300px]">
          {currentBrand ? (
            <div className="space-y-4 text-slate-800 text-[15px] md:text-base leading-relaxed">
              {currentBrand.instructions && currentBrand.instructions.length > 0 ? (
                currentBrand.instructions.map((inst, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <span className="font-semibold text-slate-900 whitespace-nowrap mt-0.5">{index + 1}.</span>
                    <p className="text-slate-700 font-medium">
                      {inst}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 font-medium italic">No custom instructions defined for this brand.</p>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 font-medium">
              Select a brand to view installation instructions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallationContainer;

'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type MobileProductGalleryProps = {
  images: string[];
  title: string;
  warrantyBadgeImage: string;
};

export default function MobileProductGallery({
  images,
  title,
  warrantyBadgeImage,
}: MobileProductGalleryProps) {
  const galleryImages = useMemo(() => (images.length > 0 ? images : ['/images/wm2.png']), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => setActiveIndex(index);

  return (
    <div className="relative md:hidden">
      <Image
        src={galleryImages[activeIndex]}
        alt={`${title} image ${activeIndex + 1}`}
        width={520}
        height={520}
        className="mx-auto h-[220px] w-full object-contain"
        priority
      />

      {galleryImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous image"
            className="absolute left-1.5 top-1/2 z-10 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow"
          >
            <FaChevronLeft className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next image"
            className="absolute right-1.5 top-1/2 z-10 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow"
          >
            <FaChevronRight className="h-3.5 w-3.5" />
          </button>

          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/20 px-2 py-1">
            {galleryImages.map((item, index) => (
              <button
                key={`${item}-dot-${index}`}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Go to image ${index + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  activeIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}

      <Image
        src={warrantyBadgeImage}
        alt="Official warranty"
        width={120}
        height={120}
        className="absolute bottom-2 left-2 h-14 w-14 object-contain sm:h-16 sm:w-16"
      />
    </div>
  );
}
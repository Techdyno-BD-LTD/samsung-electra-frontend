'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

type MobileProductGalleryProps = {
  productData?: {
    name?: string;
    thumbnail_image?: string;
    photos?: Array<{ photo?: string; path?: string }>;
  };
  images?: string[];
  title?: string;
  warrantyBadgeImage?: string;
  onImageClick?: (index: number) => void;
};

export default function MobileProductGallery({
  productData,
  images = [],
  title = "Product",
  warrantyBadgeImage = "/images/warrantybadge.png",
  onImageClick,
}: MobileProductGalleryProps) {
  const galleryImages = useMemo(
    () => {
      let photos = productData?.photos || [];
      if (typeof photos === 'string') {
        try {
          photos = JSON.parse(photos);
        } catch {
          photos = [];
        }
      }
      const productImages = (Array.isArray(photos) ? photos : []).map((photo) => photo.path || photo.photo || "").filter(Boolean) || [];
      return (productImages.length > 0 ? productImages : images.length > 0 ? images : [productData?.thumbnail_image || '/images/wm2.png']);
    },
    [images, productData?.photos, productData?.thumbnail_image]
  );
  const productTitle = productData?.name || title;
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  const goToSlide = (index: number) => setActiveIndex(index);

  return (
    <div 
      className="relative md:hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Image
        src={galleryImages[activeIndex]}
        alt={`${productTitle} image ${activeIndex + 1}`}
        width={520}
        height={520}
        className="mx-auto h-[220px] w-full object-contain cursor-pointer"
        priority
        onClick={() => onImageClick?.(activeIndex)}
      />

      {galleryImages.length > 1 && (
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
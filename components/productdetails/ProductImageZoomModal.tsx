"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { FaTimes, FaPlus, FaMinus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ProductImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
  altText: string;
}

export default function ProductImageZoomModal({
  isOpen,
  onClose,
  images,
  initialIndex,
  altText,
}: ProductImageZoomModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Swipe support
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const currentImage = useMemo(() => images[currentIndex] || images[0], [images, currentIndex]);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, initialIndex]);

  // Reset zoom/position when changing images
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, currentIndex]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.25, 1);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      return newScale;
    });
  };
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart, scale]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (scale > 1) return; // Disable swipe when zoomed
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (scale > 1) return;
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX || scale > 1) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) handleNext();
    else if (isRightSwipe) handlePrev();
    
    setTouchStartX(null);
    setTouchEndX(null);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/95 backdrop-blur-lg animate-in fade-in duration-300"
      onWheel={handleWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Header Controls */}
      <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between px-6">
        <div className="text-white/70 text-sm font-medium bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {currentIndex + 1} / {images.length}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <button 
              onClick={handleZoomOut}
              className="p-2 text-white/70 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <FaMinus />
            </button>
            <span className="text-white font-medium min-w-[3rem] text-center text-sm">
              {Math.round(scale * 100)}%
            </span>
            <button 
              onClick={handleZoomIn}
              className="p-2 text-white/70 hover:text-white transition-colors"
              title="Zoom In"
            >
              <FaPlus />
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="bg-white/10 backdrop-blur-md rounded-full p-3 text-white/70 hover:text-white hover:bg-white/20 transition-all border border-white/20"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && scale === 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 z-20 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all border border-white/5 backdrop-blur-sm hidden md:block"
          >
            <FaChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 z-20 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all border border-white/5 backdrop-blur-sm hidden md:block"
          >
            <FaChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Image Container */}
      <div 
        ref={containerRef}
        className={`relative w-full h-full flex items-center justify-center overflow-hidden cursor-${scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => {
          if (scale > 1) {
            handleReset();
          } else {
            setScale(2);
          }
        }}
      >
        <div
          ref={imageRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          className="relative max-w-full max-h-full"
        >
          <Image
            src={currentImage}
            alt={altText}
            width={1200}
            height={1200}
            className="max-w-[85vw] max-h-[85vh] object-contain pointer-events-none select-none transition-all duration-300"
            priority
          />
        </div>
      </div>

      {/* Helper text */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-[12px] pointer-events-none bg-black/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/5">
        {scale > 1 ? "Drag to move • Double tap to reset" : "Swipe or use arrows to navigate • Scroll to zoom"}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function MobileSplashLoader() {
  // Start as true so the server sends the HTML with the loader already visible (avoiding layout flash)
  const [showLoader, setShowLoader] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 1. If not on mobile, hide immediately
    if (window.innerWidth >= 640) {
      setShowLoader(false);
      return;
    }

    // 2. If already loaded in this session, hide immediately
    const hasLoaded = sessionStorage.getItem("mobile-splash-loaded");
    if (hasLoaded) {
      setShowLoader(false);
      return;
    }

    // 3. Otherwise, play the animation
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2000); // Display loader for 2 seconds

    const removeTimer = setTimeout(() => {
      setShowLoader(false);
      document.body.style.overflow = "";
      sessionStorage.setItem("mobile-splash-loaded", "true");
    }, 2500); // 2s display + 0.5s fade out animation

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!showLoader) return null;

  return (
    <div
      className={`fixed inset-0 bg-black z-[99999] flex sm:hidden flex-col items-center justify-center transition-opacity duration-500 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex items-center justify-center w-36 h-36">
        {/* Spinning Blue Circle */}
        <div className="absolute inset-0 border-4 border-blue-500/20 border-t-[#0054A6] rounded-full animate-spin"></div>
        {/* Logo inside */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <Image
            src="/images/electrawhitelogo.png"
            alt="Electra Logo"
            fill
            className="object-contain p-2"
            priority
          />
        </div>
      </div>
    </div>
  );
}


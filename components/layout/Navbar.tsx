"use client";

import { useEffect, useState } from "react";
import TopBar from "./TopBar";
import MainBar from "./MainBar";
import BottomBar from "./BottomBar";
import MobileNavbar from "./MobileNavbar";
// import MobileBottomBar from "./MobileBottomBar";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 38px is the height of TopBar. Once scrolled past it, MainBar sticks.
      if (window.scrollY > 38) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden lg:block bg-white">
        <TopBar />
      </div>
      
      <div className={`hidden lg:block ${scrolled ? "fixed top-0 inset-x-0 z-[1001] bg-black shadow-md" : "bg-black"}`}>
        <MainBar />
      </div>
      {scrolled && <div className="hidden lg:block h-[64px]" />}
      
      <div className="hidden lg:block bg-white">
        <BottomBar />
      </div>
      
      {/* Mobile Navigation - Hidden on desktop */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-[1001] bg-white pt-safe">
        <MobileNavbar />
        {/* <MobileBottomBar /> */}
      </div>
    </>
  );
}

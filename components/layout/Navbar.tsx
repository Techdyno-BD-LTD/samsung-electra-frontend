"use client";

import TopBar from "./TopBar";
import MainBar from "./MainBar";
import BottomBar from "./BottomBar";
import MobileNavbar from "./MobileNavbar";
// import MobileBottomBar from "./MobileBottomBar";

export default function Navbar() {
  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden lg:block bg-white">
        <TopBar />
      </div>
      
      <div className="hidden lg:block bg-black">
        <MainBar />
      </div>
      
      <div className="hidden lg:block sticky top-0 z-40">
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

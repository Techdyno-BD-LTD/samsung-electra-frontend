import TopBar from "./TopBar";
import MainBar from "./MainBar";
import BottomBar from "./BottomBar";
import MobileNavbar from "./MobileNavbar";
import MobileBottomBar from "./MobileBottomBar";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white pt-safe">
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden lg:block">
        <TopBar />
        <MainBar />
        <BottomBar />
      </div>
      
      {/* Mobile Navigation - Hidden on desktop */}
      <div className="lg:hidden">
        <MobileNavbar />
        <MobileBottomBar />
      </div>
    </header>
  );
}

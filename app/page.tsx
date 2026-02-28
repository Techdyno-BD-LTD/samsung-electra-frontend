import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { getRouteMetadata } from "@/lib/metadata";

export const metadata = getRouteMetadata("home");

export default function Home() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <FeaturedProducts />
    </div>
  );
}

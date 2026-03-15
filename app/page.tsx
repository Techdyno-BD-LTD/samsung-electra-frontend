import { getRouteMetadata } from "@/lib/metadata";

import HeroSection from "@/components/home/HeroSection";
import ServiceHighlights from "@/components/home/ServiceHighlights";
import ShopByCategory from "@/components/home/ShopByCategory";
import PopularProducts from "@/components/home/PopularProducts";
export const metadata = getRouteMetadata("home");

export default function Home() {
  return (
    <div className="space-y-16">
      <section className=" mx-auto  py-8 mt-8">
        <HeroSection/>
        <div className="mt-5">
          <ServiceHighlights />
        </div>
        <div className="lg:mt-14 mt-5">
          <ShopByCategory />
        </div>
        <div className="lg:mt-14 mt-5">
          <PopularProducts/>
        </div>
        
      </section>
    </div>
  );
}

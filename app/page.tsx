import { getRouteMetadata } from "@/lib/metadata";

import HeroSection from "@/components/home/HeroSection";
import ServiceHighlights from "@/components/home/ServiceHighlights";

export const metadata = getRouteMetadata("home");

export default function Home() {
  return (
    <div className="space-y-16">
      <section className=" mx-auto  py-8 mt-8">
        <HeroSection/>
        <div className="mt-5">
          <ServiceHighlights />
        </div>
        
      </section>
    </div>
  );
}

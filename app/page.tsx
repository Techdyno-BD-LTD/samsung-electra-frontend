import { getRouteMetadata } from "@/lib/metadata";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export const metadata = getRouteMetadata("home");

export default function Home() {
  return (
    <div className="space-y-16">
      <section className=" mx-auto  py-8 mt-24">
        <FeaturedProducts />
      </section>
    </div>
  );
}

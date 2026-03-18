import { getRouteMetadata } from "@/lib/metadata";

import HeroSection from "@/components/home/HeroSection";
import ServiceHighlights from "@/components/home/ServiceHighlights";
import ShopByCategory from "@/components/home/ShopByCategory";
import PopularProducts from "@/components/home/PopularProducts";
import CategoryWiseProducts from "@/components/home/CategoryWiseProducts";
import StoreBanner from "@/components/home/StoreBanner";
import OurBrands from "@/components/home/OurBrands";
import BestSellingProducts from "@/components/home/BestSellingProducts";
import DualPromoBanners from "@/components/home/DualPromoBanners";
import FlashDeals from "@/components/home/FlashDeals";
import SingleWideBanner from "@/components/home/SingleWideBanner";
import Newsletter from "@/components/home/Newsletter";
import SpecialDeals from "@/components/home/SpecialDeals";
import AboutElectraHtmlSection from "@/components/home/AboutElectraHtmlSection";
import airConditionerProducts from "@/database/airconditionerproducts.json";
import refrigeratorProducts from "@/database/refrigeratorproducts.json";
import washingMachineProducts from "@/database/washingmachineproducts.json";
import microwaveProducts from "@/database/microwaveproducts.json";
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
         <div className="lg:mt-14 mt-5">
          <StoreBanner />
        </div>
        <div className="lg:mt-14 mt-5 ">
          <OurBrands />
        </div>
        <div className="lg:mt-14 mt-5">
          <BestSellingProducts />
        </div>
        <div className="lg:mt-14 mt-5">
          <DualPromoBanners />
        </div>
        <div className="lg:mt-14 mt-5">
          <FlashDeals />
        </div>
       
        
        
        <div className="lg:mt-14 mt-5">
          <CategoryWiseProducts
            title="Air Conditioner"
            products={airConditionerProducts}
            seeMoreHref="/products"
          />
        </div>
        <div className="lg:mt-14 mt-5">
          <CategoryWiseProducts
            title="Refrigerator"
            products={refrigeratorProducts}
            seeMoreHref="/products"
          />
        </div>
        <div className="lg:mt-14 mt-5">
          <CategoryWiseProducts
            title="Washing Machine"
            products={washingMachineProducts}
            seeMoreHref="/products"
          />
        </div>
         <div className="lg:mt-14 mt-5">
          <SingleWideBanner />
        </div>
      
        <div className="lg:mt-14 mt-5">
          <CategoryWiseProducts
            title="Microwave"
            products={microwaveProducts}
            seeMoreHref="/products"
          />
        </div>
          <div className="lg:mt-14 mt-5">
          <Newsletter />
        </div>
        <div className="lg:mt-14 mt-5">
          <SpecialDeals />
        </div>
        <div className="lg:mt-14 mt-5">
          <AboutElectraHtmlSection />
        </div>
       
        
      </section>
    </div>
  );
}

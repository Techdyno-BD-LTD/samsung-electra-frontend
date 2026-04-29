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
// import FlashDeals from "@/components/home/FlashDeals";
import SingleWideBanner from "@/components/home/SingleWideBanner";
import Newsletter from "@/components/home/Newsletter";
import SpecialDeals from "@/components/home/SpecialDeals";
import AboutElectraHtmlSection from "@/components/home/AboutElectraHtmlSection";
// Metadata is now dynamically handled in layout.tsx

type HomepageCategoryWiseProductSection = {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  title: string;
  subtitle: string;
  seeMoreHref: string;
};

const fallbackCategorySections: HomepageCategoryWiseProductSection[] = [
  {
    categoryId: 1,
    categoryName: "Air Conditioner",
    categorySlug: "air-conditionar",
    title: "Air Conditioner Products",
    subtitle: "",
    seeMoreHref: "/products/category/air-conditioner",
  },
  {
    categoryId: 2,
    categoryName: "Refrigerator",
    categorySlug: "refrigerator",
    title: "Refrigerator Products",
    subtitle: "",
    seeMoreHref: "/products/category/refrigerator",
  },
  {
    categoryId: 3,
    categoryName: "Washing Machine",
    categorySlug: "washing-machine",
    title: "Washing Machine Products",
    subtitle: "",
    seeMoreHref: "/products/category/washing-machine",
  },
  {
    categoryId: 4,
    categoryName: "Microwave",
    categorySlug: "microwave",
    title: "Microwave Products",
    subtitle: "",
    seeMoreHref: "/products/category/microwave-oven",
  },
];

async function getHomepageCategorySections(): Promise<HomepageCategoryWiseProductSection[]> {
  const backendUrl = process.env.API_BASE_URL || "http://localhost:5000";
  const systemKey = process.env.API_SYSTEM_KEY || "";

  if (!systemKey) {
    return fallbackCategorySections;
  }

  try {
    const response = await fetch(`${backendUrl}/api/v2/homepage-category-wise-products`, {
      cache: "no-store",
      headers: {
        "x-system-key": systemKey,
      },
    });

    if (!response.ok) {
      return fallbackCategorySections;
    }

    const payload = (await response.json()) as {
      data?: HomepageCategoryWiseProductSection[];
      success?: boolean;
    };

    if (!Array.isArray(payload.data) || payload.data.length === 0) {
      return fallbackCategorySections;
    }

    return payload.data;
  } catch {
    return fallbackCategorySections;
  }
}

export default async function Home() {
  const categorySections = await getHomepageCategorySections();
  const primarySections = categorySections.slice(0, 3);
  const secondarySections = categorySections.slice(3);

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
        {/* <div className="lg:mt-14 mt-5">
          <FlashDeals />
        </div> */}

        {primarySections.map((section) => (
          <div className="lg:mt-14 mt-5" key={`${section.categoryId}-${section.categorySlug}`}>
            <CategoryWiseProducts
              title={section.title}
              subtitle={section.subtitle}
              categorySlug={section.categorySlug}
              seeMoreHref={section.seeMoreHref}
            />
          </div>
        ))}

        <div className="lg:mt-14 mt-5">
          <SingleWideBanner />
        </div>
      
        {secondarySections.map((section) => (
          <div className="lg:mt-14 mt-5" key={`${section.categoryId}-${section.categorySlug}`}>
            <CategoryWiseProducts
              title={section.title}
              subtitle={section.subtitle}
              categorySlug={section.categorySlug}
              seeMoreHref={section.seeMoreHref}
            />
          </div>
        ))}

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

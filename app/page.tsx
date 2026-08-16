

import HeroSection from "@/components/home/HeroSection";
import HomeSliderTwo from "@/components/home/HomeSliderTwo";
// import ServiceHighlights from "@/components/home/ServiceHighlights";
// import ShopByCategory from "@/components/home/ShopByCategory";
// import PopularProducts from "@/components/home/PopularProducts";
// import CategoryWiseProducts from "@/components/home/CategoryWiseProducts";
import StoreBanner from "@/components/home/StoreBanner";
import OurBrands from "@/components/home/OurBrands";
// import BestSellingProducts from "@/components/home/BestSellingProducts";
import DualPromoBanners from "@/components/home/DualPromoBanners";
// import FlashDeals from "@/components/home/FlashDeals";
import SingleWideBanner from "@/components/home/SingleWideBanner";
import ExclusiveDeals from "@/components/home/ExclusiveDeals";
import HomepageTabsSlider from "@/components/home/HomepageTabsSlider";
import AboutElectraHtmlSection from "@/components/home/AboutElectraHtmlSection";
import OurStoresSection from "@/components/home/OurStoresSection";
import CorporateCornerSection from "@/components/home/CorporateCornerSection";
import CustomerStoriesSection from "@/components/home/CustomerStoriesSection";
import HearFromYouForm from "@/components/home/HearFromYouForm";
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
    seeMoreHref: "/category/air-conditionar",
  },
  {
    categoryId: 2,
    categoryName: "Refrigerator",
    categorySlug: "refrigerator",
    title: "Refrigerator Products",
    subtitle: "",
    seeMoreHref: "/category/refrigerator",
  },
  {
    categoryId: 3,
    categoryName: "Washing Machine",
    categorySlug: "washing-machine",
    title: "Washing Machine Products",
    subtitle: "",
    seeMoreHref: "/category/washing-machine",
  },
  {
    categoryId: 4,
    categoryName: "Microwave",
    categorySlug: "microwave",
    title: "Microwave Products",
    subtitle: "",
    seeMoreHref: "/category/microwave-oven",
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
  await getHomepageCategorySections();

  return (
    <div className="">
      <HeroSection />
      <div className="bg-[#EDF2FB]">
  <HomeSliderTwo />
      </div>
    
      <section className=" mx-auto  ">
        {/* <div className="mt-5">
          <ServiceHighlights />
        </div> */}
        <div className="lg:mt-14 mt-5 ">
          <OurBrands />
        </div>
         <div className="lg:mt-14 mt-5">
          <SingleWideBanner />
        </div>
        <div className="lg:mt-14 mt-5">
          <ExclusiveDeals />
        </div>
        <div className="lg:mt-10 mt-5">
          <StoreBanner />
        </div>
        <div className="lg:mt-14 mt-5 w-9/12 mx-auto">
          <HomepageTabsSlider />
        </div>
        <div className="lg:mt-14 mt-5">
          <DualPromoBanners />
        </div>
      
        {/* <div className="lg:mt-14 mt-5">
          <ShopByCategory />
        </div> */}
        
        {/* <div className="lg:mt-14 mt-5">
          <PopularProducts />
        </div> */}
        
        {/* <div className="lg:mt-14 mt-5">
          <BestSellingProducts />
        </div> */}
        
        {/* <div className="lg:mt-14 mt-5">
          <FlashDeals />
        </div> */}

        {/* {primarySections.map((section) => (
          <div className="lg:mt-14 mt-5" key={`${section.categoryId}-${section.categorySlug}`}>
            <CategoryWiseProducts
              title={section.title}
              subtitle={section.subtitle}
              categorySlug={section.categorySlug}
              seeMoreHref={section.seeMoreHref}
            />
          </div>
        ))} */}

       

        {/* {secondarySections.map((section) => (
          <div className="lg:mt-14 mt-5" key={`${section.categoryId}-${section.categorySlug}`}>
            <CategoryWiseProducts
              title={section.title}
              subtitle={section.subtitle}
              categorySlug={section.categorySlug}
              seeMoreHref={section.seeMoreHref}
            />
          </div>
        ))} */}

        {/* <div className="lg:mt-14 mt-5">
          <Newsletter />
        </div>
        <div className="lg:mt-14 mt-5">
          <SpecialDeals />
        </div> */}
        <div className="lg:mt-14 mt-5">
          <AboutElectraHtmlSection />
        </div>

        <div className="lg:mt-0 mt-5">
          <OurStoresSection />
        </div>

        {/* Combined Media & Testimonials Section with continuous background gradient */}
        <div className="w-full bg-gradient-to-tr from-[#854da5] via-[#fffefe] to-[#cec3ff]">
          <CorporateCornerSection />
          <CustomerStoriesSection />
          <HearFromYouForm />
        </div>


      </section>
    </div>
  );
}

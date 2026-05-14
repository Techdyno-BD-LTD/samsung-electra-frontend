import HeroBanner from "./components/HeroBanner";
import ExchangeBreadcrumb from "./components/ExchangeBreadcrumb";
import InfoPanelsSection from "./components/InfoPanelsSection";
import ShowroomCtaSection from "./components/ShowroomCtaSection";
import FaqSection from "./components/FaqSection";
import Link from "next/link";
import { Metadata } from 'next';
import { getGlobalSettings } from "@/lib/metadata";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    const systemKey = process.env.API_SYSTEM_KEY || '';
    
    try {
        const [pageRes, settings] = await Promise.all([
            fetch(`${baseUrl}/api/v2/pages/exchange-products`, {
                headers: { 'x-system-key': systemKey },
                next: { revalidate: 3600 }
            }),
            getGlobalSettings()
        ]);
        const json = await pageRes.json();
        const page = json.data?.[0];

        const findSetting = (type: string) => settings.find((s: any) => s.type === type)?.value;
        const globalMetaImage = findSetting("meta_image");
        const siteTitle = findSetting("meta_title") || "Samsung Electra";

        const title = page?.meta_title || "Exchange Products";
        const description = page?.meta_description || `Exchange your old appliances for new Samsung products at ${siteTitle}.`;
        const image = page?.meta_image || globalMetaImage || "/og/default.png";
        const fullTitle = `${title} | ${siteTitle}`;

        return {
            title: fullTitle,
            description: description,
            openGraph: {
                title: fullTitle,
                description: description,
                images: [image],
            },
            twitter: {
                card: "summary_large_image",
                title: fullTitle,
                description: description,
                images: [image],
            }
        };
    } catch (e) {
        return { title: "Exchange Products | Samsung Electra" };
    }
}

async function getExchangeProductsPageData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/pages/exchange-products`, { cache: 'no-store' });
    if (!res.ok) return null;
    const result = await res.json();
    const page = result.data?.[0];
    if (!page || !page.content) return null;
    return JSON.parse(page.content);
  } catch (e) {
    console.error('Error fetching exchange-products data:', e);
    return null;
  }
}

export default async function ExchangeProductsPage() {
  const data = await getExchangeProductsPageData();

  if (!data) {
    return (
      <div className="flex flex-col gap-6 pb-12 mt-20 px-4 max-w-7xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-slate-800">Page Content Not Available</h1>
        <p className="text-slate-500">Please check back later or contact support.</p>
        <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 lg:space-y-16">
      {data.hero && <HeroBanner image={data.hero.image} alt={data.hero.alt} />}

      {data.breadcrumb && (
        <ExchangeBreadcrumb home={data.breadcrumb.home} current={data.breadcrumb.current} />
      )}

      {(data.benefits || data.requirements) && (
        <InfoPanelsSection benefits={data.benefits} requirements={data.requirements} />
      )}
      {data.showroomCta && (
        <ShowroomCtaSection
          title={data.showroomCta.title}
          description={data.showroomCta.description}
          buttonLabel={data.showroomCta.buttonLabel}
          buttonHref={data.showroomCta.buttonHref}
        />
      )}

      {data.faq && <FaqSection faq={data.faq} />}


    </div>
  );
}

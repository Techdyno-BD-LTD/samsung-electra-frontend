import HeroBanner from "./components/HeroBanner";
import HigherSaleBreadcrumb from "./components/HigherSaleBreadcrumb";
import InfoPanelsSection from "./components/InfoPanelsSection";
import KistiStepsSection from "./components/KistiStepsSection";
import ShowroomCtaSection from "./components/ShowroomCtaSection";
import TermsSection from "./components/TermsSection";
import FaqSection from "./components/FaqSection";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getHigherSaleData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/pages/higher-sale`, { cache: 'no-store' });
    if (!res.ok) return null;
    const result = await res.json();
    const page = result.data?.[0];
    if (!page || !page.content) return null;
    return JSON.parse(page.content);
  } catch (e) {
    console.error('Error fetching higher-sale data:', e);
    return null;
  }
}

export default async function HigherSalePage() {
  const data = await getHigherSaleData();

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
        <HigherSaleBreadcrumb home={data.breadcrumb.home} current={data.breadcrumb.current} />
      )}

      {(data.benefits || data.requirements) && (
        <InfoPanelsSection benefits={data.benefits} requirements={data.requirements} />
      )}

      {data.purchaseSteps && (
        <KistiStepsSection title={data.purchaseSteps.title} steps={data.purchaseSteps.steps} />
      )}

      {data.terms && <TermsSection terms={data.terms} />}

      {data.faq && <FaqSection faq={data.faq} />}

      {data.showroomCta && (
        <ShowroomCtaSection
          title={data.showroomCta.title}
          description={data.showroomCta.description}
          buttonLabel={data.showroomCta.buttonLabel}
          buttonHref={data.showroomCta.buttonHref}
        />
      )}
    </div>
  );
}

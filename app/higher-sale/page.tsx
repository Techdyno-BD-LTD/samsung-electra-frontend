import higherSaleData from "@/database/highersale.json";
import HeroBanner from "./_components/HeroBanner";
import HigherSaleBreadcrumb from "./_components/HigherSaleBreadcrumb";
import InfoPanelsSection from "./_components/InfoPanelsSection";
import KistiStepsSection from "./_components/KistiStepsSection";
import ShowroomCtaSection from "./_components/ShowroomCtaSection";

export default function HigherSalePage() {
  return (
    <main className="mt-20 pb-10 sm:mt-24 sm:pb-14 lg:mt-16">
      <HeroBanner image={higherSaleData.hero.image} alt={higherSaleData.hero.alt} />

      <HigherSaleBreadcrumb home={higherSaleData.breadcrumb.home} current={higherSaleData.breadcrumb.current} />

      <InfoPanelsSection benefits={higherSaleData.benefits} requirements={higherSaleData.requirements} />

      <KistiStepsSection title={higherSaleData.purchaseSteps.title} steps={higherSaleData.purchaseSteps.steps} />

      <ShowroomCtaSection
        title={higherSaleData.showroomCta.title}
        description={higherSaleData.showroomCta.description}
        buttonLabel={higherSaleData.showroomCta.buttonLabel}
        buttonHref={higherSaleData.showroomCta.buttonHref}
      />
    </main>
  );
}

import ServiceHoursHero from "./components/ServiceHoursHero";
import HoursPanel from "./components/HoursPanel";
import AfterSalesPanel from "./components/AfterSalesPanel";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getServiceHoursData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/pages/service-hours`, { cache: 'no-store' });
    if (!res.ok) return null;
    const result = await res.json();
    const page = result.data?.[0];
    if (!page || !page.content) return null;
    return JSON.parse(page.content);
  } catch (e) {
    console.error('Error fetching service-hours data:', e);
    return null;
  }
}

export default async function ServiceHoursPage() {
  const data = await getServiceHoursData();

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
    <div className="pb-20 space-y-10 lg:space-y-1">
      <ServiceHoursHero
        title={data.hero?.title || 'Service Hours'}
        subtitle={data.hero?.subtitle}
      />

      <div className="mainwidth mx-auto px-4 space-y-4">
        {data.intro && (
          <p className="text-center text-slate-700 text-lg max-w-3xl mx-auto font-medium">
            {data.intro}
          </p>
        )}

        {data.hoursPanel && <HoursPanel data={data.hoursPanel} />}

        {data.afterSales && <AfterSalesPanel data={data.afterSales} />}
      </div>
    </div>
  );
}

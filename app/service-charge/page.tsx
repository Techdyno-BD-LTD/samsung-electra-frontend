import ChargeContainer from "./components/ChargeContainer";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getServiceChargeData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/pages/service-charge`, { cache: 'no-store' });
    if (!res.ok) return null;
    const result = await res.json();
    const page = result.data?.[0];
    if (!page || !page.content) return null;
    return JSON.parse(page.content);
  } catch (e) {
    console.error('Error fetching service-charge data:', e);
    return null;
  }
}

export default async function ServiceChargePage() {
  const data = await getServiceChargeData();

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
    <div className="pb-20">
      <div className="mainwidth mx-auto px-4 py-12 lg:py-16">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <a href="/" className="hover:text-blue-600">Home</a>
          <span>&gt;</span>
          <span className="text-slate-900 font-medium">Shop</span>
        </nav>

        <h1 className="text-3xl font-bold text-slate-900 mb-10">
          {data.title || 'Service Charges'}
        </h1>

        <ChargeContainer 
          initialRows={data.table || []} 
          searchPlaceholder={data.searchPlaceholder} 
        />
      </div>
    </div>
  );
}

import PaymentTabs from "./_components/PaymentTabs";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getServicePaymentData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/pages/service-payment`, { cache: 'no-store' });
    if (!res.ok) return null;
    const result = await res.json();
    const page = result.data?.[0];
    if (!page || !page.content) return null;
    return JSON.parse(page.content);
  } catch (e) {
    console.error('Error fetching service-payment data:', e);
    return null;
  }
}

export default async function ServicePaymentPage() {
  const data = await getServicePaymentData();

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
      <div className="bg-[#F4F4F4] py-8 lg:py-10 mb-10">
        <div className="mainwidth mx-auto px-4 text-center">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <a href="/" className="hover:text-blue-600">Home</a>
            <span>&gt;</span>
            <span className="text-slate-900 font-medium">Shop</span>
          </nav>
          
          <h1 className="text-2xl font-semibold text-black">
            {data.title || 'Service payment'}
          </h1>
        </div>
      </div>

      <div className="mainwidth mx-auto px-4">
        {data.brands && <PaymentTabs brands={data.brands} />}
      </div>
    </div>
  );
}

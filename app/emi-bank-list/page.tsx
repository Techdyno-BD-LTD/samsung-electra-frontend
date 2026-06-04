import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { FaChevronRight } from "react-icons/fa";
import { getGlobalSettings } from "@/lib/metadata";
import FaqAccordion from "./FaqAccordion";
import BankGrid from "./BankGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.API_BASE_URL || "http://localhost:5000";
  const systemKey = process.env.API_SYSTEM_KEY || "";

  try {
    const [pageRes, settings] = await Promise.all([
      fetch(`${baseUrl}/api/v2/pages/emi-bank-list`, {
        headers: { "x-system-key": systemKey },
        next: { revalidate: 3600 },
      }),
      getGlobalSettings(),
    ]);

    const json = await pageRes.json();
    const page = json.data?.[0];

    const findSetting = (type: string) => settings.find((s: any) => s.type === type)?.value;
    const globalMetaImage = findSetting("meta_image");
    const siteTitle = findSetting("meta_title") || "Samsung Electra";

    const title = page?.meta_title || "EMI Bank List & Rates";
    const description = page?.meta_description || "Check available credit card EMI rates and tenure parameters for all partner banks of SSL COMMERZ.";
    const image = page?.meta_image || globalMetaImage || "/og/default.png";
    const fullTitle = `${title} | ${siteTitle}`;

    return {
      title: fullTitle,
      description,
      openGraph: {
        title: fullTitle,
        description,
        images: [image],
      },
      twitter: {
        card: "summary_large_image",
        title: fullTitle,
        description,
        images: [image],
      },
    };
  } catch (e) {
    return { title: "EMI Bank List & Rates | Samsung Electra" };
  }
}

async function getPageData() {
  const baseUrl = process.env.API_BASE_URL || "http://localhost:5000";
  const systemKey = process.env.API_SYSTEM_KEY || "";
  try {
    const res = await fetch(`${baseUrl}/api/v2/pages/emi-bank-list`, {
      headers: { "x-system-key": systemKey },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const result = await res.json();
    const page = result.data?.[0];
    if (!page || !page.content) return null;
    return JSON.parse(page.content);
  } catch (e) {
    console.error("Error fetching emi-bank-list page data:", e);
    return null;
  }
}

async function getEmiBanks() {
  const baseUrl = process.env.API_BASE_URL || "http://localhost:5000";
  const systemKey = process.env.API_SYSTEM_KEY || "";
  try {
    const res = await fetch(`${baseUrl}/api/v2/emi-banks`, {
      headers: { "x-system-key": systemKey },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const result = await res.json();
    return result.data || [];
  } catch (e) {
    console.error("Error fetching emi banks:", e);
    return [];
  }
}

export default async function EmiBankListPage() {
  const data = await getPageData();
  const banks = await getEmiBanks();

  if (!data) {
    return (
      <div className="flex flex-col gap-6 pb-12 mt-20 px-4 max-w-7xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-slate-800">Page Content Not Available</h1>
        <p className="text-slate-500">Please check back later or contact support.</p>
        <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
      </div>
    );
  }

  const breadcrumbHome = data.breadcrumb?.home || "Home";
  const breadcrumbCurrent = data.breadcrumb?.current || "EMI Bank List";

  return (
    <div className=" mx-auto py-2 md:py-4 space-y-6 mt-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-[11px] md:text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          {breadcrumbHome}
        </Link>
        <FaChevronRight className="w-2 h-2 text-slate-400" />
        <span className="text-slate-800 font-semibold">{breadcrumbCurrent}</span>
      </nav>

      {/* Full Width Gray Title Block */}
      <div className="w-full bg-[#F4F5F6] border border-slate-200/50 rounded-md py-4 text-center">
        <h1 className="text-base md:text-lg font-bold text-slate-800 tracking-wide">
          {data.emi?.title || "Find the Best Bank EMI Rates SSL COMMERZ"}
        </h1>
      </div>

      {/* Dynamic Hero Banner (Only renders if uploaded and exists) */}
      {data.hero && data.hero.image && (
        <section className="w-full">
          <div className="relative aspect-[1200/300] md:aspect-[1840/400] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
            <Image
              src={data.hero.image}
              alt={data.hero.alt || "EMI Bank List Banner"}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </section>
      )}

      {/* Description & Policies */}
      <div className="space-y-4 max-w-6xl text-left">
        {data.emi?.description && (
          <div
            className="text-[13px] md:text-[14px] text-slate-700 leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: data.emi.description }}
          />
        )}

        {data.policies && data.policies.length > 0 && (
          <ul className="list-disc pl-5 space-y-2 mt-3 text-[13px] md:text-[14px] text-slate-700 font-normal">
            {data.policies.map((policy: string, idx: number) => (
              <li key={idx} className="leading-relaxed">
                {policy}
              </li>
            ))}
          </ul>
        )}

        {data.contactText && (
          <p className="text-[13px] md:text-[14px] text-slate-800 font-bold mt-4">
            {data.contactText}
          </p>
        )}
      </div>

      {/* Paginated Grid of Bank Cards */}
      <div className="pt-6">
        {banks.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-sm">
            No partner banks configured. Please update emi banks in backend admin panel.
          </div>
        ) : (
          <BankGrid banks={banks} />
        )}
      </div>

      {/* Expandable FAQs Section */}
      {data.faq && data.faq.items && data.faq.items.length > 0 && (
        <FaqAccordion title={data.faq.title} items={data.faq.items} />
      )}
    </div>
  );
}

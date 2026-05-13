import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRouteMetadata } from "@/lib/metadata";
import { fetchLegalPage, fetchLegalPageSlugs } from "@/lib/legalPages"; 

type LegalPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await fetchLegalPageSlugs();
  if (!Array.isArray(slugs)) return [];
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchLegalPage(slug);

  if (!page) {
    return getRouteMetadata("root", {
      title: "Page Not Found | Electra",
      description: "The requested legal page could not be found.",
    });
  }

  return getRouteMetadata("root", {
    title: `${page.meta_title || page.title} | Electra International`,
    description: page.meta_description || page.description,
  });
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const page = await fetchLegalPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <section className="mx-auto w-full mt-16 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      <article className="w-full bg-white">
        <header className="mb-4 space-y-3">
          <h1 className="text-[28px] font-semibold leading-tight text-slate-900 sm:text-[30px]">{page.title}</h1>
          <p className="max-w-[1200px] text-[14px] leading-6 text-slate-700 sm:text-[15px]">
            {page.description}
          </p>
          {page.lastUpdated ? <p className="text-[12px] text-slate-500">Last updated: {page.lastUpdated}</p> : null}
        </header>

        <div
          className="max-w-[1200px] space-y-4 text-[14px] leading-6 text-slate-800 sm:text-[15px] [&_h2]:mt-5 [&_h2]:text-[16px] [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-slate-900 [&_p]:mt-0 [&_p]:mb-1 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      </article>
    </section>
  );
}
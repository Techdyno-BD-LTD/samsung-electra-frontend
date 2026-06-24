import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getGlobalSettings } from '@/lib/metadata';
import InstallationContainer from './components/InstallationContainer';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';

  try {
    const [pageRes, settings] = await Promise.all([
      fetch(`${baseUrl}/api/v2/pages/product-installation`, {
        headers: { 'x-system-key': systemKey },
        next: { revalidate: 3600 }
      }).catch(() => null),
      getGlobalSettings().catch(() => [])
    ]);

    const json = pageRes ? await pageRes.json() : null;
    const page = json?.data?.[0];

    const findSetting = (type: string) => settings?.find((s: any) => s.type === type)?.value;
    const globalMetaImage = findSetting('meta_image');
    const siteTitle = findSetting('meta_title') || 'Samsung Electra';

    const title = page?.meta_title || 'Product Installation';
    const description = page?.meta_description || 'Product Installation guidelines by category and brand.';
    const image = page?.meta_image || globalMetaImage || '/og/default.png';

    return {
      title: `${title} | ${siteTitle}`,
      description: description,
      openGraph: {
        title: `${title} | ${siteTitle}`,
        description: description,
        images: [image],
      }
    };
  } catch (e) {
    return { title: 'Product Installation | Samsung Electra' };
  }
}

async function getInstallationData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/pages/product-installation`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      console.error('Failed to fetch product-installation page from local API proxy:', res.status);
      return { title: 'Product Installation', subtitle: '', categories: [] };
    }
    const result = await res.json();
    const page = result.data?.[0];
    if (!page || !page.content) {
      return { title: 'Product Installation', subtitle: '', categories: [] };
    }
    return JSON.parse(page.content);
  } catch (e) {
    console.error('Error fetching installation data from local proxy:', e);
    return { title: 'Product Installation', subtitle: '', categories: [] };
  }
}

export default async function ProductInstallationPage() {
  const data = await getInstallationData();

  return (
    <div className="pb-20">
      <div className="mainwidth mx-auto py-12 lg:py-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span className="text-slate-300">&gt;</span>
          <span className="text-slate-900 font-medium">Product Installation</span>
        </nav>

        {/* Page Header */}
        <div className=" mx-auto mb-12">
          <h1 className="text-4xl text-center font-semibold text-slate-900 tracking-tight mb-4">
            {data.title || 'Product Installation'}
          </h1>
          {data.subtitle && (
            <p className="text-lg text-slate-600 leading-relaxed text-center font-medium">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Category & Brand content container */}
        <InstallationContainer categories={data.categories || []} />
      </div>
    </div>
  );
}

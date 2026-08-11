import { Metadata } from "next";
import { notFound } from "next/navigation";
import BiddingProductDetailsClient from "./BiddingProductDetailsClient";
import { ProductData } from "@/components/productdetails/ProductDetailsClient";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { slug: string };
}

async function getProductData(slug: string): Promise<ProductData | null> {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';

  try {
    const res = await fetch(`${baseUrl}/api/v2/auction/products/${slug}`, {
      headers: {
        'x-system-key': systemKey,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (json.success && json.data && json.data.length > 0) {
      return json.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching auction product details for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductData(params.slug);

  if (!product) {
    return {
      title: "Auction Product Not Found | Samsung Electra",
      description: "The requested bidding product could not be found.",
    };
  }

  const siteTitle = "Samsung Electra";
  const title = product.meta_title as string || product.name || "Auction Details";
  const description = product.meta_description as string || `Bid on ${product.name} at Samsung Electra.`;
  const image = product.meta_img as string || product.thumbnail_image || "/og-image.png";

  return {
    title: `${title} | Live Auction | ${siteTitle}`,
    description: description,
    openGraph: {
      title: `${title} | Live Auction | ${siteTitle}`,
      description: description,
      images: [image],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Live Auction | ${siteTitle}`,
      description: description,
      images: [image],
    },
  };
}

export default async function BiddingProductPage({ params }: PageProps) {
  const product = await getProductData(params.slug);

  if (!product) {
    notFound();
  }

  const rawPrice = product.main_price ? String(product.main_price).replace(/[^\d.]/g, '') : '0';
  const numericPrice = parseFloat(rawPrice) || 0;

  let photosArray: unknown[] = [];
  const rawPhotos = product.photos as unknown;
  if (Array.isArray(rawPhotos)) {
    photosArray = rawPhotos;
  } else if (typeof rawPhotos === 'string') {
    try {
      const parsed = JSON.parse(rawPhotos);
      if (Array.isArray(parsed)) {
        photosArray = parsed;
      } else {
        photosArray = [rawPhotos];
      }
    } catch {
      photosArray = rawPhotos.includes(',') ? rawPhotos.split(',') : [rawPhotos];
    }
  }

  const images = [
    product.thumbnail_image,
    ...photosArray.map((p) => {
      if (typeof p === 'string') return p;
      if (p && typeof p === 'object') {
        const obj = p as { photo?: string; path?: string };
        return obj.photo || obj.path;
      }
      return null;
    })
  ].filter(Boolean) as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": images.length > 0 ? images : [product.thumbnail_image || "/og-image.png"],
    "description": product.description ? product.description.replace(/<[^>]*>/g, '').substring(0, 300) : product.name,
    "sku": product.model_number || product.variants?.[0]?.sku || String(product.id),
    "mpn": product.model_number || String(product.id),
    "brand": {
      "@type": "Brand",
      "name": product.brand?.name || "Samsung"
    },
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/bidding/${product.slug}`,
      "priceCurrency": "BDT",
      "price": numericPrice,
      "priceValidUntil": new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": (product.current_stock && product.current_stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BiddingProductDetailsClient initialData={product} slug={params.slug} />
    </>
  );
}

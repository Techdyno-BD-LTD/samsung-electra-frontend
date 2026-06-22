import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailsClient, { ProductData } from "@/components/productdetails/ProductDetailsClient";

interface PageProps {
  params: { slug: string };
}

async function getProductData(slug: string): Promise<ProductData | null> {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';

  try {
    const res = await fetch(`${baseUrl}/api/v2/products/${slug}`, {
      headers: {
        'x-system-key': systemKey,
      },
      cache: 'no-store', // Ensure we get fresh data for metadata
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (json.success && json.data && json.data.length > 0) {
      return json.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching product for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductData(params.slug);

  if (!product) {
    return {
      title: "Product Not Found | Samsung Electra",
      description: "The requested product could not be found.",
    };
  }

  const siteTitle = "Samsung Electra";
  const title = product.meta_title as string || product.name || "Product Details";
  const description = product.meta_description as string || `Buy ${product.name} at the best price from ${siteTitle}.`;
  const image = product.meta_img as string || product.thumbnail_image || "/og-image.png";

  return {
    title: `${title} | ${siteTitle}`,
    description: description,
    openGraph: {
      title: `${title} | ${siteTitle}`,
      description: description,
      images: [image],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteTitle}`,
      description: description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductData(params.slug);

  if (!product) {
    notFound();
  }

  // Parse price safely
  const rawPrice = product.main_price ? String(product.main_price).replace(/[^\d.]/g, '') : '0';
  const numericPrice = parseFloat(rawPrice) || 0;

  // Build images array
  const images = [
    product.thumbnail_image,
    ...(product.photos || []).map(p => p.photo || p.path)
  ].filter(Boolean) as string[];

  // Construct structured data
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
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${product.slug}`,
      "priceCurrency": "BDT",
      "price": numericPrice,
      "priceValidUntil": new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0], // Dec 31 of next year
      "itemCondition": "https://schema.org/NewCondition",
      "availability": (product.current_stock && product.current_stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock"
    },
    ...(product.rating_count && product.rating_count > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating || 5,
        "reviewCount": product.rating_count,
        "bestRating": "5",
        "worstRating": "1"
      }
    } : {})
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailsClient initialData={product} slug={params.slug} />
    </>
  );
}

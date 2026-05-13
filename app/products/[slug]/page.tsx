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

  return <ProductDetailsClient initialData={product} slug={params.slug} />;
}

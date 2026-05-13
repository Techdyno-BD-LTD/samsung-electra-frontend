import { Metadata } from "next";
import { notFound } from "next/navigation";
import OfferDetailsClient, { FlashDealDetail } from "@/components/offers/OfferDetailsClient";

interface PageProps {
  params: { slug: string };
}

async function getOfferData(slug: string): Promise<FlashDealDetail | null> {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';

  try {
    const res = await fetch(`${baseUrl}/api/v2/flash-deals/details/${slug}`, {
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
    console.error("Error fetching offer for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const offer = await getOfferData(params.slug);

  if (!offer) {
    return {
      title: "Offer Not Found | Samsung Electra",
    };
  }

  const siteTitle = "Samsung Electra";
  const title = offer.meta_title || offer.title || "Offer Details";
  const description = offer.meta_description || `Exclusive ${offer.title} offers at ${siteTitle}.`;
  const image = offer.meta_img || offer.banner || "/og-offer.png";

  return {
    title: `${title} | ${siteTitle}`,
    description: description,
    openGraph: {
      title: `${title} | ${siteTitle}`,
      description: description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteTitle}`,
      description: description,
      images: [image],
    },
  };
}

export default async function OfferPage({ params }: PageProps) {
  const offer = await getOfferData(params.slug);

  if (!offer) {
    notFound();
  }

  return <OfferDetailsClient initialData={offer} />;
}

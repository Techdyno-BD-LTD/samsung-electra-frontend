import { Metadata } from "next";
import { notFound } from "next/navigation";
import CampaignDetailsClient, { CampingOfferDetail } from "@/components/campaign/CampaignDetailsClient";

interface PageProps {
  params: { slug: string };
}

async function getCampaignData(slug: string): Promise<CampingOfferDetail | null> {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';

  try {
    const res = await fetch(`${baseUrl}/api/v2/camping-offers/details/${slug}`, {
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
    console.error("Error fetching campaign for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const campaign = await getCampaignData(params.slug);

  if (!campaign) {
    return {
      title: "Campaign Not Found | Samsung Electra",
    };
  }

  const siteTitle = "Samsung Electra";
  // Fallback to title if meta fields are missing in the specific API response
  // Note: If the backend API doesn't return meta_title yet, it will use the campaign title
  const title = campaign.meta_title || campaign.title || "Campaign Details";
  const description = campaign.meta_description || `Check out our ${campaign.title} offers at ${siteTitle}.`;
  const image = campaign.meta_img || campaign.banner || "/og-campaign.png";

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

export default async function CampaignPage({ params }: PageProps) {
  const campaign = await getCampaignData(params.slug);

  if (!campaign) {
    notFound();
  }

  return <CampaignDetailsClient initialData={campaign} />;
}

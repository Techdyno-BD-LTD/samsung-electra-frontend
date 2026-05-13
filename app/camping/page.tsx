"use client";

import React, { useEffect, useState } from "react";
import CampaignOffers from "@/components/campaign/CampaignOffers";

interface CampingOffer {
  id: number;
  title: string;
  slug: string;
  banner: string;
  end_date: number;
}

export default function CampaignPage() {
  const [offers, setOffers] = useState<CampingOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch("/api/v2/camping-offers");
        const json = await res.json();
        if (json.success) {
          setOffers(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch camping offers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
      </div>
    );
  }

  const mappedCampaigns = offers.map((offer) => ({
    id: String(offer.id),
    title: offer.title,
    image: offer.banner,
    alt: offer.title,
    endAt: new Date(offer.end_date * 1000).toISOString(),
    ctaText: "Explore More",
    ctaHref: `/camping/details/${offer.slug}`,
  }));

  return <CampaignOffers pageTitle="Camping Offers" campaigns={mappedCampaigns} />;
}

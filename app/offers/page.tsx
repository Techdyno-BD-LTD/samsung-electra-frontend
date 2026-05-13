"use client";

import React, { useEffect, useState } from "react";
import CampaignOffers from "@/components/campaign/CampaignOffers";

interface FlashDeal {
  id: number;
  title: string;
  slug: string;
  banner: string;
  end_date: number;
}

export default function OffersPage() {
  const [deals, setDeals] = useState<FlashDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch("/api/v2/flash-deals");
        const json = await res.json();
        if (json.success) {
          setDeals(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch flash deals:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
      </div>
    );
  }

  const mappedCampaigns = deals.map((deal) => ({
    id: String(deal.id),
    title: deal.title,
    image: deal.banner,
    alt: deal.title,
    endAt: new Date(deal.end_date * 1000).toISOString(),
    ctaText: "Explore More",
    ctaHref: `/offers/details/${deal.slug}`,
  }));

  return <CampaignOffers pageTitle="Flash Deals" campaigns={mappedCampaigns} />;
}

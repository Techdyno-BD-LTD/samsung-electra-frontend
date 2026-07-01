"use client";

import React, { useEffect, useState } from "react";
import CampaignOffers from "@/components/campaign/CampaignOffers";
import Skeleton from "@/components/common/Skeleton";

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
      <div className="mx-auto max-w-[1440px] px-4 py-16 space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-16 w-1/3 rounded-2xl" />
        <div className="space-y-12">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-6">
              <Skeleton className="aspect-[3/1] lg:aspect-[4/1] w-full rounded-[2rem]" />
              <div className="space-y-3 px-4">
                <Skeleton className="h-4 w-1/4 rounded-lg" />
                <Skeleton className="h-3 w-1/6 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
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

  return <CampaignOffers pageTitle="Flash Deals" campaigns={mappedCampaigns} breadcrumb="Offers" />;
}

"use client";

import React, { useEffect, useState } from "react";
import CampaignOffers from "@/components/campaign/CampaignOffers";
import Skeleton from "@/components/common/Skeleton";

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

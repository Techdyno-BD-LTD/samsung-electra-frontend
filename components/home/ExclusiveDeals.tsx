"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";

type ExclusiveDeal = {
  id: number;
  title: string;
  subtitle: string | null;
  slug: string;
  exclusive_banner: string;
};

export default function ExclusiveDeals() {
  const [deals, setDeals] = useState<ExclusiveDeal[]>([]);
  const [title, setTitle] = useState("Exclusive Deals");
  const [subtitle, setSubtitle] = useState("Shop Today's Exclusive Deals products at special pricing");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchExclusiveDeals() {
      try {
        const res = await fetch("/api/exclusive-deals");
        if (!res.ok) return;
        const payload = await res.json();
        if (isMounted && payload?.success) {
          setDeals(payload.data || []);
          setTitle(payload.title || "Exclusive Deals");
          setSubtitle(payload.subtitle || "Shop Today's Exclusive Deals products at special pricing");
        }
      } catch (error) {
        console.error("Error fetching exclusive deals:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchExclusiveDeals();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[1700px] mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  // Only show if at least one active deal exists
  if (deals.length === 0) return null;

  return (
    <section className="w-full lg:pt-8 pb-0 select-none">
      {/* Title & Subtitle */}
      <div className="text-center mb-4 lg:mb-12 px-4">
        <h2 className="text-xl md:text-[48px] lg:text-[30px] font-bold text-gray-900 tracking-tight lg:mb-4">
          {title}
        </h2>
        <p className="text-sm md:text-[20px] lg:text-[18px] text-gray-500 mt-2 max-w-[800px] mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Grid of Banners (max 2 side-by-side) */}
     <div className="grid grid-cols-2 md:grid-cols-2 gap-2 lg:gap-6 w-full">
  {deals.slice(0, 2).map((deal, index) => (
    <Link
      key={deal.id}
      href={`/offers/details/${deal.slug}`}
      className={`relative block w-full aspect-[950/700] overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.005] transition-all duration-300 bg-gray-50 ${
        index === 0 ? "rounded-r-3xl" : "rounded-l-3xl"
      }`}
    >
      <Image
        src={deal.exclusive_banner || "/assets/img/placeholder.jpg"}
        alt={deal.title}
        fill
        sizes="(max-width: 768px) 100vw, 850px"
        className="object-contain"
        priority
      />
    </Link>
  ))}
</div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import CampaignProductGrid from "@/components/campaign/CampaignProductGrid";
import { ProductData as Product } from "@/components/common/AddToCartModal";

export interface CampingOfferDetail {
  id: number;
  title: string;
  banner: string;
  banner_title: string;
  banner_subtitle_top: string;
  banner_subtitle_bottom: string;
  meta_title?: string;
  meta_description?: string;
  meta_img?: string;
  products: {
    product_id: number;
    discount: number;
    discount_type: string;
    product: Product;
  }[];
}

interface CampaignDetailsClientProps {
  initialData: CampingOfferDetail;
}

export default function CampaignDetailsClient({ initialData }: CampaignDetailsClientProps) {
  const [detail] = useState<CampingOfferDetail>(initialData);

  return (
    <main className="mt-16 pb-20 sm:mt-24">
      {/* Hero Banner */}
      <section className="relative h-[250px] w-full overflow-hidden sm:h-[400px] md:h-[500px]">
        <Image
          src={detail.banner}
          alt={detail.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          {detail.banner_subtitle_top && (
            <p className="mb-2 text-sm font-medium uppercase tracking-widest sm:text-lg">
              {detail.banner_subtitle_top}
            </p>
          )}
          <h1 className="mb-4 text-3xl font-bold sm:text-5xl md:text-6xl">
            {detail.banner_title || detail.title}
          </h1>
          {detail.banner_subtitle_bottom && (
            <p className="max-w-2xl text-base font-light sm:text-xl">
              {detail.banner_subtitle_bottom}
            </p>
          )}
        </div>
      </section>

      {/* Product Grid */}
      <div className="mainwidth mx-auto mt-10 ">
        <CampaignProductGrid
          products={detail.products.map(p => p.product)}
        />
      </div>
    </main>
  );
}

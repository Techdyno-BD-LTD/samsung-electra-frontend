"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function StoreBanner() {
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const response = await fetch("/api/homepage/bottom-banner");
        const json = await response.json();
        if (json.success && json.data?.[0]?.image) {
          setBanner(json.data[0].image);
        }
      } catch (error) {
        console.error("Failed to fetch store banner:", error);
      }
    }
    fetchBanner();
  }, []);

  if (!banner) return null;

  return (
    <div className="w-full overflow-hidden rounded-xl">
      <div className="relative aspect-[1840/130] w-full sm:aspect-[1840/141]">
        <Image
          src={banner}
          alt="Store Banner"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}

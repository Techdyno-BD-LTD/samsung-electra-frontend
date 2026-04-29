"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type BannerItem = {
  id: number;
  image: string;
  file_name: string;
  link: string | null;
  external_link: string | null;
};

type BannersResponse = {
  data: {
    bannersOne: BannerItem[];
    bannersTwo: BannerItem[];
    bannersThree: BannerItem[];
  };
};

export default function SingleWideBanner() {
  const [item, setItem] = useState<BannerItem | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBanner() {
      try {
        const response = await fetch("/api/homepage/banners", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as BannersResponse;
        if (isMounted) {
          setItem(payload.data?.bannersTwo?.[0] ?? null);
        }
      } catch {
        if (isMounted) setItem(null);
      }
    }

    loadBanner();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!item) return null;

  const href = item.link || item.external_link || "#";
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <section className="w-full">
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="relative block w-full overflow-hidden rounded-2xl aspect-[1840/400]"
      >
        <Image
          src={item.image}
          alt="Promotional wide banner"
          fill
          sizes="(max-width: 1536px) 100vw, 1840px"
          className="object-contain"
          priority
        />
      </a>
    </section>
  );
}

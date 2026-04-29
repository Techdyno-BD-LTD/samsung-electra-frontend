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

export default function DualPromoBanners() {
  const [items, setItems] = useState<BannerItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadBanners() {
      try {
        const response = await fetch("/api/homepage/banners", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as BannersResponse;
        if (isMounted) {
          setItems(payload.data?.bannersOne ?? []);
        }
      } catch {
        if (isMounted) setItems([]);
      }
    }

    loadBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  const rendered = items.slice(0, 2);

  if (!rendered.length) return null;

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        {rendered.map((item, index) => {
          const href = item.link || item.external_link || "#";
          const isExternal = /^https?:\/\//i.test(href);

          return (
            <a
              key={item.id}
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={`relative w-full overflow-hidden rounded-2xl aspect-[910/318] ${index === 1 ? "hidden lg:block" : ""}`}
            >
              <Image
                src={item.image}
                alt={`Promotional banner ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 910px"
                className="object-contain"
                priority
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}

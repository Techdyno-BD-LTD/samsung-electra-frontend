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
    <section className="w-full lg:py-6 select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-6">
        {rendered.map((item, index) => {
          const href = item.link || item.external_link || "#";
          const isExternal = /^https?:\/\//i.test(href);

          return (
            <div
              key={item.id}
              className="relative w-full overflow-hidden  aspect-[940/600] group"
            >
              {/* Main Banner Image with object-contain */}
              <Image
                src={item.image}
                alt={`Promotional banner ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 940px"
                className="object-contain w-full h-full"
                priority
              />

              {/* Bottom Right "See All" Action Link */}
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="absolute right-2 bottom-2 lg:right-6 lg:bottom-6 z-10 lgpx-6 lg:py-2 py-1 px-4 text-sm font-semibold tracking-wide rounded-lg transition-all duration-300 transform active:scale-95 bg-transparent border border-white text-white hover:bg-white hover:text-black"
              >
                See All
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

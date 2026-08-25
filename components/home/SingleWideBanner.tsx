"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type BannerItem = {
  id: number;
  image: string;
  file_name: string;
  link: string | null;
  external_link: string | null;
  is_mobile?: boolean;
};

type BannersResponse = {
  data: {
    bannersOne: BannerItem[];
    bannersTwo: BannerItem[];
    bannersThree: BannerItem[];
  };
};

export default function SingleWideBanner() {
  const [pcItem, setPcItem] = useState<BannerItem | null>(null);
  const [mobileItem, setMobileItem] = useState<BannerItem | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBanner() {
      try {
        const response = await fetch("/api/homepage/banners", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as BannersResponse;
        if (isMounted) {
          const list = payload.data?.bannersTwo ?? [];
          const pc = list.find((item) => !item.is_mobile) ?? list[0] ?? null;
          const mob = list.find((item) => !!item.is_mobile) ?? pc;
          setPcItem(pc);
          setMobileItem(mob);
        }
      } catch {
        if (isMounted) {
          setPcItem(null);
          setMobileItem(null);
        }
      }
    }

    loadBanner();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!pcItem) return null;

  const pcHref = pcItem.link || pcItem.external_link || "#";
  const pcIsExternal = /^https?:\/\//i.test(pcHref);

  const mobHref = mobileItem ? (mobileItem.link || mobileItem.external_link || "#") : pcHref;
  const mobIsExternal = /^https?:\/\//i.test(mobHref);

  return (
    <section className="w-full">
      {/* Desktop Banner (1920x280) */}
      <a
        href={pcHref}
        target={pcIsExternal ? "_blank" : undefined}
        rel={pcIsExternal ? "noopener noreferrer" : undefined}
        className="hidden lg:block relative w-full aspect-[1920/280]"
      >
        <Image
          src={pcItem.image}
          alt="Promotional wide banner"
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </a>

      {/* Mobile Banner (414x138) */}
      {mobileItem && (
        <a
          href={mobHref}
          target={mobIsExternal ? "_blank" : undefined}
          rel={mobIsExternal ? "noopener noreferrer" : undefined}
          className="lg:hidden block relative w-full aspect-[414/138]"
        >
          <Image
            src={mobileItem.image}
            alt="Promotional wide banner mobile"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </a>
      )}
    </section>
  );
}

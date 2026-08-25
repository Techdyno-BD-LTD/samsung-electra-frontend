"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type BottomBannerIcon = {
  photo: string;
  link: string | null;
};

type BottomBannerItem = {
  image: string | null;
  mobile_image?: string | null;
  mobile_link?: string | null;
  title: string | null;
  subtitle: string | null;
  icons: BottomBannerIcon[];
};

export default function StoreBanner() {
  const [pcBanner, setPcBanner] = useState<string | null>(null);
  const [mobileBanner, setMobileBanner] = useState<string | null>(null);
  const [mobileLink, setMobileLink] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const response = await fetch("/api/homepage/bottom-banner");
        const json = await response.json();
        if (json.success && json.data?.[0]) {
          const item = json.data[0] as BottomBannerItem;
          setPcBanner(item.image);
          setMobileBanner(item.mobile_image || item.image);
          setMobileLink(item.mobile_link || null);
        }
      } catch (error) {
        console.error("Failed to fetch store banner:", error);
      }
    }
    fetchBanner();
  }, []);

  if (!pcBanner) return null;

  return (
    <div className="w-full overflow-hidden select-none">
      {/* Desktop view */}
      <div className="hidden lg:block relative aspect-[1840/141] w-full">
        <Image
          src={pcBanner}
          alt="Store Banner"
          fill
          className="object-fill"
          priority
        />
      </div>

      {/* Mobile view (414x66) */}
      {mobileBanner && (
        <div className="lg:hidden block relative aspect-[414/66] w-full">
          {mobileLink ? (
            <Link href={mobileLink} className="block relative w-full h-full">
              <Image
                src={mobileBanner}
                alt="Store Banner Mobile"
                fill
                className="object-cover object-center"
                priority
              />
            </Link>
          ) : (
            <Image
              src={mobileBanner}
              alt="Store Banner Mobile"
              fill
              className="object-cover object-center"
              priority
            />
          )}
        </div>
      )}
    </div>
  );
}

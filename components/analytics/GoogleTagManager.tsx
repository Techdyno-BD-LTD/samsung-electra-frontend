"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface GoogleTagManagerProps {
  gtmId?: string;
}

function GTMPageViewTracker({ gtmId }: { gtmId?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route changes
  useEffect(() => {
    if (!gtmId || typeof window === "undefined") return;

    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname, searchParams, gtmId]);

  return null;
}

export default function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  const activeGtmId = gtmId || process.env.NEXT_PUBLIC_GTM_ID || "GTM-XXXXXXX";

  return (
    <>
      <Suspense fallback={null}>
        <GTMPageViewTracker gtmId={activeGtmId} />
      </Suspense>

      {/* GTM Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${activeGtmId}');
          `,
        }}
      />
      
      {/* GTM Noscript */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${activeGtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}

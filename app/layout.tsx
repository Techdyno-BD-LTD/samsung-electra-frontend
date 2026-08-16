import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
// import { getRouteMetadata } from "@/lib/metadata";
import StoreProvider from "@/store/StoreProvider";
import AuthInit from "@/components/auth/AuthInit";
import GlobalToast from "@/components/common/GlobalToast";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import PageWrapper from "@/components/layout/PageWrapper";
import FloatingContact from "@/components/common/FloatingContact";

import localFont from "next/font/local";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const samsungSans = localFont({
  src: [
    { path: "../fonts/Samsung-font/SamsungSans-Thin.ttf", weight: "100", style: "normal" },
    { path: "../fonts/Samsung-font/SamsungSans-Light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/Samsung-font/SamsungSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Samsung-font/SamsungSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Samsung-font/SamsungSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-samsung-sans",
});

const samsungSharpSans = localFont({
  src: [
    { path: "../fonts/Samsung Sharp Sans/SamsungSharpSans-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/Samsung Sharp Sans/SamsungSharpSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Samsung Sharp Sans/SamsungSharpSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-samsung-sharp-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;

  let settings: unknown[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/v2/business-settings`, {
      headers: { "x-system-key": systemKey || "" },
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    settings = json.data || [];
  } catch (e) {
    console.error("Failed to fetch business settings for metadata", e);
  }

  const findSetting = (type: string) => (settings as { type: string; value: string }[]).find((s) => s.type === type)?.value;

  const siteTitle = findSetting("meta_title") || "Samsung Electra";
  const siteDescription = findSetting("meta_description") || "Next-gen connected retail operating system for Samsung Bangladesh.";
  const siteImage = findSetting("meta_image") || "/og/default.png";
  const siteIcon = findSetting("site_icon") || "/favicon.ico";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: siteTitle,
    description: siteDescription,
    icons: {
      icon: siteIcon,
    },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      images: [siteImage],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: [siteImage],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.API_BASE_URL;
  const systemKey = process.env.API_SYSTEM_KEY;

  let settings: { type: string; value: string }[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/v2/business-settings`, {
      headers: { "x-system-key": systemKey || "" },
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    settings = json.data || [];
  } catch (e) {
    console.error("Failed to fetch settings in layout", e);
  }

  const gtmId = settings.find((s) => s.type === "google_tag_manager")?.value || "";

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${samsungSans.variable} ${samsungSharpSans.variable} antialiased`}
      >
        <StoreProvider>
          <GoogleTagManager gtmId={gtmId} />
          <AuthInit />
          <GlobalToast />
          <Navbar />
          <main className=" lg:pb-0 pt-2 lg:pt-32 min-h-screen-safe">
            <PageWrapper>
              {children}
            </PageWrapper>
          </main>
          <div id="footer-breadcrumb-target" className="lg:hidden mx-auto mainwidthmore mb-4 px-4"></div>
          <Footer />
          <MobileBottomNav />
          <FloatingContact />
        </StoreProvider>
      </body>
    </html>
  );
}

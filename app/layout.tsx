import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
// import { getRouteMetadata } from "@/lib/metadata";
import StoreProvider from "@/store/StoreProvider";
import AuthInit from "@/components/auth/AuthInit";
import GlobalToast from "@/components/common/GlobalToast";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body
        className={`${openSans.variable} antialiased`}
      >
        <StoreProvider>
          <AuthInit />
          <GlobalToast />
          <Navbar />
          <main className="mainwidth lg:pb-20 pt-2 lg:pt-32 min-h-screen-safe overflow-x-hidden">
            {children}
          </main>
          <div id="footer-breadcrumb-target" className="lg:hidden mx-auto mainwidthmore mb-4 px-4"></div>
          <Footer />
          <MobileBottomNav />
        </StoreProvider>
      </body>
    </html>
  );
}

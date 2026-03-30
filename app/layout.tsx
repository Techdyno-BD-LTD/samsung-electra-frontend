import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { getRouteMetadata } from "@/lib/metadata";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = getRouteMetadata("root");

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
        <Navbar />
        <main className="min-h-screen mainwidth pb-16 pt-8 lg:pt-28  ">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}

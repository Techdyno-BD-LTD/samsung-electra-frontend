"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If we are on the homepage "/", do not apply mainwidth container
  if (pathname === "/") {
    return <>{children}</>;
  }

  return <div className="mainwidth">{children}</div>;
}

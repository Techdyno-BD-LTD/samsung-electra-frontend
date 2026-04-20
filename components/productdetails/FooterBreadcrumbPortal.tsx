"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function FooterBreadcrumbPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  const footerElement = document.getElementById("footer-breadcrumb-target");
  if (!footerElement) return null;

  return createPortal(children, footerElement);
}

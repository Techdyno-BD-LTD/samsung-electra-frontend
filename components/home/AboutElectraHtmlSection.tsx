"use client";

import React, { useEffect, useState } from "react";

export default function AboutElectraHtmlSection() {
  const [title, setTitle] = useState(
    "Electra International: The Ultimate Destination for Home Appliances with Unmatched Value in Bangladesh."
  );
  const [description, setDescription] = useState(
    `Yes, ElectraBD guarantees 100% genuine and official home appliances, including Smart LED TV, Inverter AC, Washing Machine, and various Refrigerator & Freezer models. Every item comes with the full Official Manufacturer's Warranty, ensuring complete peace of mind and product authenticity across Bangladesh.\n\nAbsolutely. We provide Free Delivery in selected areas to make your purchase hassle-free. Furthermore, complex items like Split AC and large Side by Side Refrigerators include Free Installation services by our expert technicians, ensuring perfect setup and immediate use of your appliance.\n\nWe strive to offer the best Home Appliances Price in Bangladesh through a low-cost online model. We support secure online payments, Cash on Delivery (COD), and provide attractive 0% Interest Easy EMI facilities on major bank credit cards for all products.`
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/home-bottom-seo")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((payload) => {
        if (!mounted) return;
        if (payload?.data?.title) setTitle(payload.data.title);
        if (payload?.data?.description) setDescription(payload.data.description);
      })
      .catch(() => {
        // keep defaults on error
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const paragraphs = String(description || "")
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="rounded-sm">
      <div className="space-y-4 text-[15px] leading-relaxed text-slate-700">
        <h1 className="mb-4 border-b border-slate-300 pb-3 text-[clamp(1.45rem,2.4vw,2.2rem)] font-semibold leading-tight text-slate-900">{title}</h1>
        {loading ? (
          <p className="text-[clamp(0.95rem,1.2vw,1.15rem)] text-gray-500">Loading...</p>
        ) : (
          paragraphs.map((para, i) => {
            const lines = para.split(/\r?\n/);
            return (
              <p className="text-[clamp(0.95rem,1.2vw,1.15rem)]" key={i}>
                {lines.map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < lines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            );
          })
        )}
      </div>
    </section>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutElectraHtmlSection() {
  const [founderTag, setFounderTag] = useState("The Founder");
  const [founderName, setFounderName] = useState("AL HAJ MD. SHAHIDULLAH");
  const [brandName, setBrandName] = useState("Electra International");
  const [establishedDate, setEstablishedDate] = useState("Established in 1976");
  const [description, setDescription] = useState(
    `Founded in 1976 by Al-Haj Md. Shahidullah, Electra International began with a visionary promise: to bring reliable quality and modern convenience into every home. What started as a single electronics showroom has grown into one of Bangladesh's...`
  );
  const [buttonText, setButtonText] = useState("About Us");
  const [buttonLink, setButtonLink] = useState("/about");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/homepage/about")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((payload) => {
        if (!mounted) return;
        if (payload?.data?.founder_tag) setFounderTag(payload.data.founder_tag);
        if (payload?.data?.founder_name) setFounderName(payload.data.founder_name);
        if (payload?.data?.brand_name) setBrandName(payload.data.brand_name);
        if (payload?.data?.established_date) setEstablishedDate(payload.data.established_date);
        if (payload?.data?.description) setDescription(payload.data.description);
        if (payload?.data?.button_text) setButtonText(payload.data.button_text);
        if (payload?.data?.button_link) setButtonLink(payload.data.button_link);
        if (payload?.data?.image) setUploadedImage(payload.data.image);
      })
      .catch((err) => {
        console.error("Failed to load homepage about settings:", err);
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
    <section className="relative w-full h-[790px] overflow-hidden select-none bg-black">
      {/* Background Image (1920x790, object-cover to prevent blank spaces) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/homeabout.jpg"
          alt="Home About Background"
          fill
          priority
          sizes="100vw"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Content Overlay Container */}
      <div className="absolute inset-0 bg-black/10 flex items-center">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-start gap-12 md:gap-16 lg:gap-24">
          
          {/* Left Column: Uploaded about image scaled down on xl and original size on 2xl */}
          <div className="relative w-[300px] h-[386px] sm:w-[400px] sm:h-[514px] lg:w-[400px] lg:h-[514px] xl:w-[420px] xl:h-[540px] 2xl:w-[500px] 2xl:h-[643px] flex-shrink-0">
            {uploadedImage ? (
              <Image
                src={uploadedImage}
                alt="About Electra"
                fill
                sizes="(max-width: 1024px) 400px, (max-width: 1536px) 420px, 500px"
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-white/10 rounded-2xl animate-pulse flex items-center justify-center border border-white/20">
                <span className="text-white/40 text-sm">Upload About Image</span>
              </div>
            )}
          </div>

          {/* Right Column: Text content scaled for xl and 2xl resolutions */}
          <div className="flex-1 text-white max-w-2xl text-left">
            <p className="text-sm sm:text-3xl xl:text-2xl 2xl:text-3xl text-gray-400 mb-4 xl:mb-5 2xl:mb-6 tracking-wider font-medium">
              {founderTag}
            </p>
            <h2 className="text-3xl sm:text-4xl xl:text-[36px] 2xl:text-[48px] font-bold leading-tight mb-4 xl:mb-5 2xl:mb-6 text-white drop-shadow">
              {founderName}
            </h2>
            <div className="flex items-center gap-2 mb-4 xl:mb-5 2xl:mb-6 text-sm sm:text-3xl xl:text-[20px] 2xl:text-3xl font-medium">
              <span className="text-white font-bold">{brandName}</span>
              <span className="text-gray-500 font-light">Established in</span>
              <span className="text-white font-bold">{establishedDate.replace(/^Established in\s+/i, '')}</span>
            </div>

            <div className="space-y-4 text-sm sm:text-xl xl:text-base 2xl:text-xl text-gray-300 leading-relaxed tracking-wider drop-shadow-sm font-light mb-6 xl:mb-7 2xl:mb-8">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-full"></div>
                  <div className="h-4 bg-white/20 rounded w-11/12"></div>
                  <div className="h-4 bg-white/20 rounded w-10/12"></div>
                </div>
              ) : (
                paragraphs.map((para, i) => (
                  <p key={i}>
                    {para.split(/\r?\n/).map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        {idx < para.split(/\r?\n/).length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                ))
              )}
            </div>

            {buttonText && (
              <Link 
                href={buttonLink || "/about"}
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md text-sm sm:text-base"
              >
                {buttonText}
              </Link>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
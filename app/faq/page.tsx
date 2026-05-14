"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaWhatsapp } from "react-icons/fa";
import Skeleton from "@/components/common/Skeleton";


export const dynamic = 'force-dynamic';

interface FaqItem {
  question: string;
  answer: string;
}

interface Category {
  name: string;
  items: FaqItem[];
}

interface FaqData {
  categories: Category[];
  contactBanner: {
    title: string;
    description: string;
    btnText: string;
    btnLink: string;
  };
}

export default function FaqPage() {
  const [data, setData] = useState<FaqData | null>(null);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs(true); // Initial load with spinner
  }, []);

  const fetchFaqs = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await fetch("/api/v2/faqs");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="mx-auto w-full py-12 space-y-8 animate-in fade-in duration-500 px-4">
        <Skeleton className="h-12 w-1/3 rounded-xl" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
          <div className="w-full lg:w-2/3 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeCategory = data?.categories[activeCategoryIdx];

  return (
    <div className=" min-h-screen py-6">
      <div className="mainwidth  mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-8 mt-5 text-sm text-slate-500 font-medium">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <span className="mx-2">&gt;</span>
          <span className="text-blue-600 font-semibold">Frequently Asked Questions</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/3 space-y-4">
            <div className="space-y-3">
              {data?.categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCategoryIdx(idx);
                    setOpenFaqIdx(0); // Reset accordion on category change
                  }}
                  className={`w-full text-left px-6 py-5 rounded-xl font-bold transition-all duration-300 ${activeCategoryIdx === idx
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-[#f1f3f7] text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Contact Card */}
            {data?.contactBanner && (
              <div className="mt-8 rounded-3xl bg-gradient-to-br from-[#1b6cd5] to-[#0e4ea3] p-8 text-white relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 leading-tight">
                    {data.contactBanner.title}
                  </h3>
                  <p className="text-blue-100 text-sm mb-8 leading-relaxed opacity-90">
                    {data.contactBanner.description}
                  </p>
                  <a
                    href={data.contactBanner.btnLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors shadow-xl"
                  >
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <FaWhatsapp className="w-3 h-3" />
                    </div>
                    {data.contactBanner.btnText}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Content - Accordion */}
          <div className="w-full lg:w-2/3 space-y-4">
            {activeCategory?.items.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className=" rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full bg-[#f1f3f7] flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className={`text-lg font-bold transition-colors ${isOpen ? "text-blue-600" : "text-slate-800"}`}>
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 ml-4 p-1 rounded-md transition-all ${isOpen ? "bg-white text-blue-600" : "text-slate-400"}`}>
                      {isOpen ? <FaMinus className="w-4 h-4" /> : <FaPlus className="w-4 h-4" />}
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="px-2 pb-8 text-slate-600 leading-relaxed border-t border-slate-200 pt-6 mt-0 mx-8">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}

            {(!activeCategory || activeCategory.items.length === 0) && (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                <p className="text-slate-400 font-medium">No questions found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

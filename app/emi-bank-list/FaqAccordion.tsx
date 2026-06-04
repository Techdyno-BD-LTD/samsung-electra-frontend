'use client';

import React, { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  title: string;
  items: FaqItem[];
}

export default function FaqAccordion({ title, items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full  mx-auto mt-16 pb-12">
      {/* FAQ Header & Subtitle */}
      <div className="text-center mb-8 space-y-2">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
          {title || "EMI FAQs for Electra International"}
        </h2>
        <p className="text-xs md:text-sm text-slate-500 max-w-3xl mx-auto leading-relaxed">
          Our dedicated corporate sales team ensures personalized solutions, timely support, and expert guidance to elevate your business experience.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex items-center justify-between px-5 py-4 bg-[#F8F9FA] hover:bg-slate-100/70 text-left transition-colors focus:outline-none"
              >
                <span className="text-[14px] md:text-[15px] font-bold text-slate-800 flex items-center">
                  <span className="mr-2 font-bold text-slate-600 text-lg leading-none">•</span>
                  {item.question}
                </span>
                <span className="text-slate-500 shrink-0 ml-4">
                  {isOpen ? (
                    <FaCaretUp className="w-4 h-4" />
                  ) : (
                    <FaCaretDown className="w-4 h-4" />
                  )}
                </span>
              </button>

              {/* Accordion Body */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] border-t border-slate-200 bg-white' : 'max-h-0'
                  }`}
              >
                <div className="p-5 md:p-6 text-slate-600 text-[14px] md:text-[15px] leading-relaxed flex items-start">
                  <span className="mr-2 font-bold text-slate-600 text-lg leading-none">•</span>
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import Link from 'next/link';
import React from 'react';
import { HiArrowRight } from "react-icons/hi2";

interface InquirySectionProps {
    title: string;
    subtitle: string;
    btnText: string;
}

const InquirySection: React.FC<InquirySectionProps> = ({ title, subtitle, btnText }) => {
    return (
        <section className="w-full bg-[#F5F5F5] py-10 mt-14 rounded-2xl flex flex-col items-center text-center px-4">
            <h2 className="2xl:text-4xl lg:text-3xl font-semibold text-slate-900 mb-4 tracking-tight">
                {title}
            </h2>
            <p className="text-[18px] 2xl:text-[24px] text-slate-500 font-medium mb-3  leading-relaxed">
                {subtitle}
            </p>

            <Link href="/contact" className="flex items-center gap-4 bg-white border border-slate-100 px-8 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="w-6 h-6 bg-[#1D81FF] rounded-full flex items-center justify-center text-white transition-transform duration-300 group-hover:translate-x-1">
                    <HiArrowRight className="w-4 h-4" />
                </div>
                <span className="text-lg font-semibold text-slate-800 pr-4">
                    {btnText}
                </span>
            </Link>
        </section>
    );
};

export default InquirySection;

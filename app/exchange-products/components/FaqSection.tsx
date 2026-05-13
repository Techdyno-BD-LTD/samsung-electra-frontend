import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

interface FaqSectionProps {
    faq?: {
        title: string;
        items: Array<{
            question: string;
            answer: string;
        }>;
        sidebar: {
            title: string;
            description: string;
            btnText: string;
            btnHref: string;
        };
    };
}

const FaqSection: React.FC<FaqSectionProps> = ({ faq }) => {
    if (!faq) return null;

    return (
        <section className="py-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                {/* Sidebar */}
                <div className="w-full lg:w-[350px]">
                    <div className="bg-[#007BFF] rounded-2xl p-10 text-white flex flex-col items-center text-center h-full min-h-[400px] justify-center relative overflow-hidden group">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150" />
                        
                        <h3 className="text-2xl md:text-3xl font-bold mb-6 relative z-10 leading-tight">
                            {faq.sidebar.title}
                        </h3>
                        <p className="text-blue-50 mb-10 leading-relaxed relative z-10 text-[15px]">
                            {faq.sidebar.description}
                        </p>
                        <Link 
                            href={faq.sidebar.btnHref || "#"} 
                            className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-10"
                        >
                            <FaWhatsapp className="text-2xl" />
                            {faq.sidebar.btnText}
                        </Link>
                    </div>
                </div>

                {/* FAQ Items */}
                <div className="w-full flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 pb-6 border-b border-slate-100">
                        {faq.title}
                    </h2>
                    <div className="space-y-10">
                        {faq.items.map((item, idx) => (
                            <div key={idx} className="space-y-4 group">
                                <h4 className="text-[17px] md:text-[19px] font-bold text-slate-800 flex gap-2">
                                    <span className="text-blue-600 shrink-0">প্রশ্ন :</span>
                                    {item.question}
                                </h4>
                                <div className="flex gap-2">
                                    <span className="font-bold text-slate-700 shrink-0 text-[15px] md:text-[16px]">উত্তর :</span>
                                    <p className="text-slate-500 leading-relaxed text-[15px] md:text-[16px]">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FaqSection;

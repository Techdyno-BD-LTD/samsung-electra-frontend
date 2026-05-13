import React from 'react';

interface TermsSectionProps {
    terms?: {
        title: string;
        intro: string;
        sections: Array<{
            title: string;
            points: string[];
        }>;
    };
}

const TermsSection: React.FC<TermsSectionProps> = ({ terms }) => {
    if (!terms) return null;

    return (
        <section className="py-12">
            <div className="bg-[#F8F9FA] rounded-2xl p-6 md:p-14 border border-slate-100">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">{terms.title}</h2>
                
                {terms.intro && (
                    <div className="mb-10 text-[15px] md:text-[16px] text-slate-700 leading-relaxed whitespace-pre-line">
                        {terms.intro}
                    </div>
                )}

                <div className="space-y-12">
                    {terms.sections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="text-lg md:text-xl font-bold text-slate-800">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.points.map((point, pIdx) => (
                                    <li key={pIdx} className="flex gap-3 text-slate-600 text-[15px] md:text-[16px] leading-relaxed">
                                        <span className="text-slate-400 mt-1">•</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TermsSection;

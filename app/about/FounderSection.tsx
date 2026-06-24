import React from 'react';

interface FounderSectionProps {
    sectionTitle: string;
    name: string;
    year: string;
    description: string;
    image?: string;
}

const FounderSection: React.FC<FounderSectionProps> = ({ sectionTitle, name, year, description, image }) => {
    return (
        <section className="mx-auto w-full max-w-[1400px] p-6 md:p-10 ">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                {/* Text Content */}
                <div className="flex-1 space-y-4">
                    <h2 className="2xl:text-3xl lg:text-2xl font-semibold text-slate-900 tracking-tight">{sectionTitle}</h2>
                    <div>
                        <h3 className="2xl:text-4xl lg:text-3xl font-semibold text-slate-800 leading-tight">{name}</h3>
                        <p className="2xl:text-[16px] lg:text-[14px] text-slate-500 font-medium uppercase tracking-wide mt-1">{year}</p>
                    </div>
                    <p className="text-slate-600 leading-relaxed 2xl:text-[18px] lg:text-[18px] w-10/12 ">
                        {description}
                    </p>
                </div>

                {/* Smaller Image Placeholder */}
                <div className="w-full md:w-1/3 lg:w-[35%]">
                    <div className="relative aspect-[1/1] bg-[#F4F4F4] rounded-sm flex items-center justify-center overflow-hidden border border-slate-100/50">
                        {image ? (
                            <img
                                src={image}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 opacity-50">
                                <svg className="w-32 h-32 text-[#4A90E2]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FounderSection;


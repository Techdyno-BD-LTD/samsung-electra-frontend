import React from 'react';
import Image from 'next/image';

interface Director {
    name: string;
    role: string;
    image: string;
}

interface DirectorsSectionProps {
    sectionTitle: string;
    list: Director[];
}

const DirectorsSection: React.FC<DirectorsSectionProps> = ({ sectionTitle, list }) => {
    return (
        <section className="mt-12 bg-[#f1f1f1] p-6 md:p-12 rounded-sm border border-slate-100">
            {/* Header Card */}
            <div className="w-full bg-white py-6 rounded-sm shadow-sm mb-12 flex justify-center items-center border border-slate-100/50">
                <h2 className="text-xl 2xl:text-3xl font-semibold text-[#005B9E]">
                    {sectionTitle}
                </h2>
            </div>

            {/* Directors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {list.map((director, index) => (
                    <div key={index} className="flex flex-col items-center group">
                        {/* Image Container with aspect ratio maintenance */}
                        <div className="w-full aspect-[3/4] relative bg-white border border-slate-200 overflow-hidden mb-4 transition-transform duration-300 group-hover:scale-[1.02]">
                            <Image
                                src={director.image}
                                alt={director.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                        </div>


                        {/* Director Details */}
                        <div className="text-center">
                            <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1">
                                {director.name}
                            </h3>
                            <p className="text-[14px] md:text-[16px] text-slate-500 font-medium tracking-tight">
                                {director.role}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DirectorsSection;

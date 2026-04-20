import React from 'react';
import Image from 'next/image';

interface Brand {
    name: string;
    logo: string;
}

interface BrandsSectionProps {
    title: string;
    subtitle: string;
    list: Brand[];
}

const BrandsSection: React.FC<BrandsSectionProps> = ({ title, subtitle, list }) => {
    return (
        <section className="flex flex-col items-center gap-6 mt-12 px-4 md:px-0">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="2xl:text-4xl lg:text-3xl text-2xl font-semibold text-[#005B9E]">
                    {title}
                </h2>
                <p className="text-[14px] md:text-[15px] text-gray-500 font-medium">
                    {subtitle}
                </p>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 w-full px-6 md:px-10">
                {list.map((brand, index) => (
                    <div
                        key={index}
                        className="bg-white border border-slate-200 rounded-xl p-8 flex items-center justify-center aspect-[1.8/1] shadow-sm transition-all duration-300 hover:shadow-md group"
                    >

                        <div className="relative w-full h-full">
                            <Image
                                src={brand.logo}
                                alt={brand.name}
                                fill
                                className="object-contain filter transition-all duration-500 group-hover:grayscale-0 grayscale-[0.2]"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BrandsSection;

import React from 'react';
import Image from 'next/image';

interface ServicesSectionProps {
    title: string;
    subtitle: string;
    description: string;
    images: string[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ title, subtitle, description, images }) => {
    return (
        <section className="flex flex-col items-center gap-8 mt-14 px-4 md:px-0">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="2xl:text-4xl lg:text-3xl text-2xl font-semibold text-[#005B9E]">
                    {title}
                </h2>
                <p className="text-[14px] md:text-[15px] text-gray-500 font-medium">
                    {subtitle}
                </p>
            </div>

            {/* Description Paragraph */}
            <div className=" text-center px-6">
                <p className="text-[16px] lg:text-[18px] 2xl:text-[24px] lg:w-9/12 mx-auto font-normal leading-snug text-slate-800">
                    {description}
                </p>
            </div>

            {/* Side-by-side Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-6 md:px-10">

                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-slate-100"
                    >
                        <Image
                            src={image}
                            alt={`Service image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-[1.05]"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ServicesSection;

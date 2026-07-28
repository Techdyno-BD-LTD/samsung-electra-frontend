import React from 'react';
import Image from 'next/image';

interface ContentSectionProps {
    title: string;
    paragraphs: string[];
    image: string;
    isReversed?: boolean;
}

const ContentSection: React.FC<ContentSectionProps> = ({ title, paragraphs, image, isReversed }) => {
    return (
        <section className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-start gap-12 lg:gap-20 mt-16 px-4 md:px-0`}>
            {/* Text Content */}
            <div className="flex-1 space-y-6">
                <h2 className="2xl:text-4xl xl:text-3xl text-2xl font-semibold text-black ">
                    {title}
                </h2>
                <div className="space-y-6">
                    {paragraphs.map((paragraph, index) => (
                        <p key={index} className="2xl:text-[20px] lg:text-[16px] text-gray-800 leading-relaxed text-justify">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>

            {/* Image Container */}
            <div className="w-full md:w-1/2 lg:w-[48%]">
                <div className="relative aspect-[16/9]  rounded-2xl overflow-hidden ">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    />
                </div>
            </div>
        </section>
    );
};



export default ContentSection;

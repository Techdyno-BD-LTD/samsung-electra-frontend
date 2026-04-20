import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Concern {
    id: number;
    image: string;
    btnText: string;
}

interface SisterConcernsProps {
    title: string;
    subtitle: string;
    list: Concern[];
}

const SisterConcerns: React.FC<SisterConcernsProps> = ({ title, subtitle, list }) => {
    return (
        <section className="flex flex-col items-center gap-8 mt-4 px-4 md:px-0">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="2xl:text-4xl lg:text-3xl text-2xl font-semibold text-[#005B9E]">
                    {title}
                </h2>
                <p className="text-[14px] md:text-[15px] text-gray-500 font-medium">
                    {subtitle}
                </p>
            </div>

            {/* Concerns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {list.map((concern) => (
                    <div
                        key={concern.id}
                        className="bg-white border border-slate-100 rounded-lg overflow-hidden flex flex-col p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        {/* Image Container */}
                        <div className="relative aspect-[16/11] bg-[#F7F7F7] rounded-sm overflow-hidden mb-4">
                            <Image
                                src={concern.image}
                                alt={`Concern ${concern.id}`}
                                fill
                                className="object-contain p-4"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                        </div>
                        {/* Button Area */}
                        <Link
                            href="#"
                            className="w-full bg-[#E8F1F9] text-[#005B9E] font-medium py-3 rounded-md text-center hover:bg-[#D9EAF7] transition-colors duration-300"
                        >
                            {concern.btnText}
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SisterConcerns;

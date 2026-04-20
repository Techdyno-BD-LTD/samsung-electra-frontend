import React from 'react';
import Image from 'next/image';

interface NetworkStat {
    value: string;
    label: string;
}

interface NetworkSectionProps {
    title: string;
    stats: NetworkStat[];
    image: string;
}

const NetworkSection: React.FC<NetworkSectionProps> = ({ title, stats, image }) => {
    return (
        <section className="w-full px-6 md:px-10 mt-14">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

                {/* Left Side: Stats */}
                <div className="flex flex-col justify-start gap-6 ">
                    <h2 className="text-3xl 2xl:text-[45px] font-semibold text-slate-800 tracking-tight leading-[1.1]">
                        {title}
                    </h2>

                    <div className="flex flex-col gap-4 max-w-sm w-full">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-[#F3F5F7] rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-transparent hover:border-slate-200 group"
                            >
                                <span className="lg:text-5xl text-4xl 2xl:text-[48px] font-bold text-[#0081FB] leading-tight group-hover:scale-105 transition-transform duration-300">
                                    {stat.value}
                                </span>
                                <span className="text-base md:text-[18px] font-medium text-slate-600 mt-0.5">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Map Image */}
                <div className="relative w-full aspect-[838/962] flex items-center justify-center overflow-hidden rounded-2xl">
                    <Image
                        src={image}
                        alt="Electra Network Map"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </div>
            </div>
        </section>
    );
};

export default NetworkSection;

import React from 'react';
import Link from 'next/link';

interface ContactBannerProps {
    title: string;
    description: string;
    btnText: string;
}

const ContactBanner: React.FC<ContactBannerProps> = ({ title, description, btnText }) => {
    return (
        <section className="w-full bg-[#1A80FE] rounded-lg mt-8 
        px-4 sm:px-6 md:px-10 lg:px-20  
        py-6 md:py-8 
        flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 shadow-lg">

            {/* Text Area */}
            <div className="flex-1 space-y-2 text-center md:text-left">
                <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-semibold text-white tracking-tight">
                    {title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-50 font-light leading-relaxed max-w-3xl mx-auto md:mx-0">
                    {description}
                </p>
            </div>

            {/* Button */}
            <Link
                href="/contact"
                className="bg-white text-[#1A80FE] font-bold 
                text-sm sm:text-base md:text-lg 
                px-6 sm:px-8 md:px-10 
                py-2.5 md:py-3 
                rounded-md hover:bg-white/90 transition-all duration-300 shadow-md 
                hover:translate-y-[-2px] w-full sm:w-auto text-center"
            >
                {btnText}
            </Link>
        </section>
    );
};

export default ContactBanner;
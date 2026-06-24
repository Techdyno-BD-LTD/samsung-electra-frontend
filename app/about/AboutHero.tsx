import React from 'react';

interface AboutHeroProps {
    title: string;
}

const AboutHero: React.FC<AboutHeroProps> = ({ title }) => {
    return (
        <h1 className="text-xl lg:text-4xl 2xl:text-4xl font-semibold text-[#005B9E] leading-tight ">
            {title}
        </h1>
    );
};

export default AboutHero;

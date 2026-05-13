import React from 'react';

interface ServiceHoursHeroProps {
  title: string;
  subtitle?: string;
}

const ServiceHoursHero: React.FC<ServiceHoursHeroProps> = ({ title, subtitle }) => {
  return (
    <div className=" py-12 lg:py-16">
      <div className="mainwidth mx-auto px-4 text-center">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <a href="/" className="hover:text-blue-600">Home</a>
          <span>&gt;</span>
          <span className="text-slate-900 font-medium">service hours</span>
        </nav>

        <div className="bg-[#f4f4f4] rounded-2xl  p-8 lg:p-8  mx-auto">
          <h1 className="text-xl lg:text-2xl font-semibold text-black mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-500 text-lg">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceHoursHero;

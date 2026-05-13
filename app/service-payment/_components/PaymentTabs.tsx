'use client';

import React, { useState } from 'react';

interface Brand {
  name: string;
  content: string;
}

interface PaymentTabsProps {
  brands: Brand[];
}

const PaymentTabs: React.FC<PaymentTabsProps> = ({ brands }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!brands || brands.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Left: Tab Buttons */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          {brands.map((brand, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`
                px-6 py-4 rounded-xl font-bold text-center border transition-all duration-200
                ${activeTab === index 
                  ? 'bg-[#0084FF] border-[#0084FF] text-white shadow-lg scale-105' 
                  : 'bg-white border-slate-100 text-[#1e3a8a] hover:border-blue-200 hover:bg-blue-50'}
              `}
            >
              {brand.name}
            </button>
          ))}
        </div>

        {/* Right: Tab Content */}
        <div className="w-full md:w-2/3 bg-[#FBFBFB] rounded-2xl p-6 lg:p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment:</h2>
          <div 
            className="prose prose-slate max-w-none 
              prose-p:text-slate-600 prose-p:leading-relaxed 
              prose-ol:text-slate-600 prose-li:mb-2"
            dangerouslySetInnerHTML={{ __html: brands[activeTab]?.content || '' }}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentTabs;

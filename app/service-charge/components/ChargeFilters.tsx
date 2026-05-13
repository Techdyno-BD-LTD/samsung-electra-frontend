import React from 'react';

interface ChargeFiltersProps {
  placeholder?: string;
  products: string[];
  brands: string[];
  search: string;
  onSearchChange: (val: string) => void;
  selectedProduct: string;
  onProductChange: (val: string) => void;
  selectedBrand: string;
  onBrandChange: (val: string) => void;
}

const ChargeFilters: React.FC<ChargeFiltersProps> = ({ 
  placeholder, 
  products, 
  brands,
  search,
  onSearchChange,
  selectedProduct,
  onProductChange,
  selectedBrand,
  onBrandChange
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex-1 w-full">
        <input 
          type="text" 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder || "Service Charges For Samsung, Electra, Phillips, Whirlpool"}
          className="w-full px-4 py-3 bg-transparent text-slate-700 focus:outline-none"
        />
      </div>
      
      <div className="w-full lg:w-64 relative border-l lg:border-l border-slate-200 pl-0 lg:pl-4">
        <select 
          value={selectedProduct}
          onChange={(e) => onProductChange(e.target.value)}
          className="w-full px-4 py-3 bg-transparent text-slate-500 appearance-none focus:outline-none cursor-pointer"
        >
          <option value="">Select Products</option>
          {products.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none pr-4">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="w-full lg:w-64 relative border-l lg:border-l border-slate-200 pl-0 lg:pl-4">
        <select 
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="w-full px-4 py-3 bg-transparent text-slate-500 appearance-none focus:outline-none cursor-pointer"
        >
          <option value="">Select Brands</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none pr-4">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <button className="w-full lg:w-auto bg-[#0084FF] hover:bg-blue-600 text-white p-3.5 rounded-lg transition-colors flex items-center justify-center">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
};

export default ChargeFilters;

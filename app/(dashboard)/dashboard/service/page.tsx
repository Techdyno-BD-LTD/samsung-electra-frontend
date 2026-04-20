"use client";

import React from "react";
import { FiPhone, FiChevronDown } from "react-icons/fi";

const ServiceRequestPage = () => {
  const serviceCenters = [
    {
      id: 1,
      city: "DHAKA",
      address: "Tejgaon Industrial Area Colony Bazar, Nobosisto Plot- 011st Floor of millat pharmaceutical Ltd. Dhaka-1208.",
      phones: ["028870407", "028870408", "028870409"]
    },
    {
      id: 2,
      city: "DHAKA",
      address: "1st Floor, Shahadat Hossen Jaardar Market, Chuadanga-7200",
      phones: ["01770791910"]
    }
  ];

  return (
    <div className="flex flex-col gap-6 ">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-6 border-b border-slate-100">
          <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">Service Request</h2>
        </div>

        <div className="p-6 lg:p-8">
           <form className="space-y-6">
              {/* Row 1 */}
              <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700 ml-1">Full Name<span className="text-blue-400">*</span></label>
                 <input type="text" placeholder="Enter last name" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Mobile Number<span className="text-blue-400">*</span></label>
                    <input type="text" placeholder="Enter number" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">E-mail Address<span className="text-blue-400">*</span></label>
                    <input type="email" placeholder="Enter email" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" />
                 </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Service Type<span className="text-blue-400">*</span></label>
                    <div className="relative">
                       <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 appearance-none outline-none focus:border-[#2b7fe8] transition-colors">
                          <option>Select one</option>
                       </select>
                       <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Problem<span className="text-blue-400">*</span> <span className="text-[10px] text-slate-400 font-normal underline">( you can type any language)</span></label>
                    <div className="relative">
                       <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 appearance-none outline-none focus:border-[#2b7fe8] transition-colors">
                          <option>select problem</option>
                       </select>
                       <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Brand<span className="text-blue-400">*</span></label>
                    <div className="relative">
                       <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 appearance-none outline-none focus:border-[#2b7fe8] transition-colors">
                          <option>Select one</option>
                       </select>
                       <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Model number<span className="text-blue-400">*</span></label>
                    <div className="relative">
                       <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 appearance-none outline-none focus:border-[#2b7fe8] transition-colors">
                          <option>enter number</option>
                       </select>
                       <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Warranty<span className="text-blue-400">*</span></label>
                    <div className="relative">
                       <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 appearance-none outline-none focus:border-[#2b7fe8] transition-colors">
                          <option>select warranty</option>
                       </select>
                       <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
              </div>

              {/* Row 5 */}
              <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700 ml-1">Buy From<span className="text-blue-400">*</span></label>
                 <div className="relative">
                    <input type="text" placeholder="From option" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" />
                 </div>
              </div>

              {/* Row 6 */}
              <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700 ml-1">Full-address<span className="text-blue-400">*</span></label>
                 <textarea rows={4} placeholder="Enter full address" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors resize-none overflow-hidden" defaultValue={""} />
              </div>

              {/* Row 7 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Division<span className="text-blue-400">*</span></label>
                    <div className="relative">
                       <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 appearance-none outline-none focus:border-[#2b7fe8] transition-colors">
                          <option>Select one</option>
                       </select>
                       <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Select District<span className="text-blue-400">*</span></label>
                    <div className="relative">
                       <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 appearance-none outline-none focus:border-[#2b7fe8] transition-colors">
                          <option>Select one</option>
                       </select>
                       <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
              </div>

              {/* Row 8 */}
              <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700 ml-1">Message<span className="text-blue-400">*</span></label>
                 <textarea rows={4} placeholder="Enter full address" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors resize-none overflow-hidden" defaultValue={""} />
              </div>

              <div className="flex justify-end pt-4">
                 <button type="button" className="bg-[#2b7fe8] text-white px-12 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a6ed9] transition-all">Submit</button>
              </div>
           </form>

           {/* Service centers section */}
           <div className="mt-12 pt-12 border-t border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Our Service Center</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {serviceCenters.map((sc) => (
                    <div key={sc.id} className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 shadow-sm">
                       <h4 className="text-lg lg:text-xl font-bold text-slate-800 mb-4">{sc.city}</h4>
                       <p className="text-[13px] text-slate-600 font-medium leading-relaxed mb-6 h-12 overflow-hidden">
                          {sc.address}
                       </p>
                       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
                          {sc.phones.map((p, i) => (
                             <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                                <div className="p-1 bg-slate-50 border border-slate-100 rounded-md">
                                   <FiPhone className="text-slate-400" />
                                </div>
                                <span>{p}</span>
                             </div>
                          ))}
                       </div>
                       <button className="w-full bg-slate-900 text-white py-3.5 rounded-full text-sm font-bold hover:bg-black transition-all">
                          Map
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestPage;

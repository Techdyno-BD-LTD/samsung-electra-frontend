"use client";

import React from "react";
import { FiImage, FiChevronDown } from "react-icons/fi";

const ComplainPage = () => {
  return (
    <div className="flex flex-col gap-6 ">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-6 border-b border-slate-100">
          <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">Complains</h2>
        </div>

        <div className="p-6 lg:p-8">
           <form className="space-y-6">
              {/* Row 1 */}
              <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700 ml-1">Full Name<span className="text-blue-400">*</span></label>
                 <input type="text" placeholder="Enter last name" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors shadow-sm" />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Mobile Number<span className="text-blue-400">*</span></label>
                    <input type="text" placeholder="Enter number" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors shadow-sm" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">E-mail Address<span className="text-blue-400">*</span></label>
                    <input type="email" placeholder="Enter email" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors shadow-sm" />
                 </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Product Name<span className="text-blue-400">*</span></label>
                    <input type="text" placeholder="name" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors shadow-sm" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Order Code<span className="text-blue-400">*</span></label>
                    <input type="text" placeholder="enter code" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors shadow-sm" />
                 </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Date of purchase<span className="text-blue-400">*</span></label>
                    <input type="date" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 outline-none focus:border-[#2b7fe8] transition-colors shadow-sm" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Complain Category<span className="text-blue-400">*</span></label>
                    <div className="relative">
                       <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 appearance-none outline-none focus:border-[#2b7fe8] transition-colors shadow-sm">
                          <option>select category</option>
                       </select>
                       <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
              </div>

              {/* Row 5 */}
              <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700 ml-1">Detailed Description of the Complaint<span className="text-blue-400">*</span></label>
                 <textarea rows={6} placeholder="write" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors resize-none overflow-hidden shadow-sm" defaultValue={""} />
              </div>

              {/* Row 6: Upload */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4">
                 <div className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#2b7fe8] transition-colors">
                       <FiImage className="text-xl" />
                    </div>
                    <div>
                       <p className="text-[11px] text-slate-400 font-medium group-hover:text-slate-600">Upload Supporting Documents (if any)</p>
                    </div>
                 </div>
                 <button type="button" className="bg-[#2b7fe8] text-white px-12 py-3 rounded-lg text-sm font-semibold hover:bg-[#1a6ed9] transition-all shadow-md">Submit</button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default ComplainPage;

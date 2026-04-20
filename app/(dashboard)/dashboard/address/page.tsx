"use client";

import React from "react";
import { FiEdit } from "react-icons/fi";

const AddressPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-6 border-b border-slate-100">
          <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">Manage Addresses</h2>
        </div>

        <div className="p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Address Card */}
          <div className="flex-1 w-full lg:max-w-2xl bg-gray-50 rounded-xl p-8 border border-gray-100">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Aman ullah</h3>
              <p className="text-sm text-slate-700 mb-1">01925786108</p>
              <p className="text-sm text-slate-700 mb-4">tech.aman@gmail.com</p>
              <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                Level 4, Techdyno BD LTD, Haq&apos;s Plaza, 4th Floor,, 1, Dhaka, Mohammadpur, Asad Avenue Mohammadpur, 1207
              </p>
            </div>
            
            <div className="h-[1px] bg-gray-200 mb-4"></div>
            
            <button className="flex items-center gap-2 text-slate-400 hover:text-[#2b7fe8] transition-colors text-sm font-medium">
              <FiEdit className="text-base" />
              <span>Edit Address</span>
            </button>
          </div>

          {/* Add New Address Button */}
          <div className="flex justify-center lg:justify-end">
            <button className="bg-[#2b7fe8] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-[#1a6ed9] transition-all hover:-translate-y-0.5 shadow-sm">
              Add new address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;

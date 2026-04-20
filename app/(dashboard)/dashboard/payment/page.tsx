"use client";

import React from "react";
import { FiCreditCard } from "react-icons/fi";

const PaymentMethodPage = () => {
  return (
    <div className="flex flex-col gap-6 ">
      <div className="bg-white rounded-2xl p-12 lg:p-24 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <FiCreditCard className="text-7xl text-slate-800" />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
            <div className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
              ×
            </div>
          </div>
        </div>
        <p className="text-slate-500 font-medium text-sm">Your wallet is empty</p>
      </div>
    </div>
  );
};

export default PaymentMethodPage;

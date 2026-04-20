"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiShoppingBag,
  FiCopy
} from "react-icons/fi";
import { formatCurrency } from "@/lib/currencyUtils";

const OrdersPage = () => {
  const [hasOrders] = useState(true); // Set to true to show the UI from the image

  if (!hasOrders) {
    return (
      <div className="bg-white rounded-2xl p-12 lg:p-20 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 flex flex-col items-center justify-center text-center">
        <div className="relative w-32 h-32 mb-6">
          <Image
            src="/images/shop.png" // Using existing shop icon or finding a bag with x
            alt="Empty Orders"
            width={128}
            height={128}
            className="opacity-20 translate-y-2 grayscale"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <FiShoppingBag className="text-6xl text-blue-100" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-slate-200 rounded-full flex items-center justify-center bg-white">
              <span className="text-2xl font-bold text-slate-300">×</span>
            </div>
          </div>
        </div>
        <p className="text-slate-600 mb-8 max-w-sm">
          There are currently no active orders in your account.
        </p>
        <Link
          href="/shop"
          className="bg-[#2b7fe8] text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-[#1a6ed9] hover:-translate-y-0.5"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* My Orders Section */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-slate-100">
          <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">My Orders</h2>
        </div>

        {/* Order Table Header */}
        <div className="bg-slate-100 px-6 lg:px-8 py-1 grid grid-cols-4 text-xs lg:text-sm font-medium text-slate-900 border-b border-slate-100">
          <div>• Order id</div>
          <div>• Amount</div>
          <div>• Quantity</div>
          <div>• Date</div>
        </div>

        {/* Individual Order Row */}
        <div className="p-6 lg:p-5">
          <div className="grid grid-cols-4 items-center mb-5">
            <div className="flex items-center gap-2">
              <span className="text-[#2b7fe8] font-semibold text-sm lg:text-base">Order #1201139258</span>
              <button className="text-slate-300 hover:text-slate-500 cursor-pointer" title="Copy ID">
                <FiCopy size={14} />
              </button>
            </div>
            <div className="font-semibold text-slate-800 text-sm lg:text-base">
              {formatCurrency(156000)}
            </div>
            <div className="text-slate-600 text-sm lg:text-base">01 -item</div>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <span className="text-slate-600 text-sm">21 Jan 2026 -2:48pm</span>
              <button className="bg-[#2b7fe8] text-white px-4 lg:px-6 py-2 rounded-lg text-xs lg:text-sm font-semibold whitespace-nowrap hover:bg-[#1a6ed9] transition-colors">
                View Details
              </button>
            </div>
          </div>

          {/* Success Notification */}
          <div className="bg-[#f0f9ff] border border-blue-50 rounded-xl p-6 lg:p-6 mb-8">
            <p className="text-[#004b91] text-lg font-medium mb-3">
              Order submitted successfully. Status updates will be provided upon confirmation.
            </p>

            {/* Order Progress Timeline */}
            <div className="relative pt-2">
              <div className="absolute top-[1.375rem] left-0 right-0 h-[2px] border-t-2 border-dashed border-slate-300"></div>
              <div className="grid grid-cols-3 relative">
                {/* Step 1 */}
                <div className="flex flex-col items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#004b91] border-4 border-blue-50 z-10"></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Order Placed</h4>
                    <p className="text-[10px] text-slate-400">21 Jan 2026 -2:43 PM</p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-4 border-white z-10"></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Order Confirmed</h4>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="flex flex-col items-end gap-3 text-right">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-4 border-white z-10"></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Order Delivered</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2">Product Details</h3>

            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="w-32 h-32   rounded-xl  flex items-center justify-center">
                <Image
                  src="/images/blender.png"
                  alt="Product"
                  width={128}
                  height={128}
                  className="object-fit"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1 text-center lg:text-left">
                <p className="text-xs text-slate-400 font-medium">Electra</p>
                <h4 className="text-lg font-semibold text-slate-800">Grinder 750 w | Ultima-MRN</h4>
                <p className="text-xs text-slate-500 font-medium">QTY : 01</p>
              </div>

              <div className="text-slate-600 font-medium text-sm">
                Cash On Delivery
              </div>

              <div className="flex flex-col items-center lg:items-end gap-3">
                <div className="text-2xl font-semibold text-slate-900 leading-none">
                  {formatCurrency(156504)}
                </div>
                <button className="bg-[#2b7fe8] text-white px-8 py-2 rounded-lg text-[14px] font-semibold flex items-center gap-2 hover:bg-[#1a6ed9] transition-colors shadow-sm">
                  Add to cart
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Cancellation & Payment Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
            {/* Cancellation Section */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Order Cancellation</h3>
              <div className="bg-transparent rounded-xl border-0">
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  You can cancel your order before it is confirmed by Singer. If approved, your order will be canceled and refunds will be issued after applicable deductions. For more information, please review Singers
                  <span className="font-bold text-slate-800 ml-1">Cancellation & Refund Policy</span>. approved cancellations will be refunded after applicable deductions.
                </p>
                <button className="w-full py-4 rounded-full border border-red-200 bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-colors">
                  Request Cancellation
                </button>
              </div>
            </div>

            {/* Payment Summary Section */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Payment Summary</h3>
              <div className="space-y-4 border border-gray-200 p-4 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-0.5">Products</p>
                    <p className="text-[10px] text-slate-400">Grinder 750 W | Ultimo-MRN</p>
                  </div>
                  <span className="font-bold text-slate-800 text-sm">{formatCurrency(156504)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-y border-slate-50">
                  <p className="text-sm font-bold text-slate-800">Sub-total</p>
                  <span className="font-bold text-slate-800 text-sm">{formatCurrency(156504)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-400 font-medium">Shipping Delivery</p>
                  <span className="font-bold text-slate-800 text-sm">{formatCurrency(500)}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <p className="text-base font-bold text-[#004b91]">Total</p>
                  <span className="font-black text-lg text-[#004b91]">{formatCurrency(157000)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

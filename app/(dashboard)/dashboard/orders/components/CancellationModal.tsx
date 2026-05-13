"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import { formatCurrency } from "@/lib/currencyUtils";

interface Order {
  id: number;
  code: string;
  grand_total: number;
  delivery_status: string;
  payment_status: string;
  payment_type: string;
  created_at: string;
  cancel_request: boolean;
  cancel_request_at: string | null;
  cancel_reason: string | null;
}

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_thumbnail: string;
  product_slug: string;
  variation: string | null;
  price: number;
  quantity: number;
}

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  items: OrderItem[];
  token: string;
  onSuccess: (message: string) => void;
}

const CancellationModal = ({ isOpen, onClose, order, items, token, onSuccess }: CancellationModalProps) => {
  const [reason, setReason] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleSubmit = async () => {
    if (!reason || !agreed) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v2/order/request-cancellation/${order.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(data.message);
        onClose();
      }
    } catch (error) {
      console.error("Cancellation request failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  const reasons = [
    "Placed Order Incorrectly",
    "Delivery Delay",
    "Better Offer Found",
    "No Longer Needed",
    "Payment / Address Problem",
    "Other",
  ];

  const firstItem = items[0] || {};

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="text-lg font-bold text-[#004b91] w-full text-center">Order Cancellation</h3>
          <button onClick={onClose} className="absolute right-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
            <FiX className="text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">Order Summery</h4>
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl">
              <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 p-2 flex-shrink-0">
                <Image
                  src={firstItem.product_thumbnail || "/images/placeholder.png"}
                  alt={firstItem.product_name || "Product"}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 font-medium mb-0.5">Electra</p>
                <h5 className="text-base font-bold text-slate-800 truncate">{firstItem.product_name}</h5>
                <p className="text-xs text-slate-500 mt-1 uppercase font-medium">QTY : {String(firstItem.quantity).padStart(2, '0')}</p>
              </div>
              <div className="text-right">
                 <p className="text-lg font-bold text-slate-900 leading-tight">{formatCurrency(order.grand_total)}</p>
                 <div className="mt-2 bg-blue-500 text-white text-[10px] px-3 py-1 rounded-md font-bold uppercase inline-block">
                    {order.payment_type?.replace(/_/g, ' ') || 'CASH ON DELIVERY'}
                 </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-4 italic">
              <span className="font-bold">Note : </span> You Can Cancel Your Order Before It Is Confirmed By Electra International.
            </p>
          </div>

          <div className="mb-6">
             <label className="block text-base font-bold text-slate-700 mb-3">
                Cancellation Reasons<span className="text-red-500">*</span>
             </label>
             <div className="relative">
                <select 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#2b7fe8]/20 focus:border-[#2b7fe8] outline-none transition-all appearance-none"
                >
                  <option value="">Select option</option>
                  {reasons.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <FiChevronDown size={20} />
                </div>
             </div>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <input 
              type="checkbox" 
              id="agree-cancel"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-500 cursor-pointer"
            />
            <label htmlFor="agree-cancel" className="text-[11px] text-slate-600 cursor-pointer select-none">
              By Cancelling The Order You Agree To Electra International <span className="font-bold text-slate-800 underline">Cancellation & Refund Policy</span>
            </label>
          </div>

          <div className="flex justify-end">
            <button 
                disabled={!reason || !agreed || submitting}
                onClick={handleSubmit}
                className="bg-[#ff3131] text-white font-bold px-10 py-3.5 rounded-full hover:bg-red-600 transition-all shadow-lg shadow-red-100 disabled:opacity-50 disabled:grayscale disabled:shadow-none flex items-center justify-center gap-2"
            >
                {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                "Request Cancellation"
                )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CancellationModal;

"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiGift, FiCopy, FiCheck } from "react-icons/fi";
import { formatCurrency } from "@/lib/currencyUtils";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/features/toast/toastSlice";
import Skeleton from "@/components/common/Skeleton";

interface UserVoucher {
  id: number;
  code: string;
  discount: number;
  start_date: number | null;
  end_date: number | null;
  status: "Active" | "Used";
}

export default function UserGiftVouchersPage() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const [vouchers, setVouchers] = useState<UserVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchVouchers = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/v2/user/gift-vouchers", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (response.ok) {
        const payload = await response.json();
        setVouchers(payload.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch user gift vouchers", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    dispatch(
      showToast({
        message: "Voucher code copied to clipboard!",
        type: "info",
      })
    );
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (unix: number | null) => {
    if (!unix) return "N/A";
    const date = new Date(unix * 1000);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 select-none">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl lg:text-2xl font-semibold text-slate-800 flex items-center gap-3">
            <FiGift className="text-[#2b7fe8]" />
            <span>My Gift Vouchers</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            ({vouchers.length < 10 ? `0${vouchers.length}` : vouchers.length}) Vouchers
          </span>
        </div>

        {vouchers.length === 0 ? (
          <div className="p-12 lg:p-20 flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 mb-6">
              <Image
                src="/images/shop.png"
                alt="Empty Vouchers"
                width={128}
                height={128}
                className="opacity-20 translate-y-2 grayscale"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <FiGift className="text-6xl text-blue-100" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-slate-200 rounded-full flex items-center justify-center bg-white">
                  <span className="text-2xl font-bold text-slate-300">×</span>
                </div>
              </div>
            </div>
            <p className="text-slate-600 mb-8 max-w-sm">
              You haven&apos;t purchased any Gift Vouchers yet. You can find and purchase vouchers in our Gift Voucher shop.
            </p>
            <Link
              href="/gift-voucher"
              className="bg-[#2b7fe8] text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-[#1a6ed9] hover:-translate-y-0.5"
            >
              Buy Gift Voucher
            </Link>
          </div>
        ) : (
          <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className={`relative border rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                  voucher.status === "Active"
                    ? "border-amber-200 bg-amber-50/10 shadow-[0_4px_15px_rgba(245,158,11,0.03)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.08)]"
                    : "border-slate-100 bg-slate-50/40 opacity-75"
                }`}
              >
                {/* Status Badges */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400">
                    Expiry: {formatDate(voucher.end_date)}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      voucher.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {voucher.status}
                  </span>
                </div>

                {/* Voucher Title and Value */}
                <div className="space-y-1 mb-6">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Gift Voucher
                  </h3>
                  <div className="text-3xl font-black text-slate-800">
                    {formatCurrency(voucher.discount)}
                  </div>
                </div>

                {/* Code Clipboard Copier section */}
                <div className="mt-auto bg-white border border-slate-100 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
                  <span className="font-mono font-bold text-slate-800 text-base select-all">
                    {voucher.code}
                  </span>
                  <button
                    disabled={voucher.status !== "Active"}
                    onClick={() => handleCopyCode(voucher.code)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      voucher.status !== "Active"
                        ? "text-slate-300 cursor-not-allowed"
                        : copiedCode === voucher.code
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-[#2b7fe8] hover:bg-blue-50"
                    }`}
                    title="Copy Code"
                  >
                    {copiedCode === voucher.code ? <FiCheck size={18} /> : <FiCopy size={18} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

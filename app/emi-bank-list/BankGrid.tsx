'use client';

import React, { useState } from "react";
import Image from "next/image";

interface BankGridProps {
  banks: any[];
}

export default function BankGrid({ banks }: BankGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(banks.length / itemsPerPage);

  const displayedBanks = banks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {displayedBanks.map((bank) => {
          const activeTenures = [
            { key: "3", val: bank.rate_3_months },
            { key: "6", val: bank.rate_6_months },
            { key: "9", val: bank.rate_9_months },
            { key: "12", val: bank.rate_12_months },
            { key: "18", val: bank.rate_18_months },
            { key: "24", val: bank.rate_24_months },
            { key: "30", val: bank.rate_30_months },
            { key: "36", val: bank.rate_36_months },
          ]
            .filter((r) => r.val !== null && r.val !== undefined && r.val !== "")
            .map((r) => r.key);

          const tenureStr =
            activeTenures.length > 0 ? activeTenures.join(", ") : "N/A";

          return (
            <div
              key={bank.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Centered Bank Logo */}
              <div className="h-28 w-full flex items-center justify-center mb-6 relative">
                {bank.logo ? (
                  <Image
                    src={bank.logo}
                    alt={bank.name}
                    width={220}
                    height={90}
                    className="object-contain max-h-full max-w-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-sm">
                    {bank.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Bank Name */}
              <h3 className="font-extrabold text-slate-900 text-[17px] md:text-[19px] mb-3 leading-snug">
                {bank.name}
              </h3>

              {/* EMI Tenure */}
              <div className="text-[14px] md:text-[15px] text-slate-700 font-semibold">
                EMI Tenure: {tenureStr} {activeTenures.length > 0 ? "Months" : ""}
              </div>

              {/* Minimum Purchase */}
              {bank.minimum_purchase !== null && bank.minimum_purchase !== undefined && (
                <div className="text-[14px] md:text-[15px] text-slate-700 font-semibold mt-1.5">
                  Minimum Purchase: ৳ {Number(bank.minimum_purchase).toLocaleString("en-IN")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-6 py-2.5 border border-slate-300 hover:border-slate-400 text-slate-700 font-bold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[14px] bg-white shadow-sm"
          >
            Prev
          </button>
          <span className="text-sm font-semibold text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-2.5 border border-slate-300 hover:border-slate-400 text-slate-700 font-bold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[14px] bg-white shadow-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
